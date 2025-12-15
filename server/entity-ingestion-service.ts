import { db } from './db';
import { entities, entitySources, entityScores } from '@shared/schema';
import { externalAPIService } from './external-api-service';
import { eq, and, or, like } from 'drizzle-orm';

interface GEMEntity {
  type: 'person' | 'organization' | 'product' | 'event' | 'creative_work' | 'place';
  canonicalName: string;
  aliases: string[];
  description?: string;
  homepage?: string;
  sameAs: string[];
  externalIds: {
    wikidata?: string;
    wikipedia?: string;
    musicbrainz?: string;
    crunchbase?: string;
  };
  metadata: {
    image?: string;
    country?: string;
    founded?: string;
    industry?: string[];
    [key: string]: any;
  };
  sources: Array<{
    url: string;
    type: string;
    confidence: number;
  }>;
  ingestionSource: 'wikipedia' | 'wikidata' | 'musicbrainz' | 'crunchbase';
}

interface PanelReadinessScore {
  score: number;
  breakdown: {
    identifiers: number;
    sameAs: number;
    jsonLdCompleteness: number;
    evidenceDiversity: number;
    consistency: number;
    crawlHealth: number;
  };
  gaps: string[];
}

export class EntityIngestionService {
  private systemUserId: string = 'system'; 

  async ingestFromWikipedia(searchQuery: string): Promise<string[]> {
    try {
      console.log(`[Ingestion] Searching Wikipedia for: "${searchQuery}"`);
      const results = await externalAPIService.searchWikipedia(searchQuery, 5);
      const createdEntityIds: string[] = [];

      for (const result of results) {
        const gem = await this.normalizeWikipediaToGEM(result);
        const entityId = await this.createOrUpdateEntity(gem);
        if (entityId) {
          createdEntityIds.push(entityId);
        }
      }

      console.log(`[Ingestion] Created ${createdEntityIds.length} entities from Wikipedia`);
      return createdEntityIds;
    } catch (error: any) {
      console.error('[Ingestion] Wikipedia ingestion failed:', error.message);
      throw error;
    }
  }

  async ingestFromMusicBrainz(searchQuery: string): Promise<string[]> {
    try {
      console.log(`[Ingestion] Searching MusicBrainz for: "${searchQuery}"`);
      const results = await externalAPIService.searchMusicBrainz(searchQuery, 'artist', 5);
      const createdEntityIds: string[] = [];

      for (const result of results) {
        const gem = await this.normalizeMusicBrainzToGEM(result);
        const entityId = await this.createOrUpdateEntity(gem);
        if (entityId) {
          createdEntityIds.push(entityId);
        }
      }

      console.log(`[Ingestion] Created ${createdEntityIds.length} entities from MusicBrainz`);
      return createdEntityIds;
    } catch (error: any) {
      console.error('[Ingestion] MusicBrainz ingestion failed:', error.message);
      throw error;
    }
  }

  private async normalizeWikipediaToGEM(wikiData: any): Promise<GEMEntity> {
    const type = this.inferEntityType(wikiData.categories || []);
    const slug = this.generateSlug(wikiData.title);

    return {
      type,
      canonicalName: wikiData.title,
      aliases: [],
      description: wikiData.extract?.substring(0, 500) || wikiData.description,
      homepage: wikiData.url,
      sameAs: [wikiData.url],
      externalIds: {
        wikipedia: wikiData.url,
      },
      metadata: {
        image: wikiData.thumbnail,
        categories: wikiData.categories,
        pageId: wikiData.pageId,
      },
      sources: [
        {
          url: wikiData.url,
          type: 'wikipedia',
          confidence: 1.0,
        },
      ],
      ingestionSource: 'wikipedia',
    };
  }

  private async normalizeMusicBrainzToGEM(mbData: any): Promise<GEMEntity> {
    return {
      type: 'person',
      canonicalName: mbData.name,
      aliases: [],
      description: mbData.disambiguation || `Music artist${mbData.country ? ` from ${mbData.country}` : ''}`,
      homepage: undefined,
      sameAs: [`https://musicbrainz.org/artist/${mbData.id}`],
      externalIds: {
        musicbrainz: mbData.id,
      },
      metadata: {
        country: mbData.country,
        type: mbData.type,
        lifeSpan: mbData.lifeSpan,
        area: mbData.area?.name,
      },
      sources: [
        {
          url: `https://musicbrainz.org/artist/${mbData.id}`,
          type: 'musicbrainz',
          confidence: 1.0,
        },
      ],
      ingestionSource: 'musicbrainz',
    };
  }

  private inferEntityType(categories: string[]): 'person' | 'organization' | 'product' | 'event' | 'creative_work' | 'place' {
    const catStr = categories.join(' ').toLowerCase();

    if (catStr.includes('people') || catStr.includes('births') || catStr.includes('deaths') || catStr.includes('musicians') || catStr.includes('artists')) {
      return 'person';
    }
    if (catStr.includes('companies') || catStr.includes('organizations')) {
      return 'organization';
    }
    if (catStr.includes('products') || catStr.includes('software') || catStr.includes('hardware')) {
      return 'product';
    }
    if (catStr.includes('events') || catStr.includes('conferences')) {
      return 'event';
    }
    if (catStr.includes('places') || catStr.includes('cities') || catStr.includes('countries')) {
      return 'place';
    }

    return 'person';
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 200);
  }

  private async createOrUpdateEntity(gem: GEMEntity): Promise<string | null> {
    try {
      const slug = this.generateSlug(gem.canonicalName);

      const existing = await db.query.entities.findFirst({
        where: eq(entities.slug, slug),
      });

      if (existing) {
        console.log(`[Ingestion] Entity already exists: ${slug}`);
        return existing.id;
      }

      const systemUser = await this.getOrCreateSystemUser();

      const [newEntity] = await db.insert(entities).values({
        userId: systemUser.id,
        type: gem.type,
        slug,
        name: gem.canonicalName,
        description: gem.description,
        status: 'published',
        visibility: 'public',
        claimStatus: 'unclaimed',
        externalIds: JSON.stringify(gem.externalIds),
        ingestionSource: gem.ingestionSource,
        metadata: JSON.stringify(gem.metadata),
      }).returning();

      for (const source of gem.sources) {
        await db.insert(entitySources).values({
          entityId: newEntity.id,
          url: source.url,
          sourceType: source.type,
          score: Math.round(source.confidence * 100),
          verifiedAt: new Date(),
          metadata: JSON.stringify({ ingested: true }),
        });
      }

      const readinessScore = await this.calculatePanelReadiness(newEntity.id);
      await db.insert(entityScores).values({
        entityId: newEntity.id,
        notabilityScore: readinessScore.score,
        authorityScore: readinessScore.breakdown.evidenceDiversity,
        engagementScore: 0,
        freshnessScore: 100,
        metadata: JSON.stringify(readinessScore),
      });

      console.log(`[Ingestion] Created entity: ${slug} (ID: ${newEntity.id}, Score: ${readinessScore.score})`);
      return newEntity.id;
    } catch (error: any) {
      console.error('[Ingestion] Failed to create entity:', error.message);
      return null;
    }
  }

  async calculatePanelReadiness(entityId: string): Promise<PanelReadinessScore> {
    const entity = await db.query.entities.findFirst({
      where: eq(entities.id, entityId),
      with: {
        sources: true,
      },
    });

    if (!entity) {
      throw new Error('Entity not found');
    }

    const externalIds = entity.externalIds ? JSON.parse(entity.externalIds) : {};
    const sources = (entity as any).sources || [];

    const identifiersScore = Object.keys(externalIds).length * 8.33;
    const sameAsScore = Math.min(sources.length * 6.67, 20);
    const jsonLdScore = (entity.name && entity.description && entity.type) ? 20 : 10;
    const evidenceScore = sources.filter((s: any) => ['wikipedia', 'wikidata', 'musicbrainz'].includes(s.sourceType)).length * 5;
    const consistencyScore = 10;
    const crawlScore = 10;

    const totalScore = Math.min(
      identifiersScore + sameAsScore + jsonLdScore + evidenceScore + consistencyScore + crawlScore,
      100
    );

    const gaps: string[] = [];
    if (identifiersScore < 25) gaps.push('Add more external identifiers (Wikidata, MusicBrainz, Crunchbase)');
    if (sameAsScore < 20) gaps.push('Add more authoritative sameAs references');
    if (jsonLdScore < 20) gaps.push('Complete entity description and metadata');
    if (evidenceScore < 15) gaps.push('Add more diverse evidence sources');

    return {
      score: Math.round(totalScore),
      breakdown: {
        identifiers: Math.round(Math.min(identifiersScore, 25)),
        sameAs: Math.round(sameAsScore),
        jsonLdCompleteness: Math.round(jsonLdScore),
        evidenceDiversity: Math.round(Math.min(evidenceScore, 15)),
        consistency: consistencyScore,
        crawlHealth: crawlScore,
      },
      gaps: gaps.slice(0, 5),
    };
  }

  private async getOrCreateSystemUser(): Promise<{ id: string }> {
    const { users } = await import('@shared/schema');
    
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, 'system@graphlynk.io'),
    });

    if (existingUser) {
      return existingUser;
    }

    const [newUser] = await db.insert(users).values({
      email: 'system@graphlynk.io',
      name: 'System',
      plan: 'AUTHORITY',
    }).returning();

    return newUser;
  }
}

export const entityIngestionService = new EntityIngestionService();

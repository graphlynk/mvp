interface WikipediaExtract {
  title: string;
  extract: string;
  pageId: number;
  url: string;
  description?: string;
  thumbnail?: string;
  categories?: string[];
}

interface WikidataEntity {
  id: string;
  label: string;
  description?: string;
  aliases?: string[];
  claims?: any;
  sitelinks?: any;
}

interface MusicBrainzArtist {
  id: string;
  name: string;
  type?: string;
  disambiguation?: string;
  country?: string;
  lifeSpan?: {
    begin?: string;
    end?: string;
  };
  area?: {
    name: string;
  };
}

export class ExternalAPIService {
  private readonly wikipediaApiBase = 'https://en.wikipedia.org/w/api.php';
  private readonly wikidataApiBase = 'https://www.wikidata.org/w/api.php';
  private readonly musicBrainzApiBase = 'https://musicbrainz.org/ws/2';
  private readonly userAgent = 'Graphlynk/1.0 (https://graphlynk.io; AI-powered Knowledge Graph)';

  private async fetchWithRetry(url: string, options: any = {}, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'User-Agent': this.userAgent,
            ...options.headers,
          },
        });

        if (response.status === 429) {
          const delay = Math.pow(2, i) * 1000;
          console.log(`Rate limited, waiting ${delay}ms before retry ${i + 1}/${retries}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error: any) {
        if (i === retries - 1) throw error;
        console.error(`Fetch attempt ${i + 1} failed:`, error.message);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  async searchWikipedia(query: string, limit: number = 10): Promise<WikipediaExtract[]> {
    try {
      const searchUrl = `${this.wikipediaApiBase}?` + new URLSearchParams({
        action: 'opensearch',
        search: query,
        limit: limit.toString(),
        format: 'json',
      });

      const searchData = await this.fetchWithRetry(searchUrl);
      const titles = searchData[1] as string[];

      if (!titles || titles.length === 0) {
        return [];
      }

      const results: WikipediaExtract[] = [];

      for (const title of titles) {
        const pageData = await this.getWikipediaPage(title);
        if (pageData) {
          results.push(pageData);
        }
      }

      return results;
    } catch (error: any) {
      console.error('Wikipedia search error:', error.message);
      throw new Error(`Wikipedia search failed: ${error.message}`);
    }
  }

  async getWikipediaPage(title: string): Promise<WikipediaExtract | null> {
    try {
      const url = `${this.wikipediaApiBase}?` + new URLSearchParams({
        action: 'query',
        format: 'json',
        titles: title,
        prop: 'extracts|pageimages|categories|description',
        exintro: 'true',
        explaintext: 'true',
        pithumbsize: '400',
      });

      const data = await this.fetchWithRetry(url);
      const pages = data.query?.pages;
      
      if (!pages) return null;

      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      if (pageId === '-1') return null;

      return {
        pageId: parseInt(pageId),
        title: page.title,
        extract: page.extract || '',
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
        description: page.description,
        thumbnail: page.thumbnail?.source,
        categories: page.categories?.map((c: any) => c.title.replace('Category:', '')) || [],
      };
    } catch (error: any) {
      console.error(`Wikipedia page fetch error for "${title}":`, error.message);
      return null;
    }
  }

  async getWikidataEntity(wikidataId: string): Promise<WikidataEntity | null> {
    try {
      const url = `${this.wikidataApiBase}?` + new URLSearchParams({
        action: 'wbgetentities',
        ids: wikidataId,
        format: 'json',
      });

      const data = await this.fetchWithRetry(url);
      const entity = data.entities?.[wikidataId];

      if (!entity) return null;

      return {
        id: wikidataId,
        label: entity.labels?.en?.value || '',
        description: entity.descriptions?.en?.value,
        aliases: entity.aliases?.en?.map((a: any) => a.value) || [],
        claims: entity.claims,
        sitelinks: entity.sitelinks,
      };
    } catch (error: any) {
      console.error(`Wikidata fetch error for "${wikidataId}":`, error.message);
      return null;
    }
  }

  async searchWikidata(query: string, limit: number = 10): Promise<WikidataEntity[]> {
    try {
      const url = `${this.wikidataApiBase}?` + new URLSearchParams({
        action: 'wbsearchentities',
        search: query,
        language: 'en',
        limit: limit.toString(),
        format: 'json',
      });

      const data = await this.fetchWithRetry(url);
      const results = data.search || [];

      return results.map((item: any) => ({
        id: item.id,
        label: item.label,
        description: item.description,
        aliases: item.aliases || [],
      }));
    } catch (error: any) {
      console.error('Wikidata search error:', error.message);
      throw new Error(`Wikidata search failed: ${error.message}`);
    }
  }

  async searchMusicBrainz(query: string, type: 'artist' | 'release-group' = 'artist', limit: number = 10): Promise<MusicBrainzArtist[]> {
    try {
      const url = `${this.musicBrainzApiBase}/${type}/?` + new URLSearchParams({
        query: query,
        fmt: 'json',
        limit: limit.toString(),
      });

      const data = await this.fetchWithRetry(url);
      const results = data[type + 's'] || data.artists || [];

      return results.map((item: any) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        disambiguation: item.disambiguation,
        country: item.country,
        lifeSpan: item['life-span'],
        area: item.area,
      }));
    } catch (error: any) {
      console.error('MusicBrainz search error:', error.message);
      throw new Error(`MusicBrainz search failed: ${error.message}`);
    }
  }

  async getMusicBrainzArtist(mbid: string): Promise<MusicBrainzArtist | null> {
    try {
      const url = `${this.musicBrainzApiBase}/artist/${mbid}?fmt=json&inc=aliases+url-rels`;

      const artist = await this.fetchWithRetry(url);

      return {
        id: artist.id,
        name: artist.name,
        type: artist.type,
        disambiguation: artist.disambiguation,
        country: artist.country,
        lifeSpan: artist['life-span'],
        area: artist.area,
      };
    } catch (error: any) {
      console.error(`MusicBrainz artist fetch error for "${mbid}":`, error.message);
      return null;
    }
  }

  extractWikipediaTitle(url: string): string | null {
    const match = url.match(/wikipedia\.org\/wiki\/([^#?]+)/);
    return match ? decodeURIComponent(match[1].replace(/_/g, ' ')) : null;
  }

  extractWikidataId(url: string): string | null {
    const match = url.match(/wikidata\.org\/wiki\/(Q\d+)/);
    return match ? match[1] : null;
  }

  extractMusicBrainzId(url: string): string | null {
    const match = url.match(/musicbrainz\.org\/artist\/([a-f0-9-]+)/);
    return match ? match[1] : null;
  }
}

export const externalAPIService = new ExternalAPIService();

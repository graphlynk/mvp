import {
  users,
  magicCodes,
  profiles,
  links,
  posts,
  subscribers,
  youtubeSearchLogs,
  entities,
  entitySources,
  entityRelationships,
  entityVerifications,
  entityDuplicates,
  entityScores,
  entityRevisions,
  userOAuthAccounts,
  supportTickets,
  adminActivityLogs,
  type User,
  type InsertUser,
  type MagicCode,
  type InsertMagicCode,
  type Profile,
  type InsertProfile,
  type UpdateProfile,
  type Link,
  type Post,
  type InsertPost,
  type UpdatePost,
  type Subscriber,
  type InsertSubscriber,
  type YouTubeSearchLog,
  type Entity,
  type InsertEntity,
  type EntitySource,
  type InsertEntitySource,
  type EntityRelationship,
  type InsertEntityRelationship,
  type EntityVerification,
  type InsertEntityVerification,
  type EntityDuplicate,
  type InsertEntityDuplicate,
  type EntityScore,
  type EntityRevision,
  type InsertEntityRevision,
  type UserOAuthAccount,
  type InsertUserOAuthAccount,
  type SupportTicket,
  type AdminActivityLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Magic code operations
  createMagicCode(code: InsertMagicCode): Promise<MagicCode>;
  getMagicCode(userId: string, code: string): Promise<MagicCode | undefined>;
  markMagicCodeAsUsed(id: string): Promise<void>;

  // Profile operations
  getProfile(username: string): Promise<(Profile & { links: Link[] }) | undefined>;
  getProfileByUserId(userId: string): Promise<(Profile & { links: Link[] }) | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(username: string, updates: UpdateProfile): Promise<Profile | undefined>;

  // Post operations
  getAllPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post | undefined>;
  getPostsByUserId(userId: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, updates: UpdatePost): Promise<Post | undefined>;
  deletePost(id: string): Promise<void>;

  // Subscriber operations
  getSubscribersByUserId(userId: string): Promise<Subscriber[]>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getSubscriber(userId: string, email: string): Promise<Subscriber | undefined>;

  // YouTube search log operations
  logYouTubeSearch(userId: string | null, ipAddress: string | null, query: string, resultCount: number): Promise<void>;
  getRecentYouTubeSearchCount(userId: string | null, ipAddress: string | null, hoursAgo: number): Promise<number>;

  // Entity operations
  getEntity(id: string): Promise<Entity | undefined>;
  getEntityBySlug(slug: string): Promise<Entity | undefined>;
  getEntitiesByUserId(userId: string): Promise<Entity[]>;
  getUnclaimedEntities(limit: number, offset: number): Promise<Entity[]>;
  getClaimedEntitiesByUser(userId: string): Promise<Entity[]>;
  claimEntity(entityId: string, userId: string, claimMethod: string, evidence?: string): Promise<Entity>;
  createEntity(entity: InsertEntity): Promise<Entity>;
  updateEntity(id: string, updates: Partial<Entity>): Promise<Entity | undefined>;
  deleteEntity(id: string): Promise<void>;

  // Entity source operations
  getEntitySources(entityId: string): Promise<EntitySource[]>;
  createEntitySource(source: InsertEntitySource): Promise<EntitySource>;
  deleteEntitySource(id: string): Promise<void>;

  // Entity relationship operations
  getEntityRelationships(entityId: string): Promise<EntityRelationship[]>;
  createEntityRelationship(relationship: InsertEntityRelationship): Promise<EntityRelationship>;
  deleteEntityRelationship(id: string): Promise<void>;

  // Entity verification operations
  getEntityVerifications(entityId: string): Promise<EntityVerification[]>;
  createEntityVerification(verification: InsertEntityVerification): Promise<EntityVerification>;
  updateEntityVerification(id: string, updates: Partial<EntityVerification>): Promise<EntityVerification | undefined>;

  // Entity duplicate operations
  getEntityDuplicates(entityId: string): Promise<EntityDuplicate[]>;
  createEntityDuplicate(duplicate: InsertEntityDuplicate): Promise<EntityDuplicate>;
  updateEntityDuplicate(id: string, updates: Partial<EntityDuplicate>): Promise<EntityDuplicate | undefined>;

  // Entity score operations
  getEntityScore(entityId: string): Promise<EntityScore | undefined>;
  upsertEntityScore(entityId: string, scores: Partial<EntityScore>): Promise<EntityScore>;

  // Entity revision operations
  getEntityRevisions(entityId: string): Promise<EntityRevision[]>;
  createEntityRevision(revision: InsertEntityRevision): Promise<EntityRevision>;

  // OAuth account operations
  getUserOAuthAccounts(userId: string): Promise<UserOAuthAccount[]>;
  getOAuthAccountByProvider(userId: string, provider: string): Promise<UserOAuthAccount | undefined>;
  createOAuthAccount(account: InsertUserOAuthAccount): Promise<UserOAuthAccount>;
  updateOAuthAccount(id: string, updates: Partial<UserOAuthAccount>): Promise<UserOAuthAccount | undefined>;

  // Admin operations
  getAllUsers(limit: number, offset: number): Promise<User[]>;
  getUserCount(): Promise<number>;
  getAllSupportTickets(status?: string): Promise<any[]>;
  getSupportTicketsByUserId(userId: string): Promise<any[]>;
  updateSupportTicket(id: string, updates: any): Promise<any | undefined>;
  getOpenTicketCount(): Promise<number>;
  logAdminActivity(adminId: string, action: string, targetUserId: string | null, details: string): Promise<void>;
  getAdminActivityLogs(limit: number, offset: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Magic code operations
  async createMagicCode(insertCode: InsertMagicCode): Promise<MagicCode> {
    const [code] = await db.insert(magicCodes).values(insertCode).returning();
    return code;
  }

  async getMagicCode(userId: string, code: string): Promise<MagicCode | undefined> {
    const [magicCode] = await db
      .select()
      .from(magicCodes)
      .where(and(eq(magicCodes.userId, userId), eq(magicCodes.code, code), eq(magicCodes.used, false)));
    return magicCode;
  }

  async markMagicCodeAsUsed(id: string): Promise<void> {
    await db.update(magicCodes).set({ used: true }).where(eq(magicCodes.id, id));
  }

  // Profile operations
  async getProfile(username: string): Promise<(Profile & { links: Link[] }) | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.username, username));
    if (!profile) return undefined;

    const profileLinks = await db.select().from(links).where(eq(links.profileId, profile.id));
    return { ...profile, links: profileLinks };
  }

  async getProfileByUserId(userId: string): Promise<(Profile & { links: Link[] }) | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    if (!profile) return undefined;

    const profileLinks = await db.select().from(links).where(eq(links.profileId, profile.id));
    return { ...profile, links: profileLinks };
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const { links: profileLinks, ...profileData } = insertProfile as InsertProfile & { links?: any[] };
    
    const [profile] = await db.insert(profiles).values(profileData).returning();

    if (profileLinks && profileLinks.length > 0) {
      const linksToInsert = profileLinks.map((link: any, index: number) => ({
        profileId: profile.id,
        label: link.label,
        url: link.url,
        order: link.order ?? index,
      }));
      await db.insert(links).values(linksToInsert);
    }

    return profile;
  }

  async updateProfile(username: string, updates: UpdateProfile): Promise<Profile | undefined> {
    const { links: profileLinks, ...profileUpdates } = updates as UpdateProfile & { links?: any[] };

    const [profile] = await db
      .update(profiles)
      .set({ ...profileUpdates, updatedAt: new Date() })
      .where(eq(profiles.username, username))
      .returning();

    if (!profile) return undefined;

    // Update links if provided
    if (profileLinks !== undefined) {
      // Delete existing links
      await db.delete(links).where(eq(links.profileId, profile.id));

      // Insert new links
      if (profileLinks.length > 0) {
        const linksToInsert = profileLinks.map((link: any, index: number) => ({
          profileId: profile.id,
          label: link.label,
          url: link.url,
          order: link.order ?? index,
        }));
        await db.insert(links).values(linksToInsert);
      }
    }

    return profile;
  }

  // Post operations
  async getAllPosts(): Promise<Post[]> {
    return await db.select().from(posts);
  }

  async getPostById(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.userId, userId));
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db.insert(posts).values(insertPost).returning();
    return post;
  }

  async updatePost(id: string, updates: UpdatePost): Promise<Post | undefined> {
    const [post] = await db
      .update(posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  // Subscriber operations
  async getSubscribersByUserId(userId: string): Promise<Subscriber[]> {
    return await db.select().from(subscribers).where(eq(subscribers.userId, userId));
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const [subscriber] = await db.insert(subscribers).values(insertSubscriber).returning();
    return subscriber;
  }

  async getSubscriber(userId: string, email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db
      .select()
      .from(subscribers)
      .where(and(eq(subscribers.userId, userId), eq(subscribers.email, email)));
    return subscriber;
  }

  // YouTube search log operations
  async logYouTubeSearch(userId: string | null, ipAddress: string | null, query: string, resultCount: number): Promise<void> {
    await db.insert(youtubeSearchLogs).values({
      userId,
      ipAddress,
      query,
      resultCount,
    });
  }

  async getRecentYouTubeSearchCount(userId: string | null, ipAddress: string | null, hoursAgo: number): Promise<number> {
    const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    
    let conditions = [gte(youtubeSearchLogs.createdAt, cutoffTime)];
    
    if (userId) {
      conditions.push(eq(youtubeSearchLogs.userId, userId));
    } else if (ipAddress) {
      conditions.push(eq(youtubeSearchLogs.ipAddress, ipAddress));
    }

    const logs = await db
      .select()
      .from(youtubeSearchLogs)
      .where(and(...conditions));
    
    return logs.length;
  }

  // Entity operations
  async getEntity(id: string): Promise<Entity | undefined> {
    const [entity] = await db.select().from(entities).where(eq(entities.id, id));
    return entity;
  }

  async getEntityBySlug(slug: string): Promise<Entity | undefined> {
    const [entity] = await db.select().from(entities).where(eq(entities.slug, slug));
    return entity;
  }

  async getEntitiesByUserId(userId: string): Promise<Entity[]> {
    return await db.select().from(entities).where(eq(entities.userId, userId));
  }

  async getUnclaimedEntities(limit: number, offset: number): Promise<Entity[]> {
    return await db
      .select()
      .from(entities)
      .where(and(
        eq(entities.claimStatus, 'unclaimed'),
        eq(entities.visibility, 'public'),
        eq(entities.status, 'published')
      ))
      .orderBy(desc(entities.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getClaimedEntitiesByUser(userId: string): Promise<Entity[]> {
    return await db
      .select()
      .from(entities)
      .where(eq(entities.claimedBy, userId))
      .orderBy(desc(entities.claimedAt));
  }

  async claimEntity(entityId: string, userId: string, claimMethod: string, evidence?: string): Promise<Entity> {
    const entity = await this.getEntity(entityId);
    if (!entity) {
      throw new Error('Entity not found');
    }

    if (entity.claimStatus === 'claimed') {
      throw new Error('Entity is already claimed');
    }

    const { entityClaims } = await import('@shared/schema');
    
    await db.insert(entityClaims).values({
      entityId,
      claimantId: userId,
      claimMethod,
      status: 'approved',
      evidence: evidence || null,
    });

    const [updatedEntity] = await db
      .update(entities)
      .set({
        claimStatus: 'claimed',
        claimedBy: userId,
        claimedAt: new Date(),
      })
      .where(eq(entities.id, entityId))
      .returning();

    return updatedEntity;
  }

  async createEntity(insertEntity: InsertEntity): Promise<Entity> {
    const [entity] = await db.insert(entities).values(insertEntity).returning();
    return entity;
  }

  async updateEntity(id: string, updates: Partial<Entity>): Promise<Entity | undefined> {
    const [entity] = await db
      .update(entities)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(entities.id, id))
      .returning();
    return entity;
  }

  async deleteEntity(id: string): Promise<void> {
    await db.delete(entities).where(eq(entities.id, id));
  }

  // Entity source operations
  async getEntitySources(entityId: string): Promise<EntitySource[]> {
    return await db.select().from(entitySources).where(eq(entitySources.entityId, entityId));
  }

  async createEntitySource(insertSource: InsertEntitySource): Promise<EntitySource> {
    const [source] = await db.insert(entitySources).values(insertSource).returning();
    return source;
  }

  async deleteEntitySource(id: string): Promise<void> {
    await db.delete(entitySources).where(eq(entitySources.id, id));
  }

  // Entity relationship operations
  async getEntityRelationships(entityId: string): Promise<EntityRelationship[]> {
    return await db
      .select()
      .from(entityRelationships)
      .where(eq(entityRelationships.fromEntityId, entityId));
  }

  async createEntityRelationship(insertRelationship: InsertEntityRelationship): Promise<EntityRelationship> {
    const [relationship] = await db.insert(entityRelationships).values(insertRelationship).returning();
    return relationship;
  }

  async deleteEntityRelationship(id: string): Promise<void> {
    await db.delete(entityRelationships).where(eq(entityRelationships.id, id));
  }

  // Entity verification operations
  async getEntityVerifications(entityId: string): Promise<EntityVerification[]> {
    return await db.select().from(entityVerifications).where(eq(entityVerifications.entityId, entityId));
  }

  async createEntityVerification(insertVerification: InsertEntityVerification): Promise<EntityVerification> {
    const [verification] = await db.insert(entityVerifications).values(insertVerification).returning();
    return verification;
  }

  async updateEntityVerification(id: string, updates: Partial<EntityVerification>): Promise<EntityVerification | undefined> {
    const [verification] = await db
      .update(entityVerifications)
      .set(updates)
      .where(eq(entityVerifications.id, id))
      .returning();
    return verification;
  }

  // Entity duplicate operations
  async getEntityDuplicates(entityId: string): Promise<EntityDuplicate[]> {
    return await db.select().from(entityDuplicates).where(eq(entityDuplicates.entityId, entityId));
  }

  async createEntityDuplicate(insertDuplicate: InsertEntityDuplicate): Promise<EntityDuplicate> {
    const [duplicate] = await db.insert(entityDuplicates).values(insertDuplicate).returning();
    return duplicate;
  }

  async updateEntityDuplicate(id: string, updates: Partial<EntityDuplicate>): Promise<EntityDuplicate | undefined> {
    const [duplicate] = await db
      .update(entityDuplicates)
      .set(updates)
      .where(eq(entityDuplicates.id, id))
      .returning();
    return duplicate;
  }

  // Entity score operations
  async getEntityScore(entityId: string): Promise<EntityScore | undefined> {
    const [score] = await db.select().from(entityScores).where(eq(entityScores.entityId, entityId));
    return score;
  }

  async upsertEntityScore(entityId: string, scores: Partial<EntityScore>): Promise<EntityScore> {
    const existing = await this.getEntityScore(entityId);
    
    if (existing) {
      const [score] = await db
        .update(entityScores)
        .set({ ...scores, computedAt: new Date() })
        .where(eq(entityScores.entityId, entityId))
        .returning();
      return score;
    } else {
      const [score] = await db
        .insert(entityScores)
        .values({ entityId, ...scores } as any)
        .returning();
      return score;
    }
  }

  // Entity revision operations
  async getEntityRevisions(entityId: string): Promise<EntityRevision[]> {
    return await db
      .select()
      .from(entityRevisions)
      .where(eq(entityRevisions.entityId, entityId))
      .orderBy(desc(entityRevisions.createdAt));
  }

  async createEntityRevision(insertRevision: InsertEntityRevision): Promise<EntityRevision> {
    const [revision] = await db.insert(entityRevisions).values(insertRevision).returning();
    return revision;
  }

  // OAuth account operations
  async getUserOAuthAccounts(userId: string): Promise<UserOAuthAccount[]> {
    return await db.select().from(userOAuthAccounts).where(eq(userOAuthAccounts.userId, userId));
  }

  async getOAuthAccountByProvider(userId: string, provider: string): Promise<UserOAuthAccount | undefined> {
    const [account] = await db
      .select()
      .from(userOAuthAccounts)
      .where(and(eq(userOAuthAccounts.userId, userId), eq(userOAuthAccounts.provider, provider)));
    return account;
  }

  async createOAuthAccount(insertAccount: InsertUserOAuthAccount): Promise<UserOAuthAccount> {
    const [account] = await db.insert(userOAuthAccounts).values(insertAccount).returning();
    return account;
  }

  async updateOAuthAccount(id: string, updates: Partial<UserOAuthAccount>): Promise<UserOAuthAccount | undefined> {
    const [account] = await db
      .update(userOAuthAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userOAuthAccounts.id, id))
      .returning();
    return account;
  }

  // Admin operations
  async getAllUsers(limit: number, offset: number): Promise<User[]> {
    return await db.select().from(users).limit(limit).offset(offset).orderBy(desc(users.createdAt));
  }

  async getUserCount(): Promise<number> {
    const result = await db.select().from(users);
    return result.length;
  }

  async getAllSupportTickets(status?: string): Promise<SupportTicket[]> {
    if (status) {
      return await db.select().from(supportTickets).where(eq(supportTickets.status, status)).orderBy(desc(supportTickets.createdAt));
    }
    return await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
  }

  async getSupportTicketsByUserId(userId: string): Promise<SupportTicket[]> {
    return await db.select().from(supportTickets).where(eq(supportTickets.userId, userId)).orderBy(desc(supportTickets.createdAt));
  }

  async updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | undefined> {
    const [ticket] = await db
      .update(supportTickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();
    return ticket;
  }

  async getOpenTicketCount(): Promise<number> {
    const result = await db.select().from(supportTickets).where(eq(supportTickets.status, "open"));
    return result.length;
  }

  async logAdminActivity(adminId: string, action: string, targetUserId: string | null, details: string): Promise<void> {
    await db.insert(adminActivityLogs).values({
      adminId,
      action,
      targetUserId,
      details,
    });
  }

  async getAdminActivityLogs(limit: number, offset: number): Promise<AdminActivityLog[]> {
    return await db.select().from(adminActivityLogs).limit(limit).offset(offset).orderBy(desc(adminActivityLogs.createdAt));
  }
}

export const storage = new DatabaseStorage();

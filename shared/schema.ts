import { pgTable, varchar, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 50 }).unique(),
  plan: varchar("plan", { length: 20 }).notNull().default("FREE"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  plan: z.enum(["FREE", "PRO", "AUTHORITY"]).optional(),
  isAdmin: z.boolean().optional(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Magic codes table
export const magicCodes = pgTable("magic_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 10 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMagicCodeSchema = createInsertSchema(magicCodes);
export type MagicCode = typeof magicCodes.$inferSelect;
export type InsertMagicCode = z.infer<typeof insertMagicCodeSchema>;

// Profiles table
export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  username: varchar("username", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 255 }),
  bio: text("bio"),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  theme: text("theme"),
  showKgMetrics: boolean("show_kg_metrics").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profiles, {
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});
export const updateProfileSchema = insertProfileSchema.partial().omit({ userId: true });
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

// Links table
export const links = pgTable("links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 100 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLinkSchema = createInsertSchema(links, {
  label: z.string().min(1, "Label is required"),
  url: z.string().url("Valid URL is required"),
});
export type Link = typeof links.$inferSelect;
export type InsertLink = z.infer<typeof insertLinkSchema>;

// Posts table
export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull(),
  html: text("html").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPostSchema = createInsertSchema(posts, {
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
});
export const updatePostSchema = insertPostSchema.partial().omit({ userId: true });
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;

// Subscribers table
export const subscribers = pgTable("subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers, {
  email: z.string().email(),
});
export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;

// Auth schemas
export const requestCodeSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Code must be 6 digits"),
});

export type RequestCode = z.infer<typeof requestCodeSchema>;
export type VerifyCode = z.infer<typeof verifyCodeSchema>;

// YouTube search rate limiting table
export const youtubeSearchLogs = pgTable("youtube_search_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  ipAddress: varchar("ip_address", { length: 45 }),
  query: varchar("query", { length: 500 }).notNull(),
  resultCount: integer("result_count"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type YouTubeSearchLog = typeof youtubeSearchLogs.$inferSelect;

// YouTube search request/response types
export const youtubeSearchSchema = z.object({
  q: z.string().min(1, "Search query is required"),
  maxResults: z.number().min(1).max(50).optional(),
  order: z.enum(["date", "rating", "relevance", "title", "viewCount"]).optional(),
  videoDuration: z.enum(["any", "short", "medium", "long"]).optional(),
  videoDefinition: z.enum(["any", "high", "standard"]).optional(),
  publishedAfter: z.string().optional(),
  publishedBefore: z.string().optional(),
});

// Knowledge Graph AI - Entities table
export const entities = pgTable("entities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  visibility: varchar("visibility", { length: 20 }).notNull().default("private"),
  primaryProfileId: varchar("primary_profile_id").references(() => profiles.id, { onDelete: "set null" }),
  claimStatus: varchar("claim_status", { length: 20 }).notNull().default("unclaimed"),
  claimedBy: varchar("claimed_by").references(() => users.id, { onDelete: "set null" }),
  claimedAt: timestamp("claimed_at"),
  externalIds: text("external_ids"),
  ingestionSource: varchar("ingestion_source", { length: 50 }),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertEntitySchema = createInsertSchema(entities, {
  type: z.enum(["person", "organization", "product", "event", "creative_work", "place"]),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(255),
  status: z.enum(["draft", "published", "archived", "flagged"]).optional(),
  visibility: z.enum(["public", "private", "unlisted"]).optional(),
  claimStatus: z.enum(["unclaimed", "claimed", "pending", "disputed"]).optional(),
  ingestionSource: z.enum(["wikipedia", "wikidata", "musicbrainz", "crunchbase", "manual"]).optional(),
});

export const updateEntitySchema = insertEntitySchema.partial().omit({
  userId: true,
  id: true,
  createdAt: true,
});

export type Entity = typeof entities.$inferSelect;
export type InsertEntity = z.infer<typeof insertEntitySchema>;
export type UpdateEntity = z.infer<typeof updateEntitySchema>;

// Entity sources (verified links, mentions, backlinks)
export const entitySources = pgTable("entity_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: varchar("entity_id").notNull().references(() => entities.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 1000 }).notNull(),
  sourceType: varchar("source_type", { length: 50 }).notNull(),
  verifiedAt: timestamp("verified_at"),
  score: integer("score").notNull().default(0),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEntitySourceSchema = createInsertSchema(entitySources, {
  url: z.string().url(),
  sourceType: z.enum(["website", "social", "wikipedia", "wikidata", "imdb", "musicbrainz", "crunchbase", "linkedin", "other"]),
});
export type EntitySource = typeof entitySources.$inferSelect;
export type InsertEntitySource = z.infer<typeof insertEntitySourceSchema>;

// Entity relationships (graph connections)
export const entityRelationships = pgTable("entity_relationships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromEntityId: varchar("from_entity_id").notNull().references(() => entities.id, { onDelete: "cascade" }),
  toEntityId: varchar("to_entity_id").notNull().references(() => entities.id, { onDelete: "cascade" }),
  relationshipType: varchar("relationship_type", { length: 50 }).notNull(),
  confidence: integer("confidence").notNull().default(100),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEntityRelationshipSchema = createInsertSchema(entityRelationships, {
  relationshipType: z.enum(["memberOf", "owns", "performsAt", "worksFor", "foundedBy", "partnerOf", "childOf", "parentOf", "related"]),
  confidence: z.number().min(0).max(100).optional(),
});
export type EntityRelationship = typeof entityRelationships.$inferSelect;
export type InsertEntityRelationship = z.infer<typeof insertEntityRelationshipSchema>;

// Entity verifications (OAuth, domain, business)
export const entityVerifications = pgTable("entity_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: varchar("entity_id").notNull().references(() => entities.id, { onDelete: "cascade" }),
  verificationType: varchar("verification_type", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  evidence: text("evidence"),
  verifiedAt: timestamp("verified_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEntityVerificationSchema = createInsertSchema(entityVerifications, {
  verificationType: z.enum(["oauth_google", "oauth_linkedin", "oauth_spotify", "oauth_youtube", "domain_dns", "domain_html", "business_registry", "manual"]),
  status: z.enum(["pending", "verified", "failed", "expired"]).optional(),
});
export type EntityVerification = typeof entityVerifications.$inferSelect;
export type InsertEntityVerification = z.infer<typeof insertEntityVerificationSchema>;

// Entity duplicates (AI-detected potential matches)
export const entityDuplicates = pgTable("entity_duplicates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: varchar("entity_id").notNull().references(() => entities.id, { onDelete: "cascade" }),
  candidateEntityId: varchar("candidate_entity_id").notNull().references(() => entities.id, { onDelete: "cascade" }),
  matchScore: integer("match_score").notNull(),
  resolutionStatus: varchar("resolution_status", { length: 20 }).notNull().default("pending"),
  resolvedBy: varchar("resolved_by").references(() => users.id, { onDelete: "set null" }),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEntityDuplicateSchema = createInsertSchema(entityDuplicates, {
  matchScore: z.number().min(0).max(100),
  resolutionStatus: z.enum(["pending", "confirmed_duplicate", "not_duplicate", "merged"]).optional(),
});
export type EntityDuplicate = typeof entityDuplicates.$inferSelect;
export type InsertEntityDuplicate = z.infer<typeof insertEntityDuplicateSchema>;

// Entity scores (notability, authority, engagement)
export const entityScores = pgTable("entity_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: varchar("entity_id").notNull().unique().references(() => entities.id, { onDelete: "cascade" }),
  authorityScore: integer("authority_score").notNull().default(0),
  engagementScore: integer("engagement_score").notNull().default(0),
  freshnessScore: integer("freshness_score").notNull().default(0),
  notabilityScore: integer("notability_score").notNull().default(0),
  computedAt: timestamp("computed_at").notNull().defaultNow(),
  metadata: text("metadata"),
});

export type EntityScore = typeof entityScores.$inferSelect;

// Entity revisions (edit history/audit log)
export const entityRevisions = pgTable("entity_revisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: varchar("entity_id").notNull().references(() => entities.id, { onDelete: "cascade" }),
  editorId: varchar("editor_id").notNull().references(() => users.id, { onDelete: "set null" }),
  revisionNumber: integer("revision_number").notNull(),
  payload: text("payload").notNull(),
  summary: varchar("summary", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEntityRevisionSchema = createInsertSchema(entityRevisions, {
  payload: z.string().min(1),
  summary: z.string().max(500).optional(),
});
export type EntityRevision = typeof entityRevisions.$inferSelect;
export type InsertEntityRevision = z.infer<typeof insertEntityRevisionSchema>;

// User OAuth accounts (identity verification)
export const userOAuthAccounts = pgTable("user_oauth_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 50 }).notNull(),
  providerUserId: varchar("provider_user_id", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserOAuthAccountSchema = createInsertSchema(userOAuthAccounts, {
  provider: z.enum(["google", "linkedin", "spotify", "youtube", "instagram"]),
  providerUserId: z.string().min(1),
});
export type UserOAuthAccount = typeof userOAuthAccounts.$inferSelect;
export type InsertUserOAuthAccount = z.infer<typeof insertUserOAuthAccountSchema>;

// Entity claims (track claim requests and status)
export const entityClaims = pgTable("entity_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityId: varchar("entity_id").notNull().references(() => entities.id, { onDelete: "cascade" }),
  claimantId: varchar("claimant_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  claimMethod: varchar("claim_method", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  evidence: text("evidence"),
  reviewedBy: varchar("reviewed_by").references(() => users.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertEntityClaimSchema = createInsertSchema(entityClaims, {
  claimMethod: z.enum(["oauth_verification", "domain_verification", "manual_review", "auto_approved"]),
  status: z.enum(["pending", "approved", "rejected", "disputed"]).optional(),
});
export type EntityClaim = typeof entityClaims.$inferSelect;
export type InsertEntityClaim = z.infer<typeof insertEntityClaimSchema>;

// Support tickets table (for admin functionality)
export const supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("open"),
  priority: varchar("priority", { length: 20 }).notNull().default("medium"),
  assignedTo: varchar("assigned_to").references(() => users.id, { onDelete: "set null" }),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets, {
  subject: z.string().min(1).max(255),
  message: z.string().min(1),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
});
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;

// Admin activity logs
export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 100 }).notNull(),
  targetUserId: varchar("target_user_id").references(() => users.id, { onDelete: "set null" }),
  details: text("details"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AdminActivityLog = typeof adminActivityLogs.$inferSelect;

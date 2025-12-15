import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { aiService } from "./ai-service";
import { registerAdminRoutes } from "./admin-routes";
import {
  requestCodeSchema,
  verifyCodeSchema,
  insertProfileSchema,
  updateProfileSchema,
  insertPostSchema,
  insertSubscriberSchema,
  youtubeSearchSchema,
} from "@shared/schema";

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-me";
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;
const GOOGLE_CSE_KEY = process.env.GOOGLE_CSE_KEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Email sending utility
async function sendEmail(to: string, subject: string, html: string) {
  if (SENDGRID_API_KEY) {
    try {
      const sgMail = await import("@sendgrid/mail");
      sgMail.default.setApiKey(SENDGRID_API_KEY);
      await sgMail.default.send({
        to,
        from: process.env.EMAIL_FROM || "noreply@graphauthority.com",
        subject,
        html,
      });
      console.log("📧 EMAIL sent via SendGrid to:", to);
    } catch (error: any) {
      // Fallback to console logging if SendGrid fails
      console.log("📧 EMAIL (SendGrid failed, logging instead) →", to, subject, html);
      console.error("SendGrid error:", error.message);
    }
  } else {
    // Development fallback: log to console
    console.log("📧 EMAIL →", to, subject, html);
  }
}

// Auth middleware
function requireAuth(req: any, res: any, next: any) {
  const token = req.cookies?.ga_session;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      id: string; 
      email: string;
      isImpersonating?: boolean;
      originalAdminId?: string;
    };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Admin middleware
async function requireAdmin(req: any, res: any, next: any) {
  const token = req.cookies?.ga_session;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      id: string; 
      email: string;
      isImpersonating?: boolean;
      originalAdminId?: string;
    };
    
    // Check if the user is impersonating - verify original admin
    let userToCheck;
    if (decoded.isImpersonating && decoded.originalAdminId) {
      userToCheck = await storage.getUser(decoded.originalAdminId);
    } else {
      userToCheck = await storage.getUser(decoded.id);
    }
    
    if (!userToCheck || !userToCheck.isAdmin) {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }
    
    // Preserve all token data including impersonation flags
    req.user = decoded;
    req.adminUser = userToCheck; // Store actual admin for logging
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  console.log("🚀 Registering routes...");
  
  // ========== DEMO PROFILE INITIALIZATION ==========
  // Create demo profile if it doesn't exist
  const demoProfile = await storage.getProfile("demo");
  if (!demoProfile) {
    try {
      let demoUser = await storage.getUserByEmail("demo@graphlynk.io");
      if (!demoUser) {
        demoUser = await storage.createUser({
          email: "demo@graphlynk.io",
          username: "demo",
          name: "Graphlynk",
          plan: "AUTHORITY",
        });
      }
      
      const profile = await storage.createProfile({
        userId: demoUser.id,
        username: "demo",
        title: "Graphlynk",
        bio: "Graphlynk is an innovative platform designed to help individuals and organizations build, manage, and enhance their knowledge graph and SEO presence. Based in Manhattan, New York, Graphlynk empowers users to take control of their digital identity and authority with tools for profile management, schema markup, link aggregation, blog management, messaging, and comprehensive SEO health analytics.",
        showKgMetrics: true,
      });
      
      // Create demo profile links
      const demoLinks = [
        { label: "Website", url: "https://johnde.com", order: 0 },
        { label: "LinkedIn", url: "https://linkedin.com", order: 1 },
        { label: "SEO Blog & Resources", url: "https://blog.johndoe.com", order: 2 },
        { label: "Book a Consultation", url: "https://calendly.com", order: 3 },
      ];
      
      for (const link of demoLinks) {
        await storage.createLink({
          profileId: profile.id,
          label: link.label,
          url: link.url,
          order: link.order,
        });
      }
      
      console.log("✅ Demo profile created successfully!");
    } catch (error) {
      console.error("⚠️ Failed to create demo profile:", error);
    }
  }
  
  // ========== AUTH ROUTES ==========

  // Request magic code
  app.post("/api/auth/request-code", async (req, res) => {
    console.log("📧 Request code endpoint START");
    console.log("📧 Request body:", req.body);
    console.log("📧 Headers:", req.headers);
    try {
      const { email } = requestCodeSchema.parse(req.body);
      console.log("📧 Parsed email:", email);

      let user = await storage.getUserByEmail(email);
      if (!user) {
        console.log("📧 Creating new user for:", email);
        user = await storage.createUser({ email });
      } else {
        console.log("📧 Found existing user:", user.id);
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await storage.createMagicCode({
        userId: user.id,
        code,
        expiresAt,
      });

      console.log(`📧 Generated code ${code} for ${email}`);

      await sendEmail(
        email,
        "Your Graphlynk Login Code",
        `<p>Your login code is <strong>${code}</strong>. It expires in 10 minutes.</p>`
      );

      res.json({ ok: true });
    } catch (error: any) {
      console.error("📧 Error in request-code:", error);
      res.status(400).json({ error: error.message || "Failed to request code" });
    }
  });

  // Verify magic code
  app.post("/api/auth/verify-code", async (req, res) => {
    try {
      const { email, code } = verifyCodeSchema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const magicCode = await storage.getMagicCode(user.id, code);
      if (!magicCode || magicCode.expiresAt < new Date()) {
        return res.status(400).json({ error: "Invalid or expired code" });
      }

      await storage.markMagicCodeAsUsed(magicCode.id);

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "30d",
      });

      res.cookie("ga_session", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({ ok: true, user });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to verify code" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("ga_session");
    res.json({ ok: true });
  });

  // Demo login - instant access without email verification
  app.post("/api/auth/demo-login", async (req, res) => {
    try {
      const demoEmail = "demo@graphauthority.com";
      
      // Get or create demo user with PRO plan
      let user = await storage.getUserByEmail(demoEmail);
      if (!user) {
        user = await storage.createUser({ 
          email: demoEmail,
          username: "demo",
          plan: "PRO" 
        });
        console.log("🎭 Created demo user:", user.id);
      } else {
        console.log("🎭 Using existing demo user:", user.id);
      }

      // Create JWT session token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "30d",
      });

      // Set session cookie
      res.cookie("ga_session", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      console.log("🎭 Demo login successful");
      res.json({ ok: true, user });
    } catch (error: any) {
      console.error("🎭 Demo login error:", error);
      res.status(500).json({ error: error.message || "Demo login failed" });
    }
  });

  // Get current user
  app.get("/api/user/me", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // Include impersonation status from JWT token
      const responseData = {
        ...user,
        isImpersonating: req.user.isImpersonating || false,
        originalAdminId: req.user.originalAdminId || null,
      };
      res.json(responseData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update user plan
  app.patch("/api/user/plan", requireAuth, async (req: any, res) => {
    try {
      const planSchema = z.object({
        plan: z.enum(["FREE", "PRO", "AUTHORITY"]),
      });
      
      // Validate request body
      const parseResult = planSchema.safeParse(req.body);
      if (!parseResult.success) {
        console.error("Plan update validation error:", parseResult.error);
        return res.status(400).json({ 
          error: "Invalid plan value. Must be FREE, PRO, or AUTHORITY." 
        });
      }
      
      const { plan } = parseResult.data;
      
      const updated = await storage.updateUser(req.user.id, { plan });
      if (!updated) {
        console.error("User not found for plan update:", req.user.id);
        return res.status(404).json({ error: "User not found" });
      }
      
      console.log(`✅ Plan updated for user ${req.user.id}: ${plan}`);
      res.json(updated);
    } catch (error: any) {
      console.error("Plan update error:", error);
      res.status(500).json({ error: "Failed to update plan. Please try again." });
    }
  });

  // ========== PROFILE ROUTES ==========

  // Get user's own profile
  app.get("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const profile = await storage.getProfileByUserId(req.user.id);
      res.json(profile || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get public profile by username
  app.get("/api/profile/:username", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.username);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create or update profile
  app.post("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const existingProfile = await storage.getProfileByUserId(req.user.id);
      
      if (existingProfile) {
        // Update existing profile
        const updates = updateProfileSchema.parse(req.body);
        const updated = await storage.updateProfile(existingProfile.username, updates);
        res.json(updated);
      } else {
        // Create new profile
        const profileData = insertProfileSchema.parse({
          ...req.body,
          userId: req.user.id,
        });
        const created = await storage.createProfile(profileData);
        res.json(created);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to save profile" });
    }
  });

  // ========== BLOG ROUTES ==========

  // Get all posts (or user's posts)
  app.get("/api/blog/posts", async (req: any, res) => {
    try {
      let posts;
      if (req.query.userId) {
        posts = await storage.getPostsByUserId(req.query.userId);
      } else if (req.user?.id) {
        posts = await storage.getPostsByUserId(req.user.id);
      } else {
        posts = await storage.getAllPosts();
      }
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get single post
  app.get("/api/blog/posts/:id", async (req, res) => {
    try {
      const post = await storage.getPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create post
  app.post("/api/blog/posts", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.plan === "FREE") {
        return res.status(403).json({ error: "Pro plan required" });
      }

      // Simple HTML sanitization - remove script tags
      const html = req.body.html?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

      const postData = insertPostSchema.parse({
        ...req.body,
        userId: req.user.id,
        html,
      });

      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create post" });
    }
  });

  // ========== SEARCH ROUTES ==========

  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;

      if (!query) {
        return res.json({ items: [], suggestions: [] });
      }

      if (!GOOGLE_CSE_ID || !GOOGLE_CSE_KEY) {
        // Return mock data if API keys not configured
        return res.json({
          items: [
            {
              rank: 1,
              title: "Example Result 1",
              link: "https://example.com",
              snippet: "This is a sample search result. Configure Google CSE API keys to see real results.",
              displayLink: "example.com",
            },
          ],
          suggestions: [`${query} review`, `${query} pricing`, `${query} alternatives`],
        });
      }

      const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CSE_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(
        query
      )}`;

      const response = await fetch(url);
      const data = await response.json();

      const items = (data.items || []).map((item: any, idx: number) => ({
        rank: idx + 1,
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        displayLink: item.displayLink,
        pagemap: item.pagemap,
      }));

      const suggestions = [`${query} review`, `${query} pricing`, `${query} alternatives`];

      res.json({ 
        items, 
        suggestions,
        searchInformation: {
          formattedTotalResults: data.searchInformation?.formattedTotalResults,
          formattedSearchTime: data.searchInformation?.formattedSearchTime,
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Search failed" });
    }
  });

  // ========== YOUTUBE SEARCH ROUTES ==========

  // Free tier YouTube search (rate limited to 10 requests/hour per user/IP)
  app.get("/api/youtube/search", async (req: any, res) => {
    try {
      if (!YOUTUBE_API_KEY) {
        return res.status(503).json({ error: "YouTube API not configured" });
      }

      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }

      // Get user ID from token (if authenticated) or use IP address for rate limiting
      const token = req.cookies?.ga_session;
      let userId: string | null = null;
      const ipAddress = req.ip || req.connection.remoteAddress || null;

      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
          userId = decoded.id;
        } catch {
          // Not authenticated, use IP-based rate limiting
        }
      }

      // Check rate limit (10 searches per hour for free tier)
      const recentSearchCount = await storage.getRecentYouTubeSearchCount(userId, ipAddress, 1);
      if (recentSearchCount >= 10) {
        return res.status(429).json({ 
          error: "Rate limit exceeded. Free tier allows 10 searches per hour. Upgrade to PRO for unlimited searches.",
          limit: 10,
          remaining: 0,
          resetIn: "1 hour"
        });
      }

      // Call YouTube API - basic search only
      const maxResults = 10; // Fixed for free tier
      const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
      
      const response = await fetch(youtubeUrl);
      const data = await response.json();

      if (data.error) {
        return res.status(500).json({ error: data.error.message });
      }

      const videos = (data.items || []).map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));

      // Log the search
      await storage.logYouTubeSearch(userId, ipAddress, query, videos.length);

      res.json({
        videos,
        totalResults: videos.length,
        tier: "free",
        remaining: 10 - recentSearchCount - 1,
      });
    } catch (error: any) {
      console.error("YouTube search error:", error);
      res.status(500).json({ error: error.message || "YouTube search failed" });
    }
  });

  // Advanced YouTube search for paid users (no rate limits, advanced filters, export)
  app.get("/api/youtube/search/advanced", requireAuth, async (req: any, res) => {
    try {
      if (!YOUTUBE_API_KEY) {
        return res.status(503).json({ error: "YouTube API not configured" });
      }

      // Check if user has PRO or AUTHORITY plan
      const user = await storage.getUser(req.user.id);
      if (!user || user.plan === "FREE") {
        return res.status(403).json({ 
          error: "PRO or AUTHORITY plan required for advanced search features",
          upgrade: "Upgrade to access: unlimited searches, advanced filters, trending data, export options"
        });
      }

      const queryParams = {
        q: req.query.q as string,
        maxResults: parseInt(req.query.maxResults as string) || 25,
        order: req.query.order as string || "relevance",
        videoDuration: req.query.videoDuration as string,
        videoDefinition: req.query.videoDefinition as string,
        publishedAfter: req.query.publishedAfter as string,
        publishedBefore: req.query.publishedBefore as string,
      };

      // Validate with schema
      const validatedParams = youtubeSearchSchema.parse(queryParams);

      // Build YouTube API URL with advanced parameters
      const params = new URLSearchParams({
        key: YOUTUBE_API_KEY,
        part: "snippet",
        type: "video",
        q: validatedParams.q,
        maxResults: validatedParams.maxResults?.toString() || "25",
      });

      if (validatedParams.order) params.append("order", validatedParams.order);
      if (validatedParams.videoDuration) params.append("videoDuration", validatedParams.videoDuration);
      if (validatedParams.videoDefinition) params.append("videoDefinition", validatedParams.videoDefinition);
      if (validatedParams.publishedAfter) params.append("publishedAfter", validatedParams.publishedAfter);
      if (validatedParams.publishedBefore) params.append("publishedBefore", validatedParams.publishedBefore);

      const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
      const response = await fetch(youtubeUrl);
      const searchData = await response.json();

      if (searchData.error) {
        return res.status(500).json({ error: searchData.error.message });
      }

      // Get video IDs for detailed statistics
      const videoIds = (searchData.items || []).map((item: any) => item.id.videoId).join(',');
      
      // Fetch detailed statistics for each video
      const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&part=statistics,contentDetails&id=${videoIds}`;
      const statsResponse = await fetch(statsUrl);
      const statsData = await statsResponse.json();

      // Combine search results with statistics
      const videos = (searchData.items || []).map((item: any, index: number) => {
        const stats = statsData.items?.[index]?.statistics || {};
        const contentDetails = statsData.items?.[index]?.contentDetails || {};
        
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          // Advanced analytics (PRO/AUTHORITY only)
          viewCount: parseInt(stats.viewCount || "0"),
          likeCount: parseInt(stats.likeCount || "0"),
          commentCount: parseInt(stats.commentCount || "0"),
          duration: contentDetails.duration,
          engagement: stats.viewCount ? 
            ((parseInt(stats.likeCount || "0") + parseInt(stats.commentCount || "0")) / parseInt(stats.viewCount)) * 100 : 0,
        };
      });

      // Log the search (no rate limiting for paid users)
      await storage.logYouTubeSearch(req.user.id, null, validatedParams.q, videos.length);

      res.json({
        videos,
        totalResults: videos.length,
        tier: user.plan.toLowerCase(),
        filters: validatedParams,
      });
    } catch (error: any) {
      console.error("Advanced YouTube search error:", error);
      res.status(500).json({ error: error.message || "Advanced search failed" });
    }
  });

  // Export search results (paid users only)
  app.post("/api/youtube/export", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.plan === "FREE") {
        return res.status(403).json({ error: "PRO or AUTHORITY plan required to export results" });
      }

      const { videos, format } = req.body;
      
      if (format === "json") {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", "attachment; filename=youtube-search-results.json");
        res.json(videos);
      } else if (format === "csv") {
        // Convert to CSV
        const csvHeader = "Video ID,Title,Channel,Published,Views,Likes,Comments,Engagement %,URL\n";
        const csvRows = videos.map((v: any) => 
          `${v.id},"${v.title.replace(/"/g, '""')}","${v.channelTitle}",${v.publishedAt},${v.viewCount || 0},${v.likeCount || 0},${v.commentCount || 0},${v.engagement?.toFixed(2) || 0},${v.url}`
        ).join("\n");
        
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=youtube-search-results.csv");
        res.send(csvHeader + csvRows);
      } else {
        res.status(400).json({ error: "Invalid format. Use 'json' or 'csv'" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Export failed" });
    }
  });

  // ========== SUBSCRIBER ROUTES ==========

  // Get subscribers
  app.get("/api/subscribers", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.plan === "FREE") {
        return res.status(403).json({ error: "Pro plan required" });
      }

      const subscribers = await storage.getSubscribersByUserId(req.user.id);
      res.json(subscribers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add subscriber
  app.post("/api/mailing/subscribe", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.plan === "FREE") {
        return res.status(403).json({ error: "Pro plan required" });
      }

      const subscriberData = insertSubscriberSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      // Check if already subscribed
      const existing = await storage.getSubscriber(req.user.id, subscriberData.email);
      if (existing) {
        return res.json(existing);
      }

      const subscriber = await storage.createSubscriber(subscriberData);
      res.json(subscriber);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to add subscriber" });
    }
  });

  // ========== KNOWLEDGE GRAPH ENTITY ROUTES ==========

  // Get all entities for current user
  app.get("/api/entities", requireAuth, async (req: any, res) => {
    try {
      const entities = await storage.getEntitiesByUserId(req.user.id);
      res.json(entities);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch entities" });
    }
  });

  // Create new entity
  app.post("/api/entities", requireAuth, async (req: any, res) => {
    try {
      const { insertEntitySchema } = await import("@shared/schema");
      const entityData = insertEntitySchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      const entity = await storage.createEntity(entityData);
      
      // Create initial revision
      const { insertEntityRevisionSchema } = await import("@shared/schema");
      await storage.createEntityRevision({
        entityId: entity.id,
        editorId: req.user.id,
        revisionNumber: 1,
        payload: JSON.stringify(entity),
        summary: "Initial entity creation",
      });

      res.json(entity);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create entity" });
    }
  });

  // ========== ENTITY CLAIMING ROUTES (must come before :id/:slug routes) ==========

  // Search and ingest entities from external sources (Wikipedia, MusicBrainz)
  app.post("/api/entities/ingest", requireAuth, async (req: any, res) => {
    try {
      const { query, source } = req.body;
      
      if (!query || !source) {
        return res.status(400).json({ error: "Query and source are required" });
      }

      const { entityIngestionService } = await import("./entity-ingestion-service");
      let entityIds: string[] = [];

      if (source === 'wikipedia') {
        entityIds = await entityIngestionService.ingestFromWikipedia(query);
      } else if (source === 'musicbrainz') {
        entityIds = await entityIngestionService.ingestFromMusicBrainz(query);
      } else {
        return res.status(400).json({ error: "Invalid source. Use 'wikipedia' or 'musicbrainz'" });
      }

      res.json({ 
        success: true,
        count: entityIds.length,
        entityIds,
      });
    } catch (error: any) {
      console.error("Entity ingestion error:", error);
      res.status(500).json({ error: error.message || "Failed to ingest entities" });
    }
  });

  // Browse unclaimed entities
  app.get("/api/entities/unclaimed", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const unclaimedEntities = await storage.getUnclaimedEntities(limit, offset);
      res.json(unclaimedEntities);
    } catch (error: any) {
      console.error("Get unclaimed entities error:", error);
      res.status(500).json({ error: "Failed to fetch unclaimed entities" });
    }
  });

  // Claim an entity
  app.post("/api/entities/claim", requireAuth, async (req: any, res) => {
    try {
      const { entityId, claimMethod, evidence } = req.body;
      const userId = req.user.id;

      if (!entityId) {
        return res.status(400).json({ error: "Entity ID is required" });
      }

      const result = await storage.claimEntity(entityId, userId, claimMethod || 'manual_review', evidence);
      res.json(result);
    } catch (error: any) {
      console.error("Entity claim error:", error);
      res.status(500).json({ error: error.message || "Failed to claim entity" });
    }
  });

  // Get my claimed entities
  app.get("/api/entities/my-claims", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const claims = await storage.getClaimedEntitiesByUser(userId);
      res.json(claims);
    } catch (error: any) {
      console.error("Get my claims error:", error);
      res.status(500).json({ error: "Failed to fetch claimed entities" });
    }
  });

  // Get entity by slug (public)
  app.get("/api/entities/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const entity = await storage.getEntityBySlug(slug);
      
      if (!entity) {
        return res.status(404).json({ error: "Entity not found" });
      }

      res.json(entity);
    } catch (error: any) {
      console.error("Get entity error:", error);
      res.status(500).json({ error: "Failed to fetch entity" });
    }
  });

  // ========== END ENTITY CLAIMING ROUTES ==========

  // Get single entity by ID (authenticated)
  app.get("/api/entities/:id", requireAuth, async (req: any, res) => {
    try {
      const entity = await storage.getEntity(req.params.id);
      if (!entity) {
        return res.status(404).json({ error: "Entity not found" });
      }

      if (entity.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Get related data
      const [sources, relationships, verifications, score] = await Promise.all([
        storage.getEntitySources(entity.id),
        storage.getEntityRelationships(entity.id),
        storage.getEntityVerifications(entity.id),
        storage.getEntityScore(entity.id),
      ]);

      res.json({
        ...entity,
        sources,
        relationships,
        verifications,
        score,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch entity" });
    }
  });

  // Get public entity by slug
  app.get("/api/entity/:slug", async (req, res) => {
    try {
      const entity = await storage.getEntityBySlug(req.params.slug);
      if (!entity) {
        return res.status(404).json({ error: "Entity not found" });
      }

      if (entity.visibility !== "public") {
        return res.status(404).json({ error: "Entity not found" });
      }

      // Get public data
      const [sources, relationships, verifications, score] = await Promise.all([
        storage.getEntitySources(entity.id),
        storage.getEntityRelationships(entity.id),
        storage.getEntityVerifications(entity.id).then(v => v.filter(ver => ver.status === "verified")),
        storage.getEntityScore(entity.id),
      ]);

      res.json({
        ...entity,
        sources: sources.filter(s => s.verifiedAt),
        relationships,
        verifications,
        score,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch entity" });
    }
  });

  // Update entity
  app.put("/api/entities/:id", requireAuth, async (req: any, res) => {
    try {
      const entity = await storage.getEntity(req.params.id);
      if (!entity || entity.userId !== req.user.id) {
        return res.status(404).json({ error: "Entity not found" });
      }

      const { updateEntitySchema } = await import("@shared/schema");
      const updates = updateEntitySchema.parse(req.body);
      const updated = await storage.updateEntity(req.params.id, updates);

      // Create revision
      const revisions = await storage.getEntityRevisions(req.params.id);
      await storage.createEntityRevision({
        entityId: req.params.id,
        editorId: req.user.id,
        revisionNumber: revisions.length + 1,
        payload: JSON.stringify(updated),
        summary: req.body.revisionSummary || "Entity updated",
      });

      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update entity" });
    }
  });

  // Delete entity
  app.delete("/api/entities/:id", requireAuth, async (req: any, res) => {
    try {
      const entity = await storage.getEntity(req.params.id);
      if (!entity || entity.userId !== req.user.id) {
        return res.status(404).json({ error: "Entity not found" });
      }

      await storage.deleteEntity(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete entity" });
    }
  });

  // Entity sources
  app.post("/api/entities/:id/sources", requireAuth, async (req: any, res) => {
    try {
      const entity = await storage.getEntity(req.params.id);
      if (!entity || entity.userId !== req.user.id) {
        return res.status(404).json({ error: "Entity not found" });
      }

      const { insertEntitySourceSchema } = await import("@shared/schema");
      const sourceData = insertEntitySourceSchema.parse({
        ...req.body,
        entityId: req.params.id,
      });

      const source = await storage.createEntitySource(sourceData);
      res.json(source);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to add source" });
    }
  });

  app.delete("/api/entities/:id/sources/:sourceId", requireAuth, async (req: any, res) => {
    try {
      const entity = await storage.getEntity(req.params.id);
      if (!entity || entity.userId !== req.user.id) {
        return res.status(404).json({ error: "Entity not found" });
      }

      await storage.deleteEntitySource(req.params.sourceId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete source" });
    }
  });

  // Entity relationships
  app.post("/api/entities/:id/relationships", requireAuth, async (req: any, res) => {
    try {
      const entity = await storage.getEntity(req.params.id);
      if (!entity || entity.userId !== req.user.id) {
        return res.status(404).json({ error: "Entity not found" });
      }

      const { insertEntityRelationshipSchema } = await import("@shared/schema");
      const relationshipData = insertEntityRelationshipSchema.parse({
        ...req.body,
        fromEntityId: req.params.id,
      });

      const relationship = await storage.createEntityRelationship(relationshipData);
      res.json(relationship);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to add relationship" });
    }
  });

  app.delete("/api/entities/:id/relationships/:relationshipId", requireAuth, async (req: any, res) => {
    try {
      const entity = await storage.getEntity(req.params.id);
      if (!entity || entity.userId !== req.user.id) {
        return res.status(404).json({ error: "Entity not found" });
      }

      await storage.deleteEntityRelationship(req.params.relationshipId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete relationship" });
    }
  });

  // Entity revisions (audit log)
  app.get("/api/entities/:id/revisions", async (req, res) => {
    try {
      const entity = await storage.getEntityBySlug(req.params.id) || await storage.getEntity(req.params.id);
      if (!entity || entity.visibility !== "public") {
        return res.status(404).json({ error: "Entity not found" });
      }

      const revisions = await storage.getEntityRevisions(entity.id);
      res.json(revisions);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch revisions" });
    }
  });

  // ========== OBJECT STORAGE ROUTES ==========
  
  // Serve uploaded objects (protected)
  app.get("/objects/:objectPath(*)", requireAuth, async (req: any, res) => {
    const userId = req.user.id;
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Get upload URL
  app.post("/api/objects/upload", requireAuth, async (req: any, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get upload URL" });
    }
  });

  // Finalize generic media upload
  app.put("/api/objects/finalize", requireAuth, async (req: any, res) => {
    if (!req.body.uploadURL) {
      return res.status(400).json({ error: "uploadURL is required" });
    }

    const userId = req.user.id;

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.uploadURL,
        {
          owner: userId,
          visibility: "public",
        },
      );

      res.status(200).json({ objectPath });
    } catch (error: any) {
      console.error("Error finalizing upload:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update profile with avatar
  app.put("/api/profile/avatar", requireAuth, async (req: any, res) => {
    if (!req.body.avatarURL) {
      return res.status(400).json({ error: "avatarURL is required" });
    }

    const userId = req.user.id;

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.avatarURL,
        {
          owner: userId,
          visibility: "public",
        },
      );

      const profile = await storage.getProfileByUserId(userId);
      if (profile) {
        await storage.updateProfile(profile.id, { avatarUrl: objectPath });
      }

      res.status(200).json({ objectPath });
    } catch (error: any) {
      console.error("Error setting avatar:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ========== AI ROUTES ==========

  // AI Chat Assistant
  app.post("/api/ai/chat", requireAuth, async (req: any, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const userId = req.user.id;
      const user = await storage.getUser(userId);
      const profile = await storage.getProfileByUserId(userId);

      const context = {
        email: user?.email,
        plan: user?.plan,
        hasProfile: !!profile,
      };

      const response = await aiService.chatAssistant(message, context);
      res.json({ response });
    } catch (error: any) {
      console.error("AI chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // AI SEO Insights
  app.get("/api/ai/insights", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getProfileByUserId(userId);
      
      if (!profile) {
        return res.json({ insights: [] });
      }

      const insights = await aiService.generateSEOInsights({
        bio: profile.bio,
        links: profile.links,
        posts: [], // TODO: Add posts when available
      });

      res.json({ insights });
    } catch (error: any) {
      console.error("AI insights error:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  // AI Content Optimization
  app.post("/api/ai/optimize", requireAuth, async (req: any, res) => {
    try {
      const { content, type } = req.body;
      if (!content || !type) {
        return res.status(400).json({ error: "Content and type are required" });
      }

      const optimization = await aiService.optimizeContent(content, type);
      res.json(optimization);
    } catch (error: any) {
      console.error("AI optimization error:", error);
      res.status(500).json({ error: "Failed to optimize content" });
    }
  });

  // AI Entity Extraction
  app.post("/api/ai/extract-entities", requireAuth, async (req: any, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const extraction = await aiService.extractEntities(text);
      res.json(extraction);
    } catch (error: any) {
      console.error("AI entity extraction error:", error);
      res.status(500).json({ error: "Failed to extract entities" });
    }
  });

  // AI Smart Analytics
  app.get("/api/ai/analytics", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      const profile = await storage.getProfileByUserId(userId);
      
      const links = profile ? profile.links : [];
      const subscribers = profile ? await storage.getSubscribersByUserId(userId) : [];

      const analytics = await aiService.generateSmartAnalytics({
        email: user?.email,
        plan: user?.plan,
        profileLinks: links.length,
        blogPosts: 0, // TODO: Add posts count
        subscribers: subscribers.length,
      });

      res.json(analytics);
    } catch (error: any) {
      console.error("AI analytics error:", error);
      res.status(500).json({ error: "Failed to generate analytics" });
    }
  });

  // ========== GOOGLE KNOWLEDGE GRAPH API ==========
  
  // In-memory cache and rate limiting for Knowledge Graph API
  const kgCache = new Map<string, { data: any; timestamp: number }>();
  const kgRateLimit = new Map<string, { count: number; resetTime: number }>();
  const KG_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  const KG_RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
  const KG_RATE_LIMIT_MAX = 30; // 30 requests per 5 minutes per IP
  const GOOGLE_KG_API_KEY = process.env.GOOGLE_KG_API_KEY;
  const DEBUG_KG = process.env.DEBUG_KG === 'true';

  // Helper function to extract kgmid from @id field (e.g., "kg:/m/0dl567" -> "/m/0dl567")
  function extractKgmid(id: string): string | null {
    if (!id) return null;
    const match = id.match(/kg:(\/[mg]\/[a-zA-Z0-9_]+)/);
    return match ? match[1] : null;
  }

  // Helper function to detect if query is a KG ID lookup
  function isKgIdQuery(query: string): boolean {
    return query.startsWith('kg:/') || query.includes('/m/') || query.includes('/g/');
  }

  app.get("/api/kgsearch", async (req: any, res) => {
    try {
      // Check if API key is configured
      if (!GOOGLE_KG_API_KEY) {
        return res.status(503).json({ 
          error: "Tool not configured: missing API key",
          configured: false 
        });
      }

      // Get client IP for rate limiting
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      
      // Rate limiting (30 requests per 5 minutes per IP)
      const now = Date.now();
      const rateData = kgRateLimit.get(clientIp);
      if (rateData) {
        if (now < rateData.resetTime) {
          if (rateData.count >= KG_RATE_LIMIT_MAX) {
            return res.status(429).json({ 
              error: "Rate limit exceeded. Please try again in a few minutes.",
              retryAfter: Math.ceil((rateData.resetTime - now) / 1000)
            });
          }
          rateData.count++;
        } else {
          kgRateLimit.set(clientIp, { count: 1, resetTime: now + KG_RATE_LIMIT_WINDOW });
        }
      } else {
        kgRateLimit.set(clientIp, { count: 1, resetTime: now + KG_RATE_LIMIT_WINDOW });
      }

      // Parse query params
      const query = req.query.query as string;
      const lang = (req.query.lang as string) || 'en';
      const limit = Math.min(20, Math.max(1, parseInt(req.query.limit as string) || 10));
      const types = req.query.types as string;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({ error: "Query must be at least 2 characters" });
      }

      // Check cache - use normalized ID for cache key if it's an ID query
      let cacheKeyQuery = query;
      if (isKgIdQuery(query)) {
        const match = query.match(/(\/[mg]\/[a-zA-Z0-9_]+)/);
        if (match) {
          cacheKeyQuery = `kg:${match[1]}`;
        }
      }
      const cacheKey = `${cacheKeyQuery}:${lang}:${limit}:${types || ''}`;
      const cached = kgCache.get(cacheKey);
      if (cached && (now - cached.timestamp) < KG_CACHE_TTL) {
        if (DEBUG_KG) {
          console.log('[DEBUG_KG] Cache hit:', cacheKey);
        }
        return res.json({ ...cached.data, cached: true });
      }

      // Build Google KG API URL
      const kgUrl = new URL('https://kgsearch.googleapis.com/v1/entities:search');
      kgUrl.searchParams.append('key', GOOGLE_KG_API_KEY);
      kgUrl.searchParams.append('languages', lang);
      kgUrl.searchParams.append('limit', limit.toString());
      kgUrl.searchParams.append('indent', 'true');

      // Check if this is a KG ID lookup (e.g., kg:/m/0dl567 or /m/0dl567)
      if (isKgIdQuery(query)) {
        // Extract the KG ID and use ids[] parameter instead of query
        let kgId = query;
        if (!kgId.startsWith('kg:')) {
          // Normalize to kg: format if just /m/ or /g/ pattern
          const match = kgId.match(/(\/[mg]\/[a-zA-Z0-9_]+)/);
          if (match) {
            kgId = `kg:${match[1]}`;
          }
        }
        kgUrl.searchParams.append('ids', kgId);
        if (DEBUG_KG) {
          console.log('[DEBUG_KG] ID lookup:', kgId);
        }
      } else {
        kgUrl.searchParams.append('query', query);
      }
      
      // Add type filters only if user specified them
      if (types && types.trim()) {
        types.split(',').forEach(type => {
          kgUrl.searchParams.append('types', type.trim());
        });
      }

      if (DEBUG_KG) {
        console.log('[DEBUG_KG] Request:', {
          query,
          lang,
          limit,
          types,
          isIdQuery: isKgIdQuery(query),
          url: kgUrl.toString().replace(GOOGLE_KG_API_KEY, '[REDACTED]')
        });
      }

      // Call Google Knowledge Graph API
      const response = await fetch(kgUrl.toString());
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google KG API error:', errorText);
        return res.status(502).json({ error: "Failed to fetch from Knowledge Graph API" });
      }

      const rawData = await response.json();
      
      if (DEBUG_KG) {
        console.log('[DEBUG_KG] Raw results count:', rawData.itemListElement?.length || 0);
      }
      
      // Normalize results
      const seenIds = new Set<string>();
      const items = (rawData.itemListElement || []).map((item: any) => {
        const result = item.result || {};
        const id = result['@id'] || '';
        const name = result.name || '';
        
        // Deduplicate by id+name
        const dedupKey = `${id}:${name}`;
        if (seenIds.has(dedupKey)) return null;
        seenIds.add(dedupKey);

        // Extract kgmid from @id (e.g., "kg:/m/0dl567" -> "/m/0dl567")
        const kgmid = extractKgmid(id);
        
        // Generate "See on Google" URL - fallback to name-based search if no kgmid
        const seeOnGoogleUrl = kgmid 
          ? `https://www.google.com/search?kgmid=${encodeURIComponent(kgmid)}`
          : `https://www.google.com/search?q=${encodeURIComponent(name)}`;

        // Keep entityHome strictly as official url only
        const sameAsLinks = result.sameAs || [];

        return {
          id,
          kgmid,
          name,
          types: result['@type'] || [],
          score: item.resultScore || 0,
          description: result.description || '',
          detailed: result.detailedDescription ? {
            body: result.detailedDescription.articleBody || '',
            url: result.detailedDescription.url || '',
            license: result.detailedDescription.license || '',
            source: result.detailedDescription.source || ''
          } : null,
          image: result.image?.contentUrl || result.image?.url || null,
          entityHome: result.url || null,
          url: result.url || null,
          sameAs: sameAsLinks,
          seeOnGoogleUrl
        };
      }).filter(Boolean);

      // For ID queries, reorder to put exact match first
      if (isKgIdQuery(query)) {
        const match = query.match(/(\/[mg]\/[a-zA-Z0-9_]+)/);
        if (match) {
          const targetKgmid = match[1];
          items.sort((a: any, b: any) => {
            if (a.kgmid === targetKgmid) return -1;
            if (b.kgmid === targetKgmid) return 1;
            return 0;
          });
        }
      }

      const normalizedData = {
        query,
        items,
        totalResults: items.length,
        timestamp: new Date().toISOString()
      };

      if (DEBUG_KG) {
        console.log('[DEBUG_KG] Response:', {
          query,
          totalResults: items.length,
          firstItem: items[0]?.name || null
        });
      }

      // Cache the result
      kgCache.set(cacheKey, { data: normalizedData, timestamp: now });

      // Clean old cache entries periodically
      if (kgCache.size > 1000) {
        const entries = Array.from(kgCache.entries());
        for (let i = 0; i < entries.length; i++) {
          const [key, value] = entries[i];
          if (now - value.timestamp > KG_CACHE_TTL) {
            kgCache.delete(key);
          }
        }
      }

      res.json(normalizedData);
    } catch (error: any) {
      console.error('KG Search error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Register admin routes
  registerAdminRoutes(app, requireAdmin);

  const httpServer = createServer(app);
  return httpServer;
}

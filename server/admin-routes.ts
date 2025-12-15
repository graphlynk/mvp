import type { Express } from "express";
import { storage } from "./storage";
import { z } from "zod";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-me";

// Add admin routes to the app
export function registerAdminRoutes(app: Express, requireAdmin: any) {
  console.log("🔐 Registering admin routes...");

  // Get all users (with pagination)
  app.get("/api/admin/users", requireAdmin, async (req: any, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;
      
      const users = await storage.getAllUsers(limit, offset);
      const totalUsers = await storage.getUserCount();
      
      res.json({
        users,
        total: totalUsers,
        page,
        totalPages: Math.ceil(totalUsers / limit),
      });
    } catch (error: any) {
      console.error("Admin get users error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get specific user details
  app.get("/api/admin/users/:id", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Get user's profile and tickets
      const profile = await storage.getProfileByUserId(user.id);
      const tickets = await storage.getSupportTicketsByUserId(user.id);
      
      res.json({
        ...user,
        profile,
        tickets,
      });
    } catch (error: any) {
      console.error("Admin get user error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update user (admin can change plan, admin status, etc.)
  app.patch("/api/admin/users/:id", requireAdmin, async (req: any, res) => {
    try {
      const updateSchema = z.object({
        plan: z.enum(["FREE", "PRO", "AUTHORITY"]).optional(),
        isAdmin: z.boolean().optional(),
        name: z.string().optional(),
      });
      
      const updates = updateSchema.parse(req.body);
      const user = await storage.updateUser(req.params.id, updates);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Log admin activity - use original admin ID if impersonating
      const adminId = req.user.originalAdminId || req.user.id;
      await storage.logAdminActivity(
        adminId,
        "update_user",
        req.params.id,
        `Updated user: ${JSON.stringify(updates)}`
      );
      
      res.json(user);
    } catch (error: any) {
      console.error("Admin update user error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Get all support tickets
  app.get("/api/admin/tickets", requireAdmin, async (req: any, res) => {
    try {
      const status = req.query.status as string | undefined;
      const tickets = await storage.getAllSupportTickets(status);
      res.json(tickets);
    } catch (error: any) {
      console.error("Admin get tickets error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update support ticket
  app.patch("/api/admin/tickets/:id", requireAdmin, async (req: any, res) => {
    try {
      const updateSchema = z.object({
        status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        assignedTo: z.string().optional(),
      });
      
      const updates = updateSchema.parse(req.body);
      const ticket = await storage.updateSupportTicket(req.params.id, updates);
      
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      
      // Log admin activity - use original admin ID if impersonating
      const adminId = req.user.originalAdminId || req.user.id;
      await storage.logAdminActivity(
        adminId,
        "update_ticket",
        req.params.id,
        `Updated ticket: ${JSON.stringify(updates)}`
      );
      
      res.json(ticket);
    } catch (error: any) {
      console.error("Admin update ticket error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Impersonate user (switch JWT token to that user)
  app.post("/api/admin/impersonate/:userId", requireAdmin, async (req: any, res) => {
    try {
      const targetUser = await storage.getUser(req.params.userId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const adminUser = req.adminUser; // Use the actual admin user from middleware
      
      // Log admin activity
      await storage.logAdminActivity(
        adminUser.id,
        "impersonate_user",
        targetUser.id,
        `Admin ${adminUser.email} impersonated user ${targetUser.email}`
      );
      
      // Create impersonation token for target user
      const impersonationToken = jwt.sign(
        { 
          id: targetUser.id, 
          email: targetUser.email,
          isImpersonating: true,
          originalAdminId: adminUser.id
        }, 
        JWT_SECRET, 
        { expiresIn: "2h" }
      );
      
      // Set new token as cookie
      res.cookie("ga_session", impersonationToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
      });
      
      res.json({
        message: "Now impersonating user",
        targetUser: {
          id: targetUser.id,
          email: targetUser.email,
          name: targetUser.name,
        },
      });
    } catch (error: any) {
      console.error("Admin impersonate error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Exit impersonation and restore admin session (requires impersonation token)
  app.post("/api/admin/exit-impersonation", async (req: any, res) => {
    try {
      const token = req.cookies?.ga_session;
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Verify this is actually an impersonation token
      if (!decoded.isImpersonating || !decoded.originalAdminId) {
        return res.status(400).json({ error: "Not currently impersonating" });
      }
      
      // Verify the original admin still exists and is still admin
      const originalAdmin = await storage.getUser(decoded.originalAdminId);
      if (!originalAdmin || !originalAdmin.isAdmin) {
        return res.status(403).json({ error: "Original admin account not found or no longer admin" });
      }
      
      // Create new admin token (without impersonation flags)
      const adminToken = jwt.sign(
        { id: originalAdmin.id, email: originalAdmin.email },
        JWT_SECRET,
        { expiresIn: "30d" }
      );
      
      // Restore admin token
      res.cookie("ga_session", adminToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      
      res.json({ message: "Exited impersonation" });
    } catch (error: any) {
      console.error("Exit impersonation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get admin activity logs
  app.get("/api/admin/activity-logs", requireAdmin, async (req: any, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const logs = await storage.getAdminActivityLogs(limit, offset);
      res.json(logs);
    } catch (error: any) {
      console.error("Admin get activity logs error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get dashboard stats
  app.get("/api/admin/stats", requireAdmin, async (req: any, res) => {
    try {
      const stats = {
        totalUsers: await storage.getUserCount(),
        openTickets: await storage.getOpenTicketCount(),
        recentActivity: await storage.getAdminActivityLogs(10, 0),
      };
      res.json(stats);
    } catch (error: any) {
      console.error("Admin get stats error:", error);
      res.status(500).json({ error: error.message });
    }
  });
}

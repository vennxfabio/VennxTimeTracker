import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProjectSchema, insertTimeEntrySchema, insertPlannedHoursSchema, insertVacationScheduleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Middleware to check advanced user role
  const requireAdvancedRole = async (req: any, res: any, next: any) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'advanced') {
        return res.status(403).json({ message: "Advanced role required" });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ message: "Error checking user role" });
    }
  };

  // Project routes (advanced users only)
  app.get("/api/projects", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/active", isAuthenticated, async (req, res) => {
    try {
      const projects = await storage.getActiveProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching active projects:", error);
      res.status(500).json({ message: "Failed to fetch active projects" });
    }
  });

  app.post("/api/projects", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ message: "Failed to create project" });
    }
  });

  // Time entry routes
  app.get("/api/time-entries", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { startDate, endDate } = req.query;
      
      const timeEntries = await storage.getTimeEntries(userId, startDate, endDate);
      res.json(timeEntries);
    } catch (error) {
      console.error("Error fetching time entries:", error);
      res.status(500).json({ message: "Failed to fetch time entries" });
    }
  });

  app.post("/api/time-entries", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entryData = insertTimeEntrySchema.parse({
        ...req.body,
        userId,
      });
      
      const timeEntry = await storage.createTimeEntry(entryData);
      res.json(timeEntry);
    } catch (error) {
      console.error("Error creating time entry:", error);
      res.status(400).json({ message: "Failed to create time entry" });
    }
  });

  app.put("/api/time-entries/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertTimeEntrySchema.partial().parse(req.body);
      
      const timeEntry = await storage.updateTimeEntry(id, updateData);
      res.json(timeEntry);
    } catch (error) {
      console.error("Error updating time entry:", error);
      res.status(400).json({ message: "Failed to update time entry" });
    }
  });

  app.delete("/api/time-entries/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTimeEntry(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting time entry:", error);
      res.status(400).json({ message: "Failed to delete time entry" });
    }
  });

  // Planned hours routes (advanced users only)
  app.get("/api/planned-hours", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const { userId, startDate, endDate } = req.query;
      const plannedHours = await storage.getPlannedHours(userId as string, startDate as string, endDate as string);
      res.json(plannedHours);
    } catch (error) {
      console.error("Error fetching planned hours:", error);
      res.status(500).json({ message: "Failed to fetch planned hours" });
    }
  });

  app.post("/api/planned-hours", isAuthenticated, requireAdvancedRole, async (req: any, res) => {
    try {
      const createdBy = req.user.claims.sub;
      const plannedHoursData = insertPlannedHoursSchema.parse({
        ...req.body,
        createdBy,
      });
      
      const plannedHours = await storage.createPlannedHours(plannedHoursData);
      res.json(plannedHours);
    } catch (error) {
      console.error("Error creating planned hours:", error);
      res.status(400).json({ message: "Failed to create planned hours" });
    }
  });

  // User management routes (advanced users only)
  app.get("/api/users", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const userData = req.body;
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await storage.updateUser(id, userData);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(400).json({ message: "Failed to delete user" });
    }
  });

  // Backup and export routes (advanced users only)
  app.get("/api/backup/database", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const backupData = await storage.getFullBackup();
      res.json(backupData);
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ message: "Failed to create backup" });
    }
  });

  app.get("/api/export/planned-hours", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const data = await storage.getPlannedHoursReport(startDate as string, endDate as string);
      res.json(data);
    } catch (error) {
      console.error("Error exporting planned hours:", error);
      res.status(500).json({ message: "Failed to export planned hours" });
    }
  });

  app.get("/api/export/incurred-hours", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const data = await storage.getIncurredHoursReport(startDate as string, endDate as string);
      res.json(data);
    } catch (error) {
      console.error("Error exporting incurred hours:", error);
      res.status(500).json({ message: "Failed to export incurred hours" });
    }
  });

  app.get("/api/export/allocation", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const data = await storage.getAllocationReport(startDate as string, endDate as string);
      res.json(data);
    } catch (error) {
      console.error("Error exporting allocation report:", error);
      res.status(500).json({ message: "Failed to export allocation report" });
    }
  });

  // Dashboard analytics routes (advanced users only)
  app.get("/api/dashboard/allocation", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const months = parseInt(req.query.months as string) || 6;
      const data = await storage.getGeneralAllocationData(months);
      res.json(data);
    } catch (error) {
      console.error("Error fetching allocation data:", error);
      res.status(500).json({ message: "Failed to fetch allocation data" });
    }
  });

  app.get("/api/dashboard/overtime", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const months = parseInt(req.query.months as string) || 6;
      const data = await storage.getOvertimeData(months);
      res.json(data);
    } catch (error) {
      console.error("Error fetching overtime data:", error);
      res.status(500).json({ message: "Failed to fetch overtime data" });
    }
  });

  app.get("/api/dashboard/top-overtime", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const data = await storage.getTopOvertimeUsers(limit);
      res.json(data);
    } catch (error) {
      console.error("Error fetching top overtime users:", error);
      res.status(500).json({ message: "Failed to fetch top overtime users" });
    }
  });

  app.get("/api/dashboard/top-variance", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const data = await storage.getTopVarianceProjects(limit);
      res.json(data);
    } catch (error) {
      console.error("Error fetching top variance projects:", error);
      res.status(500).json({ message: "Failed to fetch top variance projects" });
    }
  });

  // Personal dashboard data
  app.get("/api/dashboard/personal", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const month = req.query.month as string || new Date().toISOString().slice(0, 7);
      
      const allocation = await storage.getUserAllocationPercentage(userId, month);
      
      res.json({
        allocation,
        pendingHours: 16, // This would be calculated based on actual data
        monthBalance: 4, // This would be calculated based on actual data
      });
    } catch (error) {
      console.error("Error fetching personal dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch personal dashboard data" });
    }
  });

  // Excel export routes (advanced users only)
  app.get("/api/export/planned-hours", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const data = await storage.getPlannedHoursReport(startDate as string, endDate as string);
      res.json(data);
    } catch (error) {
      console.error("Error generating planned hours report:", error);
      res.status(500).json({ message: "Failed to generate planned hours report" });
    }
  });

  app.get("/api/export/incurred-hours", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const data = await storage.getIncurredHoursReport(startDate as string, endDate as string);
      res.json(data);
    } catch (error) {
      console.error("Error generating incurred hours report:", error);
      res.status(500).json({ message: "Failed to generate incurred hours report" });
    }
  });

  app.get("/api/export/allocation", isAuthenticated, requireAdvancedRole, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const data = await storage.getAllocationReport(startDate as string, endDate as string);
      res.json(data);
    } catch (error) {
      console.error("Error generating allocation report:", error);
      res.status(500).json({ message: "Failed to generate allocation report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

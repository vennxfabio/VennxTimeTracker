import {
  users,
  projects,
  timeEntries,
  plannedHours,
  vacationSchedule,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type TimeEntry,
  type InsertTimeEntry,
  type PlannedHours,
  type InsertPlannedHours,
  type VacationSchedule,
  type InsertVacationSchedule,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, sql, sum, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  createUser(userData: any): Promise<User>;
  updateUser(id: string, userData: any): Promise<User>;
  deleteUser(id: string): Promise<void>;
  
  // Project operations
  getProjects(): Promise<Project[]>;
  getActiveProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  
  // Time entry operations
  getTimeEntries(userId: string, startDate?: string, endDate?: string): Promise<TimeEntry[]>;
  getTimeEntriesForProject(projectId: number, startDate?: string, endDate?: string): Promise<TimeEntry[]>;
  createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry>;
  updateTimeEntry(id: number, entry: Partial<InsertTimeEntry>): Promise<TimeEntry>;
  deleteTimeEntry(id: number): Promise<void>;
  
  // Planned hours operations
  getPlannedHours(userId: string, startDate?: string, endDate?: string): Promise<PlannedHours[]>;
  getPlannedHoursForProject(projectId: number, startDate?: string, endDate?: string): Promise<PlannedHours[]>;
  createPlannedHours(plannedHours: InsertPlannedHours): Promise<PlannedHours>;
  updatePlannedHours(id: number, plannedHours: Partial<InsertPlannedHours>): Promise<PlannedHours>;
  
  // Vacation operations
  getVacationSchedule(userId: string): Promise<VacationSchedule[]>;
  createVacationSchedule(vacation: InsertVacationSchedule): Promise<VacationSchedule>;
  
  // Dashboard analytics
  getGeneralAllocationData(months: number): Promise<any[]>;
  getOvertimeData(months: number): Promise<any[]>;
  getTopOvertimeUsers(limit: number): Promise<any[]>;
  getTopVarianceProjects(limit: number): Promise<any[]>;
  getUserAllocationPercentage(userId: string, month: string): Promise<number>;
  
  // Excel export data
  getPlannedHoursReport(startDate: string, endDate: string): Promise<any[]>;
  getIncurredHoursReport(startDate: string, endDate: string): Promise<any[]>;
  getAllocationReport(startDate: string, endDate: string): Promise<any[]>;
  
  // Backup functionality
  getFullBackup(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.firstName, users.lastName);
  }

  async createUser(userData: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        id: `user_${Date.now()}`, // Generate a unique ID
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || "basic",
        position: userData.position,
        department: userData.department,
        isActive: userData.isActive !== undefined ? userData.isActive : true,
      })
      .returning();
    return user;
  }

  async updateUser(id: string, userData: any): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getActiveProjects(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(and(eq(projects.isActive, true), eq(projects.status, "active")))
      .orderBy(projects.name);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  // Time entry operations
  async getTimeEntries(userId: string, startDate?: string, endDate?: string): Promise<TimeEntry[]> {
    const conditions = [eq(timeEntries.userId, userId)];
    
    if (startDate) {
      conditions.push(gte(timeEntries.entryDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(timeEntries.entryDate, endDate));
    }

    return await db
      .select()
      .from(timeEntries)
      .where(and(...conditions))
      .orderBy(desc(timeEntries.entryDate));
  }

  async getTimeEntriesForProject(projectId: number, startDate?: string, endDate?: string): Promise<TimeEntry[]> {
    const conditions = [eq(timeEntries.projectId, projectId)];
    
    if (startDate) {
      conditions.push(gte(timeEntries.entryDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(timeEntries.entryDate, endDate));
    }

    return await db
      .select()
      .from(timeEntries)
      .where(and(...conditions))
      .orderBy(desc(timeEntries.entryDate));
  }

  async createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry> {
    const [newEntry] = await db.insert(timeEntries).values(entry).returning();
    return newEntry;
  }

  async updateTimeEntry(id: number, entry: Partial<InsertTimeEntry>): Promise<TimeEntry> {
    const [updatedEntry] = await db
      .update(timeEntries)
      .set({ ...entry, updatedAt: new Date() })
      .where(eq(timeEntries.id, id))
      .returning();
    return updatedEntry;
  }

  async deleteTimeEntry(id: number): Promise<void> {
    await db.delete(timeEntries).where(eq(timeEntries.id, id));
  }

  // Planned hours operations
  async getPlannedHours(userId: string, startDate?: string, endDate?: string): Promise<PlannedHours[]> {
    const conditions = [eq(plannedHours.userId, userId)];
    
    if (startDate) {
      conditions.push(gte(plannedHours.planDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(plannedHours.planDate, endDate));
    }

    return await db
      .select()
      .from(plannedHours)
      .where(and(...conditions))
      .orderBy(desc(plannedHours.planDate));
  }

  async getPlannedHoursForProject(projectId: number, startDate?: string, endDate?: string): Promise<PlannedHours[]> {
    const conditions = [eq(plannedHours.projectId, projectId)];
    
    if (startDate) {
      conditions.push(gte(plannedHours.planDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(plannedHours.planDate, endDate));
    }

    return await db
      .select()
      .from(plannedHours)
      .where(and(...conditions))
      .orderBy(desc(plannedHours.planDate));
  }

  async createPlannedHours(plannedHoursData: InsertPlannedHours): Promise<PlannedHours> {
    const [newPlannedHours] = await db.insert(plannedHours).values(plannedHoursData).returning();
    return newPlannedHours;
  }

  async updatePlannedHours(id: number, plannedHoursData: Partial<InsertPlannedHours>): Promise<PlannedHours> {
    const [updatedPlannedHours] = await db
      .update(plannedHours)
      .set({ ...plannedHoursData, updatedAt: new Date() })
      .where(eq(plannedHours.id, id))
      .returning();
    return updatedPlannedHours;
  }

  // Vacation operations
  async getVacationSchedule(userId: string): Promise<VacationSchedule[]> {
    return await db
      .select()
      .from(vacationSchedule)
      .where(eq(vacationSchedule.userId, userId))
      .orderBy(desc(vacationSchedule.startDate));
  }

  async createVacationSchedule(vacation: InsertVacationSchedule): Promise<VacationSchedule> {
    const [newVacation] = await db.insert(vacationSchedule).values(vacation).returning();
    return newVacation;
  }

  // Dashboard analytics
  async getGeneralAllocationData(months: number): Promise<any[]> {
    // This would calculate allocation percentages for the last X months
    // For now, return mock structure that the frontend expects
    return [];
  }

  async getOvertimeData(months: number): Promise<any[]> {
    // This would calculate overtime hours for the last X months
    return [];
  }

  async getTopOvertimeUsers(limit: number): Promise<any[]> {
    // This would get users with most overtime hours
    return [];
  }

  async getTopVarianceProjects(limit: number): Promise<any[]> {
    // This would get projects with highest variance between planned and actual hours
    return [];
  }

  async getUserAllocationPercentage(userId: string, month: string): Promise<number> {
    // Calculate user's allocation percentage for a specific month
    return 0;
  }

  // Excel export data
  async getPlannedHoursReport(startDate: string, endDate: string): Promise<any[]> {
    return await db
      .select({
        userId: plannedHours.userId,
        projectName: projects.name,
        planDate: plannedHours.planDate,
        plannedHours: plannedHours.plannedHours,
        entryType: plannedHours.entryType,
      })
      .from(plannedHours)
      .leftJoin(projects, eq(plannedHours.projectId, projects.id))
      .where(and(
        gte(plannedHours.planDate, startDate),
        lte(plannedHours.planDate, endDate)
      ));
  }

  async getIncurredHoursReport(startDate: string, endDate: string): Promise<any[]> {
    return await db
      .select({
        userId: timeEntries.userId,
        projectName: projects.name,
        entryDate: timeEntries.entryDate,
        hours: timeEntries.hours,
        entryType: timeEntries.entryType,
      })
      .from(timeEntries)
      .leftJoin(projects, eq(timeEntries.projectId, projects.id))
      .where(and(
        gte(timeEntries.entryDate, startDate),
        lte(timeEntries.entryDate, endDate)
      ));
  }

  async getAllocationReport(startDate: string, endDate: string): Promise<any[]> {
    // This would calculate allocation percentages per user per period
    return [];
  }

  async getFullBackup(): Promise<any> {
    const [usersData, projectsData, timeEntriesData, plannedHoursData, vacationData] = await Promise.all([
      db.select().from(users),
      db.select().from(projects),
      db.select().from(timeEntries),
      db.select().from(plannedHours),
      db.select().from(vacationSchedule)
    ]);

    return {
      timestamp: new Date().toISOString(),
      version: "1.0",
      data: {
        users: usersData,
        projects: projectsData,
        timeEntries: timeEntriesData,
        plannedHours: plannedHoursData,
        vacationSchedule: vacationData
      }
    };
  }
}

export const storage = new DatabaseStorage();

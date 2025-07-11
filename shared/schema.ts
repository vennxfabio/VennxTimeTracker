import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("basic"), // basic or advanced
  position: varchar("position"),
  department: varchar("department"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  clientName: varchar("client_name", { length: 255 }),
  projectType: varchar("project_type", { length: 100 }), // SOX, LGPD, Auditoria, etc.
  startDate: date("start_date"),
  endDate: date("end_date"),
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, completed, paused
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const timeEntries = pgTable("time_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  entryDate: date("entry_date").notNull(),
  hours: decimal("hours", { precision: 4, scale: 2 }).notNull(),
  entryType: varchar("entry_type", { length: 50 }).notNull(), // project, vacation, leave, hour_bank
  description: text("description"),
  justification: text("justification"), // for hours exceeding planned
  isApproved: boolean("is_approved").default(false),
  approvedBy: varchar("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const plannedHours = pgTable("planned_hours", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  planDate: date("plan_date").notNull(),
  plannedHours: decimal("planned_hours", { precision: 4, scale: 2 }).notNull(),
  entryType: varchar("entry_type", { length: 50 }).notNull(), // project, vacation, leave
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vacationSchedule = pgTable("vacation_schedule", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  vacationType: varchar("vacation_type", { length: 50 }).notNull(), // vacation, sick_leave, personal_leave
  totalDays: integer("total_days").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, approved, rejected
  approvedBy: varchar("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  timeEntries: many(timeEntries),
  plannedHours: many(plannedHours),
  vacationSchedule: many(vacationSchedule),
  createdPlannedHours: many(plannedHours, { relationName: "createdBy" }),
  approvedTimeEntries: many(timeEntries, { relationName: "approvedBy" }),
  approvedVacations: many(vacationSchedule, { relationName: "approvedBy" }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  timeEntries: many(timeEntries),
  plannedHours: many(plannedHours),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  user: one(users, {
    fields: [timeEntries.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [timeEntries.projectId],
    references: [projects.id],
  }),
  approver: one(users, {
    fields: [timeEntries.approvedBy],
    references: [users.id],
    relationName: "approvedBy",
  }),
}));

export const plannedHoursRelations = relations(plannedHours, ({ one }) => ({
  user: one(users, {
    fields: [plannedHours.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [plannedHours.projectId],
    references: [projects.id],
  }),
  creator: one(users, {
    fields: [plannedHours.createdBy],
    references: [users.id],
    relationName: "createdBy",
  }),
}));

export const vacationScheduleRelations = relations(vacationSchedule, ({ one }) => ({
  user: one(users, {
    fields: [vacationSchedule.userId],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [vacationSchedule.approvedBy],
    references: [users.id],
    relationName: "approvedBy",
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTimeEntrySchema = createInsertSchema(timeEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedBy: true,
  approvedAt: true,
});

export const insertPlannedHoursSchema = createInsertSchema(plannedHours).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVacationScheduleSchema = createInsertSchema(vacationSchedule).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedBy: true,
  approvedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type TimeEntry = typeof timeEntries.$inferSelect;
export type InsertTimeEntry = z.infer<typeof insertTimeEntrySchema>;
export type PlannedHours = typeof plannedHours.$inferSelect;
export type InsertPlannedHours = z.infer<typeof insertPlannedHoursSchema>;
export type VacationSchedule = typeof vacationSchedule.$inferSelect;
export type InsertVacationSchedule = z.infer<typeof insertVacationScheduleSchema>;

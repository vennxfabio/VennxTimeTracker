export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: 'basic' | 'advanced';
  position?: string;
  department?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  clientName?: string;
  projectType?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeEntry {
  id: number;
  userId: string;
  projectId?: number;
  entryDate: string;
  hours: number;
  entryType: 'project' | 'vacation' | 'leave' | 'hour_bank';
  description?: string;
  justification?: string;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlannedHours {
  id: number;
  userId: string;
  projectId?: number;
  planDate: string;
  plannedHours: number;
  entryType: 'project' | 'vacation' | 'leave';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VacationSchedule {
  id: number;
  userId: string;
  startDate: string;
  endDate: string;
  vacationType: string;
  totalDays: number;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardKPIs {
  generalAllocation: number;
  overtimeHours: number;
  activeProjects: number;
  averageVariance: number;
}

export interface PersonalDashboard {
  allocation: number;
  pendingHours: number;
  monthBalance: number;
}

export interface ChartData {
  month: string;
  value: number;
  total?: number;
}

export interface TopOvertimeUser {
  id: string;
  name: string;
  position: string;
  hours: number;
  variance: number;
  avatar: string;
}

export interface TopVarianceProject {
  id: number;
  name: string;
  planned: number;
  incurred: number;
  variance: number;
  percentage: number;
}

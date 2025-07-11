# VX Time Management System

## Overview

This is a full-stack time management application designed for GRC (Governance, Risk, and Compliance) consulting companies. The system features role-based access control with basic and advanced user roles, time entry tracking, project management, and executive dashboards.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for RESTful API
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Replit Auth integration with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

### Database Design
- Uses Drizzle ORM with PostgreSQL dialect
- Supports database migrations through `drizzle-kit`
- Schema includes tables for users, projects, time entries, planned hours, and vacation schedules
- Role-based access control with 'basic' and 'advanced' user roles

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL with `connect-pg-simple`
- **Role Management**: User roles determine feature access
  - Basic users: Time entry only
  - Advanced users: Full dashboard and project management

### Time Management
- **Time Entry**: Daily time logging with project assignment
- **Validation**: 8-hour minimum workday validation
- **Entry Types**: Project work, vacation, leave, hour bank
- **Calendar Interface**: Month view with day selection

### Project Management (Advanced Users)
- **Project CRUD**: Create, read, update project information
- **Project Types**: SOX, LGPD, Auditoria, Consultoria, VAR, BPO
- **Status Tracking**: Active, completed, paused projects
- **Client Management**: Associate projects with clients

### Dashboard Analytics (Advanced Users)
- **KPI Cards**: General allocation, overtime hours, active projects, variance metrics
- **Charts**: Allocation trends, overtime analysis using Recharts
- **Top Performers**: User and project performance metrics

## Data Flow

1. **Authentication Flow**:
   - User authenticates via Replit Auth
   - Session stored in PostgreSQL
   - User role determines accessible features

2. **Time Entry Flow**:
   - Users select date and project
   - Time entries validated against business rules
   - Data persisted to PostgreSQL via Drizzle ORM

3. **Dashboard Flow**:
   - Advanced users access aggregated analytics
   - Data retrieved through API endpoints
   - Charts and KPIs rendered client-side

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework

### Authentication & Security
- **openid-client**: OpenID Connect authentication
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Fast build tool and dev server
- **typescript**: Static type checking
- **@replit/vite-plugin-***: Replit-specific development plugins

## Deployment Strategy

### Development
- **Command**: `npm run dev`
- **Environment**: Development mode with hot reload
- **Database**: Uses Neon serverless PostgreSQL
- **Session Secret**: Required environment variable

### Production Build
- **Build Command**: `npm run build`
- **Frontend**: Vite builds to `dist/public`
- **Backend**: esbuild bundles server to `dist/index.js`
- **Start Command**: `npm start`

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit environment identifier
- `ISSUER_URL`: OpenID Connect issuer URL

### Database Management
- **Schema**: Located in `shared/schema.ts`
- **Migrations**: Generated in `./migrations` directory
- **Push Command**: `npm run db:push` for schema deployment

## Changelog

Changelog:
- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
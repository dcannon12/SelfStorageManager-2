# Storage Management System

A comprehensive self-storage management platform designed to streamline tenant management and facility operations with advanced financial tracking and communication tools.

## Project Structure

### Client-Side (`/client`)

#### Components (`/client/src/components`)
- **dialogs/**
  - `gate-access-dialog.tsx` - Manages facility gate access codes and schedules
  - `tenant-message-dialog.tsx` - Handles tenant communication
  - `unit-dialog.tsx` - Unit management dialog
- **ui/** - Contains reusable UI components using shadcn/ui
- `manager-layout.tsx` - Main layout component for manager dashboard
- `manager-sidebar.tsx` - Navigation sidebar for manager interface
- `manager-topbar.tsx` - Top navigation bar with facility selection
- `unit-hover-card.tsx` - Displays unit details on hover
- `unit-card.tsx` - Individual unit display component
- `unit-grid.tsx` - Grid layout for unit display

#### Pages (`/client/src/pages`)
- **manager/**
  - `collections.tsx` - Payment collection and overdue management
  - `gate.tsx` - Gate access control
  - `home.tsx` - Dashboard homepage
  - `leads.tsx` - Lead management
  - `locks.tsx` - Lock management
  - `messaging.tsx` - Tenant communication
  - `notifications.tsx` - System notifications
  - `payments.tsx` - Payment processing
  - `pricing.tsx` - Unit pricing management
  - `rentals.tsx` - Rental management
  - `reports.tsx` - Analytics and reporting
  - `site-map.tsx` - Visual facility layout
  - `tenant-details.tsx` - Individual tenant information
  - `units.tsx` - Unit management

#### Library (`/client/src/lib`)
- `facility-context.tsx` - Facility selection state management
- `api.ts` - API communication utilities
- `queryClient.ts` - React Query configuration
- `utils.ts` - Shared utility functions

### Server-Side (`/server`)
- `db.ts` - Database connection and configuration
- `storage.ts` - Data storage interface and implementation
- `routes.ts` - API route definitions
- `index.ts` - Server entry point
- `vite.ts` - Vite server configuration

### Shared (`/shared`)
- `schema.ts` - Database schema definitions and types using Drizzle ORM

## Key Features

1. **Multi-Facility Management**
   - Facility selection and management
   - Unified dashboard for all facilities
   - Individual facility monitoring

2. **Unit Management**
   - Visual site map
   - Unit status tracking
   - Customizable unit display
   - Occupancy management

3. **Tenant Management**
   - Tenant profiles
   - Contact information
   - Gate access control
   - Document management

4. **Financial Management**
   - Payment processing
   - Collections tracking
   - Overdue payment management
   - Financial reporting

5. **Security Features**
   - Gate access control
   - Digital lock management
   - Access code management
   - Activity logging

## Technology Stack

- **Frontend**
  - React
  - TypeScript
  - TanStack Query
  - Tailwind CSS
  - shadcn/ui components
  - Wouter (routing)

- **Backend**
  - Express.js
  - Drizzle ORM
  - PostgreSQL
  - WebSocket support

## Database Schema

The application uses a PostgreSQL database with the following main entities:

### Core Tables
- Units
- Customers
- Bookings
- Payments
- Leads
- PricingGroups

### Supporting Tables
- NotificationTemplates
- CustomerDocuments
- CustomerInsurance
- DigitalSignatures

### Analytics & Reporting
- **StorageManagerData** - Central analytics table that aggregates data from multiple sources:
  - Facility metrics (total units, occupancy rates)
  - Financial data (revenue, pending/overdue payments)
  - Customer statistics (total, active, overdue)
  - Booking information (total, active bookings)
  - Lead tracking (total, conversion rates)
  - Automatic timestamp updates for real-time analytics
  - Foreign key relationships with:
    - facility_layouts (layout visualization)
    - pricing_groups (pricing strategy)

Each entity is defined in `shared/schema.ts` using Drizzle ORM with proper relations and validations.

## Quick Start Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/SelfStorageManager-2.git
   cd SelfStorageManager-2
   ```

2. **Set Up Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env with your PostgreSQL credentials
   nano .env
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Set Up the Database**
   ```bash
   # Push the schema to your database
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Development Guidelines

1. **Code Organization**
   - Follow the established file structure
   - Keep components modular and reusable
   - Use TypeScript for type safety

2. **State Management**
   - Use React Query for server state
   - Context for global app state
   - Local state for component-specific data

3. **Styling**
   - Use Tailwind CSS for styling
   - Follow shadcn/ui component patterns
   - Maintain consistent theming

4. **API Communication**
   - Use React Query for data fetching
   - Implement proper error handling
   - Maintain type safety with shared schemas

5. **Data Analytics Integration**
   - Use StorageManagerData for centralized metrics
   - Implement automatic data aggregation
   - Ensure real-time statistics updates
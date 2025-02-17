# File Structure Overview

## Root Directory
```
├── client/                 # Frontend application
├── server/                 # Backend server
├── shared/                 # Shared types and schemas
├── drizzle.config.ts      # Database configuration
├── package.json           # Project dependencies
└── theme.json            # UI theme configuration
```

## Client Directory (`/client`)
```
src/
├── components/            # Reusable React components
│   ├── dialogs/          # Modal and dialog components
│   │   ├── gate-access-dialog.tsx
│   │   ├── tenant-message-dialog.tsx
│   │   └── unit-dialog.tsx
│   ├── ui/               # shadcn/ui components
│   ├── manager-layout.tsx
│   ├── manager-sidebar.tsx
│   ├── manager-topbar.tsx
│   ├── unit-hover-card.tsx
│   ├── unit-card.tsx
│   └── unit-grid.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── facility-context.tsx
│   ├── api.ts
│   ├── queryClient.ts
│   └── utils.ts
├── pages/                # Application pages
│   ├── manager/         # Manager dashboard pages
│   │   ├── collections.tsx
│   │   ├── gate.tsx
│   │   ├── home.tsx
│   │   ├── leads.tsx
│   │   ├── locks.tsx
│   │   ├── messaging.tsx
│   │   ├── notifications.tsx
│   │   ├── payments.tsx
│   │   ├── pricing.tsx
│   │   ├── rentals.tsx
│   │   ├── reports.tsx
│   │   ├── site-map.tsx
│   │   ├── tenant-details.tsx
│   │   └── units.tsx
│   ├── book.tsx
│   ├── dashboard.tsx
│   └── not-found.tsx
├── App.tsx              # Main application component
├── index.css           # Global styles
└── main.tsx           # Application entry point
```

## Server Directory (`/server`)
```
├── db.ts               # Database connection setup
├── storage.ts          # Data storage implementation
├── routes.ts           # API route definitions
├── index.ts           # Server entry point
└── vite.ts            # Vite server configuration
```

## Shared Directory (`/shared`)
```
└── schema.ts           # Shared types and database schema
```

## Key Files Description

### Frontend
- `App.tsx`: Main application component with routing setup
- `facility-context.tsx`: Global facility selection state management
- `manager-layout.tsx`: Layout wrapper for manager dashboard
- `site-map.tsx`: Visual representation of facility units
- `collections.tsx`: Payment collection and overdue management
- `payments.tsx`: Payment processing interface

### Backend
- `db.ts`: PostgreSQL database connection configuration
- `storage.ts`: Database operations implementation
- `routes.ts`: API endpoint definitions and handlers

### Shared
- `schema.ts`: Contains:
  - Database schema definitions using Drizzle ORM
  - TypeScript types for frontend and backend
  - Zod validation schemas
  - Type utilities for database operations

## File Naming Conventions

1. **Components**
   - Use PascalCase for component files
   - Suffix dialog components with `-dialog`
   - Suffix layout components with `-layout`

2. **Pages**
   - Use kebab-case for page files
   - Group related pages in directories

3. **Utilities**
   - Use camelCase for utility files
   - Use descriptive names indicating functionality

4. **Types and Schemas**
   - Use camelCase for type files
   - Group related types in shared schema files

## Import Conventions

1. **Absolute Imports**
   - Use `@/` for imports from the src directory
   - Use `@shared/` for imports from the shared directory

2. **Relative Imports**
   - Use relative imports for closely related files
   - Avoid deep nesting of relative imports

## Adding New Files

When adding new files:

1. **Components**
   - Add to appropriate subdirectory in `/components`
   - Include proper TypeScript types
   - Follow component organization pattern

2. **Pages**
   - Add to `/pages` directory
   - Update routing in `App.tsx`
   - Follow existing page structure

3. **API Routes**
   - Add to `routes.ts`
   - Update storage interface if needed
   - Add corresponding types to schema.ts

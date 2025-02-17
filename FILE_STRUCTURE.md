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
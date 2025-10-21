# System Architecture

**Last Updated**: October 21, 2025

## Overview

HH Dashboard is a modern React-based analytics dashboard following clean architecture principles with strict separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
├─────────────────────────────────────────────────────────────┤
│  React 19 + TypeScript 5.8 + Vite 7                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Presentation Layer                                   │  │
│  │  ├── Routes (TanStack Router)                        │  │
│  │  ├── Components (Ant Design + Custom)                │  │
│  │  └── Layouts (Dashboard Layout)                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↕                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  State Management Layer                               │  │
│  │  ├── Zustand (Global UI State)                       │  │
│  │  ├── TanStack Query (Server State)                   │  │
│  │  └── Router State (URL Parameters)                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↕                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Business Logic Layer                                 │  │
│  │  ├── Hooks (Custom React Hooks)                      │  │
│  │  ├── Services (API Communication)                    │  │
│  │  └── Utils (Helper Functions)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↕                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Data Layer                                           │  │
│  │  ├── Axios (HTTP Client)                             │  │
│  │  ├── Query Client (Caching)                          │  │
│  │  └── Types (TypeScript Definitions)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↕
         ┌─────────────────────────────────────┐
         │  API / Data Source                  │
         │  (Currently: Static JSON Files)     │
         │  (Future: REST API / GraphQL)       │
         └─────────────────────────────────────┘
```

## Layer Responsibilities

### Presentation Layer
**Location**: `src/routes/`, `src/components/`

**Responsibilities**:
- Render UI components
- Handle user interactions
- Route navigation
- Display loading/error states
- No business logic

**Key Files**:
- `src/routes/dashboard.tsx` - Dashboard page
- `src/components/layout/dashboard-layout.component.tsx` - Main layout

### State Management Layer
**Location**: `src/stores/`, TanStack Query, TanStack Router

**Responsibilities**:
- Manage global UI state (theme, sidebar)
- Cache and synchronize server data
- Handle URL state for shareability
- Provide reactive updates to UI

**State Types**:
1. **Global UI State** (Zustand)
   - Theme preference (light/dark)
   - Sidebar collapsed state
   - Loading indicators

2. **Server State** (TanStack Query)
   - Analytics data
   - Cached API responses
   - Background refetching

3. **URL State** (TanStack Router)
   - Date ranges
   - Filters
   - Active views

### Business Logic Layer
**Location**: `src/hooks/`, `src/services/`, `src/utils/`

**Responsibilities**:
- Encapsulate business rules
- Data transformation
- API communication
- Reusable logic

**Key Files**:
- `src/hooks/use-analytics.hook.ts` - Analytics data fetching
- `src/services/analytics.service.ts` - Analytics API service

### Data Layer
**Location**: `src/config/`, TypeScript types

**Responsibilities**:
- HTTP client configuration
- Query client setup
- Type definitions
- Data validation

**Key Files**:
- `src/config/axios.config.ts` - Axios instance
- `src/config/query-client.config.ts` - React Query client

## Data Flow

### Read Flow (Data Fetching)
```
1. User Action (e.g., navigate to dashboard)
   ↓
2. Route Component Mounts
   ↓
3. Custom Hook Called (useAnalytics)
   ↓
4. React Query Checks Cache
   ↓
5a. Cache Hit → Return Cached Data
5b. Cache Miss → Call Service Layer
   ↓
6. Service Layer (analyticsService)
   ↓
7. Axios HTTP Request
   ↓
8. API Response
   ↓
9. React Query Updates Cache
   ↓
10. Component Re-renders with Data
```

### Write Flow (State Updates)
```
1. User Interaction (e.g., toggle theme)
   ↓
2. Event Handler in Component
   ↓
3. Zustand Action Called (setTheme)
   ↓
4. Store State Updated
   ↓
5. All Subscribed Components Re-render
```

## File Organization

```
src/
├── routes/              # File-based routes (TanStack Router)
│   ├── __root.tsx      # Root layout
│   ├── index.tsx       # Home page
│   └── dashboard.tsx   # Dashboard page
│
├── components/          # Reusable React components
│   ├── layout/         # Layout components
│   ├── charts/         # Chart components (planned)
│   └── ui/             # UI components
│
├── stores/             # Zustand state stores
│   └── app.store.ts    # Global app state
│
├── hooks/              # Custom React hooks
│   └── use-analytics.hook.ts
│
├── services/           # API service layer
│   └── analytics.service.ts
│
├── config/             # Configuration files
│   ├── axios.config.ts
│   ├── query-client.config.ts
│   └── theme.config.ts
│
├── data/               # Type definitions and mock data
│   └── analytics.types.ts (to be created)
│
├── utils/              # Helper functions
│
├── assets/             # Static assets
│
└── styles/             # Global styles
```

## Type Safety Strategy

### TypeScript Configuration
- Strict mode enabled
- No implicit any
- Strict null checks
- Full type inference

### Type Definition Locations
- **API Types**: `src/data/*.types.ts`
- **Component Props**: Inline with component
- **Store Types**: Inline with store definition
- **Utility Types**: `src/utils/*.types.ts`

### Current Type Definitions Needed
```typescript
// src/data/analytics.types.ts (to be created)
export interface AnalyticsData {
  date: string
  revenue: number
  users: number
  conversions: number
  pageViews: number
}

export interface AnalyticsMetrics {
  totalRevenue: number
  totalUsers: number
  totalConversions: number
  totalPageViews: number
  avgRevenue: number
  avgUsers: number
  conversionRate: number
}
```

## Configuration Management

### Environment-Specific Config
- **Development**: Mock data from `/public/data/`
- **Testing**: Mock data with controlled fixtures
- **Production**: Real API endpoints

### Configuration Files
- `vite.config.ts` - Build configuration, path aliases
- `tsconfig.json` - TypeScript compiler options
- `eslint.config.js` - Linting rules

## Routing Strategy

### File-Based Routing
Using TanStack Router's file-based approach:
- Each file in `src/routes/` becomes a route
- Automatic code splitting per route
- Type-safe navigation with full inference

### Current Routes
- `/` - Home/index page
- `/dashboard` - Main dashboard view
- Future: `/settings`, `/profile`, etc.

## Performance Considerations

### Code Splitting
- Route-level splitting via TanStack Router
- Lazy loading for heavy components (planned)
- Dynamic imports for charts (planned)

### Caching Strategy
- React Query default: 5-minute stale time
- Background refetching enabled
- Optimistic updates for mutations (future)

### Bundle Optimization
- Vite's automatic tree-shaking
- Production build minification
- CSS optimization via Ant Design theming

## Security Considerations

### Current State
- No authentication implemented yet
- No authorization layer
- Client-side only (no sensitive data)

### Future Security Layers
- JWT-based authentication
- Role-based access control (RBAC)
- API key management
- HTTPS enforcement
- Input sanitization
- XSS protection

## Error Handling Strategy

### Error Boundaries (To Be Implemented)
- Route-level error boundaries
- Component-level error boundaries for critical UI
- Fallback UI for errors

### API Error Handling
- React Query automatic retry logic
- Error states in UI
- User-friendly error messages
- Error logging (future: Sentry)

## Testing Strategy (Planned)

### Unit Tests
- Component tests with React Testing Library
- Hook tests with testing-library/react-hooks
- Service layer tests

### Integration Tests
- Route integration tests
- State management integration tests

### E2E Tests
- Critical user flows with Playwright
- Visual regression testing

## Deployment Architecture (Future)

### Static Hosting Options
- Vercel (recommended for Vite projects)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

### Backend API (Future)
- Node.js + Express
- Python + FastAPI
- Go + Gin
- Consideration: Serverless (AWS Lambda, Vercel Functions)

## Monitoring & Observability (Future)

### Performance Monitoring
- Web Vitals tracking
- Core Web Vitals (LCP, FID, CLS)
- Custom performance metrics

### Error Tracking
- Sentry integration
- Error rate monitoring
- User impact analysis

### Analytics
- User behavior tracking
- Feature usage metrics
- Conversion funnels


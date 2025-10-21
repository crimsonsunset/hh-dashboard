# State Resolution & Technical Decisions

**Last Updated**: October 21, 2025

## Purpose
This document tracks technical decisions, state resolution strategies, and architectural choices made during development. It serves as a historical record of "why we did things this way."

## Current State Summary

### Project Status
- **Phase**: Phase 1 (Foundation & Core Dashboard) - 75% Complete
- **Last Activity**: October 21, 2025 - Documentation bootstrap
- **Git Status**: No initial commit yet (pending Phase 1 completion)
- **Development Server**: Vite dev server at `http://localhost:5173`

### What's Working
✅ Full routing system with TanStack Router  
✅ Dark/light theme switching with persistence  
✅ Responsive layout with collapsible sidebar  
✅ Type-safe navigation and imports  
✅ React Query setup with analytics hooks  
✅ Mock data structure and service layer  
✅ ESLint configuration  

### What's Pending
🔨 Dashboard page UI (currently placeholder)  
🔨 Metrics cards for key analytics  
🔨 Chart components using Recharts  
🔨 Data integration (wiring React Query to UI)  
🔨 Date range filtering UI  
🔨 Loading and error states  

## Technical Decisions

### Decision 1: TanStack Router over React Router
**Date**: October 2025  
**Context**: Needed routing solution for dashboard  
**Decision**: Use TanStack Router instead of React Router  

**Rationale**:
- Type-safe routing with full TypeScript inference
- File-based routing for better organization
- Built-in code splitting
- URL state management for shareable dashboard views
- Active development and modern API

**Trade-offs**:
- Newer library (less mature than React Router)
- Smaller community
- Less Stack Overflow content

**Status**: ✅ Implemented and working well

---

### Decision 2: Zustand over Redux/Context
**Date**: October 2025  
**Context**: Needed global state management for UI preferences  
**Decision**: Use Zustand for global UI state  

**Rationale**:
- Minimal boilerplate compared to Redux
- No context provider hell
- Excellent TypeScript support
- Tiny bundle size (~1KB vs Redux ~15KB)
- Simple API, easy to understand

**Trade-offs**:
- No built-in devtools (though available as separate package)
- Less prescriptive (could lead to inconsistent patterns)
- Smaller ecosystem than Redux

**Status**: ✅ Implemented for theme and sidebar state

**Code Example**:
```typescript
// Clean, simple API
const { theme, setTheme } = useAppStore()
setTheme('dark')
```

---

### Decision 3: Three-State Strategy
**Date**: October 2025  
**Context**: Need to manage different types of state  
**Decision**: Split state into three categories  

**State Categories**:
1. **Global UI State** (Zustand)
   - Theme preference
   - Sidebar collapsed
   - Loading indicators
   - User preferences

2. **Server State** (TanStack Query)
   - Analytics data
   - API responses
   - Cached data
   - Background refetching

3. **URL State** (TanStack Router)
   - Date ranges
   - Active filters
   - Search queries
   - Shareable state

**Rationale**:
- Each tool optimized for its use case
- Clear separation of concerns
- Easier to reason about data flow
- Avoids prop drilling

**Trade-offs**:
- Multiple state management libraries
- Learning curve for three different APIs
- Need to understand when to use which

**Status**: ✅ Architecture defined, partially implemented

---

### Decision 4: Ant Design over Material-UI
**Date**: October 2025  
**Context**: Needed comprehensive component library  
**Decision**: Use Ant Design instead of Material-UI  

**Rationale**:
- Enterprise-grade components out of the box
- Built-in theming system (easier dark mode)
- More dashboard/admin-focused components
- Excellent date pickers and data tables
- Better default styling for dashboards

**Trade-offs**:
- Larger bundle size than building from scratch
- Opinionated design system
- Less customizable than headless UI libraries

**Status**: ✅ Implemented with custom theme

---

### Decision 5: Recharts for Data Visualization
**Date**: October 2025  
**Context**: Need charting library for analytics  
**Decision**: Use Recharts instead of Chart.js/D3  

**Rationale**:
- React-first API (declarative)
- Composable components
- Responsive by default
- Good TypeScript support
- Easier to customize than Chart.js
- Less complex than raw D3

**Trade-offs**:
- Less feature-rich than D3
- Fewer chart types than Chart.js
- Performance concerns for very large datasets
- Smaller community than Chart.js

**Status**: ✅ Installed, not yet implemented

---

### Decision 6: Path Aliases over Relative Imports
**Date**: October 2025  
**Context**: Avoid relative import hell  
**Decision**: Use path aliases for all top-level src directories  

**Implementation**:
```typescript
// Instead of: ../../../stores/app.store
import { useAppStore } from '@stores/app.store'

// Instead of: ../../components/layout/dashboard-layout.component
import { DashboardLayout } from '@components/layout/dashboard-layout.component'
```

**Rationale**:
- More readable imports
- Easier to refactor (moving files doesn't break imports)
- Consistent import paths
- Better autocomplete

**Trade-offs**:
- Requires configuration in both tsconfig and vite.config
- Could confuse developers unfamiliar with aliases
- Slightly more complex build setup

**Status**: ✅ Fully implemented and configured

---

### Decision 7: File Naming Convention
**Date**: October 2025  
**Context**: Need consistent naming across codebase  
**Decision**: Use kebab-case with type suffixes  

**Convention**:
- Components: `dashboard-layout.component.tsx`
- Stores: `app.store.ts`
- Services: `analytics.service.ts`
- Hooks: `use-analytics.hook.ts`
- Types: `analytics.types.ts`
- Utils: `date.helpers.ts`

**Rationale**:
- Clear file purpose at a glance
- Easy to find related files
- Consistent with industry best practices
- Good for file system sorting

**Trade-offs**:
- More verbose filenames
- Not everyone uses this convention
- Slightly more typing

**Status**: ✅ Implemented across all files

---

### Decision 8: Mock Data Strategy
**Date**: October 2025  
**Context**: No backend API yet  
**Decision**: Serve mock data from `/public/data/` via Axios  

**Implementation**:
- Mock JSON files in `/public/data/`
- Axios configured to fetch from relative URLs
- Same API interface as future real API
- React Query treats it like real server state

**Rationale**:
- Easy to swap for real API later
- Tests React Query integration
- No need for mock server
- Realistic data flow patterns

**Trade-offs**:
- Not truly async (no network latency simulation)
- Can't test error states easily
- Limited to GET requests

**Future Migration Path**:
```typescript
// Change this:
const { data } = await apiClient.get('/mock-analytics.json')

// To this:
const { data } = await apiClient.get('/api/v1/analytics')
```

**Status**: ✅ Implemented and working

---

### Decision 9: Strict TypeScript Configuration
**Date**: October 2025  
**Context**: Ensure type safety  
**Decision**: Enable strict mode and all strict checks  

**Configuration**:
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "strictBindCallApply": true,
  "strictPropertyInitialization": true,
  "noImplicitThis": true,
  "alwaysStrict": true
}
```

**Rationale**:
- Catch errors at compile time
- Better IDE support
- Self-documenting code
- Easier refactoring

**Trade-offs**:
- More verbose code (explicit types)
- Steeper learning curve
- Slower initial development

**Status**: ✅ Configured and enforced

---

## Unresolved Questions

### Question 1: Backend Technology Choice
**Context**: Eventually need a real backend API  
**Options Considered**:
- Node.js + Express (JavaScript ecosystem)
- Python + FastAPI (great for data analytics)
- Go + Gin (high performance)
- Serverless (AWS Lambda, Vercel Functions)

**Status**: ⏸️ Deferred until Phase 3

---

### Question 2: Authentication Strategy
**Context**: Will need user authentication  
**Options Considered**:
- JWT tokens
- Session-based
- OAuth2 (Google, GitHub)
- Auth0 / Clerk (third-party)

**Status**: ⏸️ Deferred until Phase 4

---

### Question 3: Real-time Updates Strategy
**Context**: May want real-time dashboard updates  
**Options Considered**:
- WebSockets
- Server-Sent Events (SSE)
- Polling with React Query
- GraphQL subscriptions

**Status**: ⏸️ Deferred until Phase 4

---

## Known Technical Debt

### High Priority
1. **No Type Definition File**: `analytics.types.ts` doesn't exist yet
2. **No Error Boundaries**: App could crash with no recovery
3. **No Loading Skeletons**: Poor UX during data fetching

### Medium Priority
4. **Mock Data Dates**: Using 2024 dates (might confuse users)
5. **No Tests**: Zero test coverage
6. **No Error Logging**: Errors only visible in console

### Low Priority
7. **No Storybook**: Hard to develop components in isolation
8. **No Documentation Site**: Only README and /docs
9. **No CI/CD**: Manual deployment process

---

## Migration Paths

### From Mock Data to Real API
**Timeline**: Phase 3  
**Steps**:
1. Create backend API (technology TBD)
2. Update `axios.config.ts` with API base URL
3. Update service layer methods
4. Add authentication headers
5. Handle real loading/error states
6. Remove mock data files

**Effort**: 2-3 weeks

---

### From Client-Only to Full-Stack
**Timeline**: Phase 4  
**Steps**:
1. Choose backend technology
2. Implement API endpoints
3. Add authentication layer
4. Add database (PostgreSQL, MongoDB, etc.)
5. Deploy backend
6. Update frontend config
7. Add error tracking (Sentry)

**Effort**: 4-6 weeks

---

## References

### Official Documentation
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Ant Design](https://ant.design/)
- [Recharts](https://recharts.org/)
- [Vite](https://vite.dev/)

### Community Resources
- [React 19 Release Notes](https://react.dev/blog/2025/01/01/react-19)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Clean Code in React](https://github.com/ryanmcdermott/clean-code-javascript)


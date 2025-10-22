# Project Roadmap

*LLM Data Explorer MVP - Take-Home Assignment Implementation*

**Last Updated**: October 21, 2025

## How to Update This Doc
Update this document when major milestones are reached or implementation phases are completed.

## Current Status
- **Phase**: Phase 1 - Core Data Explorer
- **Status**: 🔨 In Progress (Foundation Complete, Features Pending)
- **Target**: Build a maintainable, production-ready data exploration interface for LLM responses

## Project Overview
- **Name**: LLM Data Explorer
- **Purpose**: Data exploration interface for analyzing LLM response patterns and performance metrics
- **Owner**: Joe Sangiorgio (jsangio1@gmail.com)
- **Repository**: Personal/hh-dashboard
- **Context**: Engineering take-home test - treating as foundation of a long-term project

### Core Requirements
1. **Upload & Process Data** - Load JSON files with LLM response data
2. **Visualize the Data** - Chart library visualization (response times, token usage, etc.)
3. **Present Data Gracefully** - Clean data grid with proper handling of long responses
4. **Refine Component Rendering** - Smooth performance with 1000+ responses

## Technology Stack

### Core Framework
- **React 19** - Latest React features and performance improvements
- **TypeScript 5.8** - Strict type safety throughout
- **Vite 7** - Lightning-fast build tool and dev server

### Routing & State
- **TanStack Router 1.x** - Type-safe file-based routing
- **Zustand 5.x** - Lightweight state management for in-memory data and UI state

### UI & Visualization
- **Ant Design 5.x** - Comprehensive component library with built-in theming
  - Virtual scrolling for tables (1000+ rows)
  - Built-in components for consistent UI
- **Recharts 3.x** - Composable charting library for data visualization

### Data
- Mock LLM response data:
  - `public/data/short.mock-data.json` - Small dataset (~5 responses)
  - `public/data/long.mock-data.json` - Large dataset (~1000 responses)
- Client-side data loading (no API calls)
- In-memory data management via Zustand

## Implementation Phases

### Phase 1: Core Data Explorer ✅
**Status**: Complete  
**Started**: October 21, 2025  
**Completed**: October 21, 2025  
**Goal**: Functional data exploration interface with loading, visualization, and tabular views

#### Foundation (Complete) ✅
- [x] Project scaffolding with Vite + React + TypeScript
- [x] TanStack Router setup with file-based routing
- [x] Path aliases configuration (@stores, @components, @types, etc.)
- [x] Zustand store for global state (theme, UI preferences)
- [x] Ant Design integration with dark/light theme system
- [x] Responsive dashboard layout with collapsible sidebar
- [x] ESLint configuration with TypeScript rules
- [x] LLM response type definitions
- [x] Mock data structure (small and large datasets)

#### Implementation (Complete) ✅
- [x] Data store (Zustand) for loaded LLM response data
- [x] Data loading UI with "Load Small" and "Load Large" buttons
- [x] Response time line chart component (Recharts)
- [x] Virtual scrolling data table (Ant Design Table with `virtual` prop)
- [x] Reset functionality to clear data and load different dataset
- [x] Proper handling of null values and error states in UI
- [x] Layout that handles long output text gracefully
- [x] File upload with drag-and-drop (react-dropzone)
- [x] Three-layer file validation (extension, JSON, schema)
- [x] Error messages with Ant Design message component (bottom placement)

#### Success Criteria
- ✅ User can load small or large dataset with button click
- ✅ Response time chart displays correctly for all loaded data
- ✅ Table handles 1000+ rows smoothly with virtual scrolling
- ✅ Long response text doesn't break layout (truncated with ellipsis)
- ✅ Error/timeout responses display appropriately
- ✅ Reset button returns to initial loading state

---

### Phase 2: Enhanced Visualization
**Status**: Not Started  
**Dependencies**: Phase 1 complete  
**Timeline**: Optional enhancement if time permits

#### Goals
- [ ] Chart type selector dropdown
- [ ] Additional chart types:
  - Token usage by model (bar chart)
  - Cost analysis over time (line chart)
  - Quality scores distribution (scatter or bar chart)
- [ ] Chart configuration components
- [ ] More interactive data exploration features

#### Success Criteria
- ✅ Dropdown allows switching between chart types
- ✅ Each chart type renders correctly
- ✅ Charts remain performant with large datasets

---

### Phase 3: File Upload ✅
**Status**: Complete  
**Dependencies**: Phase 1 complete  
**Completed**: October 21, 2025

#### Goals
- [x] Drag-and-drop file upload component (react-dropzone)
- [x] JSON file validation against `LLMResponseData` type
- [x] Error handling for invalid files
- [x] Augment "Load Small/Large" buttons with upload area

#### Implementation Details
- Three-layer validation system:
  1. File extension validation (.json only)
  2. JSON parseability check
  3. Schema validation (responses array, required fields)
- User-facing error messages via Ant Design message component
- Support for custom datasets alongside mock data
- Test files included in `public/test-files/` for validation testing

#### Success Criteria
- ✅ User can drag-and-drop JSON files
- ✅ Invalid files show helpful error messages
- ✅ Valid files load and display correctly
- ✅ Maintains performance with custom datasets

---

## Technical Decisions

### Architecture Patterns
- **State Management Strategy**: 
  - Zustand for in-memory loaded data and UI state (theme, preferences)
  - Client-side data loading (no API calls, direct JSON parsing)
  - Simple, predictable state flow
  
- **File Naming Convention**: 
  - Components: `kebab-case.component.tsx`
  - Stores: `kebab-case.store.ts`
  - Types: `kebab-case.types.ts`
  - Hooks: `use-kebab-case.hook.ts`
  
- **Import Strategy**: 
  - Path aliases for all top-level src directories
  - Clean imports without relative path hell

### Why These Technologies?

**TanStack Router**
- Type-safe routing with full TypeScript inference
- File-based routing for intuitive structure
- Built-in code splitting

**Zustand**
- Minimal boilerplate vs Redux
- No context provider needed
- Perfect for in-memory data management
- Tiny bundle size (~1KB)

**Ant Design**
- Enterprise-grade components
- Built-in virtual scrolling for tables (handles 1000+ rows)
- Excellent theming system
- Consistent component API

**Recharts**
- React-first charting library
- Composable, declarative API
- Responsive by default
- Good TypeScript support

## Design Principles

This MVP is built as the foundation of a long-term project:

1. **Clean Architecture**
   - Separation of concerns
   - Single responsibility components
   - Maintainable patterns team can follow

2. **Type Safety**
   - Strict TypeScript (no `any` types)
   - Full type inference
   - Compile-time error catching

3. **Simplicity First**
   - Minimal styling (barebones but usable)
   - Focus on functionality over aesthetics
   - Nice spacing and formatting

4. **Performance**
   - Smooth handling of 1000+ data points
   - Virtual scrolling for tables
   - Responsive chart rendering

5. **Extensibility**
   - Easy to add new chart types
   - Easy to add new data sources
   - Easy to extend functionality

## Data Structure

LLM Response format (from `src/types/llm-response.types.ts`):

```typescript
interface LLMResponse {
  id: string
  timestamp: string
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | string
  prompt_tokens: number
  completion_tokens: number | null
  total_tokens: number | null
  response_time_ms: number
  status: 'success' | 'error' | 'timeout'
  cost_usd: number
  temperature: number
  max_tokens: number
  prompt_template: string
  output: string | null
  evaluation_metrics: {
    relevance_score: number
    factual_accuracy: number
    coherence_score: number
    response_quality: number
  } | null
  error: {
    type: string
    message: string
  } | null
}
```

## Known Technical Debt

### Current
- No git commit history yet (pending Phase 1 completion)
- Dashboard route has placeholder content only
- No error boundaries implemented
- No loading states/skeletons
- No tests (acceptable for MVP scope)

### Acceptable for MVP
- Minimal styling (by design)
- Single route only (focused scope)
- No real API integration (client-side only)
- No authentication (not required)

## Out of Scope

The following are explicitly **not** part of this MVP:

- ❌ User authentication system
- ❌ Backend API integration
- ❌ Real-time data updates
- ❌ Dashboard customization
- ❌ Multiple saved views
- ❌ Data export functionality (beyond what's built-in)
- ❌ Advanced filtering/search
- ❌ Comprehensive test coverage
- ❌ Production deployment configuration
- ❌ CI/CD pipeline
- ❌ SEO optimization
- ❌ Analytics tracking

These features may be considered for future iterations but are not part of the take-home assignment scope.

## Success Metrics

### Phase 1 Complete When:
1. ✅ User can load small dataset (5 responses) and large dataset (1000+ responses)
2. ✅ Response time chart renders correctly
3. ✅ Data table displays all responses with virtual scrolling
4. ✅ Layout handles long text without breaking
5. ✅ Error/timeout responses display appropriately
6. ✅ Reset functionality works correctly
7. ✅ Code is clean, well-typed, and maintainable
8. ✅ No console errors or warnings

### Overall MVP Success:
- Demonstrates clean architecture patterns
- Shows understanding of performance optimization
- Exhibits type-safe TypeScript usage
- Represents code quality suitable for production
- Sets patterns team would want to follow

---

**Note**: This roadmap is focused exclusively on the take-home assignment requirements. Future iterations may expand scope based on project needs.

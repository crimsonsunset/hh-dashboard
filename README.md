# LLM Data Explorer

A modern, type-safe data exploration interface for analyzing LLM response patterns and performance metrics. Built with React, TypeScript, and TanStack Router following clean architecture patterns.

## 🎯 Purpose

Data exploration tool for AI engineers to understand LLM performance through:
- Interactive data loading (small/large datasets)
- Response time visualization with line charts
- Comprehensive data table with virtual scrolling (1000+ rows)
- Model comparison (GPT-4, GPT-3.5, Claude)
- Token usage, cost analysis, and quality metrics
- Error and timeout tracking

## 🚀 Tech Stack

### Core Framework
- **React 19** - Latest React with modern features
- **TypeScript 5.8** - Strict type safety throughout
- **Vite 7** - Lightning-fast build tool and dev server
- **TanStack Router 1.x** - Type-safe file-based routing

### UI & Styling
- **Ant Design 5.x** - Comprehensive component library with built-in theming
- **Recharts 3.x** - Composable charting library for data visualization

### State Management
- **Zustand 5.x** - Lightweight state management for in-memory data and UI state

### Development Tools
- **ESLint 9** - Code quality and consistency
- **TypeScript ESLint** - TypeScript-specific linting rules

## ✨ Features

### Foundation (Complete)
✅ **Type-Safe Architecture** - Strict TypeScript with full inference  
✅ **Clean Code Patterns** - Maintainable, extensible codebase structure  
✅ **Theme System** - Dark/light mode with persistent state  
✅ **Path Aliases** - Clean imports using `@stores`, `@components`, etc.  
✅ **Mock LLM Data** - Small (~5 responses) and large (~1000 responses) datasets  

### Core MVP (In Development)
- **Data Loading Interface** - Load small or large datasets with one click
- **Response Time Chart** - Line chart visualization using Recharts
- **Virtual Scrolling Table** - Ant Design table handling 1000+ rows smoothly
- **Data Reset** - Clear current dataset and load a different one

### Future Enhancements
- **Chart Type Selector** - Toggle between response time, token usage, cost, and quality metrics
- **File Upload** - Drag-and-drop JSON file support with validation  

## 📁 Project Structure

```
hh-dashboard/
├── src/
│   ├── routes/              # File-based routing (TanStack Router)
│   ├── components/          # Reusable React components
│   │   ├── layout/         # Layout components
│   │   ├── charts/         # Chart components
│   │   └── ui/             # UI components
│   ├── stores/             # Zustand state management
│   ├── types/              # TypeScript type definitions
│   ├── services/           # API service layer
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper utilities
│   ├── config/             # Configuration files
│   ├── assets/             # Static assets
│   └── styles/             # Global styles
├── docs/                   # Project documentation
└── public/                 # Public static files
    └── data/               # Mock LLM response data
        ├── long.mock-data.json   # Large dataset (~1000 responses)
        └── short.mock-data.json  # Small dataset (~5 responses)
```

## 📊 Data Structure

LLM response data structure:

```typescript
interface LLMResponse {
  id: string
  timestamp: string
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | string
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
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

### Path Aliases
All top-level `src` directories use path aliases for clean imports:

```typescript
import { useAppStore } from '@stores/app.store'
import { DashboardLayout } from '@components/layout/dashboard-layout.component'
import { LLMResponse } from '@data/llm.types'
```

### File Naming Convention
- **Components**: `kebab-case.component.tsx` (e.g., `dashboard-layout.component.tsx`)
- **Stores**: `kebab-case.store.ts` (e.g., `app.store.ts`)
- **Types**: `kebab-case.types.ts` (e.g., `llm.types.ts`)
- **Services**: `kebab-case.service.ts` (e.g., `llm.service.ts`)
- **Hooks**: `use-kebab-case.hook.ts` (e.g., `use-llm-data.hook.ts`)

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Development Server
The app runs at `http://localhost:5173` with hot module replacement enabled.

## 🏗️ Architecture Decisions

### State Management Strategy
- **Zustand** for in-memory loaded dataset and UI state (theme, preferences)
- Client-side data loading (no API calls, direct JSON parsing)
- Simple, predictable state flow for data exploration

### Why These Technologies?

**TanStack Router**
- Type-safe routing with full TypeScript inference
- File-based routing for intuitive project structure
- Built-in code splitting for optimal performance

**Zustand**
- Minimal boilerplate compared to Redux
- No context provider needed
- Perfect for in-memory data management
- Tiny bundle size (~1KB)

**Recharts**
- React-first charting library
- Composable, declarative API
- Responsive by default

**Ant Design**
- Enterprise-grade components
- Built-in virtual scrolling for tables
- Excellent theming system

## 📊 Data Flow

1. **User Action** → Click "Load Small Dataset" or "Load Large Dataset"
2. **Data Fetch** → Load JSON file from `/src/data/`
3. **Parse & Validate** → Validate against `LLMResponseData` type
4. **Store Update** → Zustand store receives parsed data
5. **UI Re-render** → Chart and table components display data
6. **Reset** → Clear store, return to loading state

## 🎨 Theming

The app uses Ant Design's built-in theming system with full support for:
- Light and dark color schemes
- Consistent component styling across themes
- Persistent theme preference in Zustand store

Toggle theme via the user menu in the top-right corner.

## 📝 Implementation Approach

### Overview
This project implements a production-ready LLM response data explorer with emphasis on clean architecture, type safety, and performance optimization.

### Technical Approach
1. **State Management Pattern**: Three-layer strategy separating UI state (Zustand), server state (React Query), and URL state (TanStack Router)
2. **Data Loading**: Client-side JSON file loading with React Query for caching and conditional fetching
3. **File Validation**: Three-layer validation system (extension → JSON syntax → schema validation)
4. **Performance**: Virtual scrolling for 1000+ row tables, conditional query fetching, memoized chart data
5. **Error Handling**: User-facing error messages via Ant Design message component with try-catch wrappers

### Key Architectural Decisions
- **TanStack Router**: Type-safe file-based routing with full TypeScript inference
- **Zustand**: Minimal state management (~1KB) for UI preferences and dataset selection
- **React Query**: Server state management with built-in caching and background refetching
- **Ant Design**: Enterprise-grade components with virtual scrolling and theming support
- **Recharts**: React-first declarative charting library

### Implementation Status
- ✅ **Phase 1**: Core data explorer (complete)
- ✅ **Phase 3**: File upload with validation (completed ahead of schedule)
- ⏸️ **Phase 2**: Enhanced visualization (deferred)

## 🎯 Design Principles

This MVP is built as the foundation of a long-term project:
- **Clean Architecture** - Separation of concerns, maintainable patterns
- **Type Safety** - Strict TypeScript, no compromises
- **Simplicity First** - Minimal styling, focus on functionality
- **Performance** - Smooth handling of 1000+ data points
- **Extensibility** - Easy to add new chart types and features

## 📋 Assumptions Made

1. **Client-Side Only**: No backend API required for MVP; all data processing happens client-side
2. **Mock Data Sufficiency**: Two dataset sizes (5 and 1000 responses) are adequate for demonstration
3. **JSON Format**: Custom uploaded files follow the same schema as mock data (`LLMResponseData` type)
4. **Browser Support**: Modern browsers with ES2022 support (Chrome, Firefox, Safari, Edge)
5. **Single User**: No authentication or multi-user considerations needed for MVP
6. **Static Deployment**: App can be deployed to static hosting (Netlify, Vercel, etc.)
7. **Theme Persistence**: Theme preference persists in memory only (session-based, no localStorage)
8. **Virtual Scrolling**: Ant Design's virtual scrolling is sufficient for handling large datasets

## 🚀 Future Improvements

Given more time, the following enhancements would be prioritized:

### Immediate Priorities
- **Wire up Date Selection**: Connect the date picker in the header to filter data by timestamp range
- **Proper URL Routing**: Implement query params for shareable filtered views (`/dashboard?filters=X`)
- **Graph Selector**: Add dropdown to toggle between different chart types (response time, tokens, cost, quality)

### Architecture & Quality
- **Styling System**: Establish design tokens and CSS-in-JS primitives for consistent theming
- **Responsive Design**: Optimize layout for mobile and tablet devices
- **Testing Framework**: Add unit tests (React Testing Library) and E2E tests (Playwright)

### Features
- **Advanced Filtering**: Multi-field filtering (model, status, date range, metrics thresholds)
- **Data Export**: CSV/JSON export functionality
- **Chart Interactions**: Tooltips, zoom, brush selection for detailed analysis
- **Metrics Cards**: Summary statistics at top of dashboard
- **Error Boundaries**: Route-level and component-level error recovery

### Performance
- **Code Splitting**: Dynamic imports for chart components
- **Loading Skeletons**: Replace spinners with skeleton screens
- **Debounced Search**: Add search/filter inputs with debouncing

## 📄 License

This project is private and not licensed for public use.

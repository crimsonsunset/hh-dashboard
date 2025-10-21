# LLM Monitoring Dashboard

A modern, type-safe LLM monitoring dashboard built with React, TypeScript, and TanStack Router. Monitor AI model performance, costs, and quality metrics clean architecture patterns.

## 🎯 Purpose

Monitor and analyze LLM (Large Language Model) API responses including:
- Token usage and costs
- Response times and performance
- Model comparison (GPT-4, GPT-3.5, Claude, etc.)
- Quality metrics (relevance, accuracy, coherence)
- Error tracking and status monitoring

## 🚀 Tech Stack

### Core Framework
- **React 19** - Latest React with modern features
- **TypeScript 5.8** - Strict type safety throughout
- **Vite 7** - Lightning-fast build tool and dev server
- **TanStack Router 1.x** - Type-safe file-based routing

### UI & Styling
- **Ant Design 5.x** - Comprehensive component library with built-in theming
- **Recharts 3.x** - Composable charting library for data visualization

### State & Data Management
- **Zustand 5.x** - Lightweight state management for global app state
- **TanStack Query 5.x** - Powerful data fetching and caching
- **Axios 1.x** - HTTP client for API calls

### Development Tools
- **ESLint 9** - Code quality and consistency
- **TypeScript ESLint** - TypeScript-specific linting rules

## ✨ Features

### Implemented
✅ **Full Routing System** - Dashboard and data view pages  
✅ **Dark/Light Theme** - Seamless theme switching with persistent state  
✅ **Responsive Layout** - Collapsible sidebar, mobile-friendly design  
✅ **Type-Safe Navigation** - Full TypeScript inference for routes  
✅ **Path Aliases** - Clean imports using `@stores`, `@components`, etc.  
✅ **File Naming Convention** - Consistent kebab-case with type suffixes  
✅ **Mock LLM Data** - Realistic sample data for development  

### Ready to Implement
🔜 LLM response metrics dashboard  
🔜 Cost tracking and analysis  
🔜 Model performance comparison  
🔜 Quality metrics visualization  
🔜 Time range filtering  
🔜 Error rate monitoring  

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
│   ├── data/               # Mock data and TypeScript types
│   │   ├── long.mock-data.json   # Large dataset (~1000 responses)
│   │   └── short.mock-data.json  # Small dataset (~5 responses)
│   ├── config/             # Configuration files
│   ├── assets/             # Static assets
│   └── styles/             # Global styles
├── docs/                   # Project documentation
└── public/                 # Public static files
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
- **Zustand** for global UI state (theme, user preferences, sidebar state)
- **URL State** (via TanStack Router) for shareable state (filters, date ranges)
- **React Query** for server state (data fetching, caching, background updates)

### Why TanStack Router?
- **Type-safe routing** with full TypeScript inference
- **File-based routing** for intuitive project structure
- **Built-in code splitting** for optimal performance
- **URL state management** for shareable dashboard views

### Why Zustand?
- **Minimal boilerplate** compared to Redux
- **No context provider** needed
- **Great TypeScript support** with full type inference
- **Tiny bundle size** (~1KB)

## 📊 Data Flow

1. **User Interaction** → Updates URL state or triggers actions
2. **React Query** → Fetches LLM response data using URL params as query keys
3. **Caching & Updates** → Intelligent caching with background refresh
4. **State Updates** → Zustand manages UI state, React Query manages server state
5. **Re-render** → React efficiently updates only changed components

## 🎨 Theming

The app uses Ant Design's built-in theming system with full support for:
- Light and dark color schemes
- Consistent component styling across themes
- Persistent theme preference in Zustand store

Toggle theme via the user menu in the top-right corner.

## 📝 Documentation

Additional documentation can be found in the `docs/` directory:
- **roadmap.md** - Feature roadmap and implementation phases
- **next-session.md** - Active session planning and immediate priorities
- **state-resolution.md** - Technical decisions and architecture

## 🔮 Roadmap

See [docs/roadmap.md](./docs/roadmap.md) for the full feature roadmap and implementation phases.

**Current Phase**: Phase 1 In Progress 🔨  
**Status**: Foundation complete, visualization layer pending  
**Next Phase**: Complete Phase 1 (metrics cards, charts, data integration)

## 📄 License

This project is private and not licensed for public use.

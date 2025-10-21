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

## 📝 Implementation Plan

This project follows a phased implementation approach:

### Phase 1: Core Data Explorer (Current)
- Data loading interface with small/large dataset buttons
- Response time line chart visualization
- Virtual scrolling data table (1000+ rows)
- Reset functionality to switch datasets

### Phase 2: Enhanced Visualization (Future)
- Chart type selector dropdown
- Additional chart types (token usage, cost, quality metrics)
- More interactive data exploration features

### Phase 3: File Upload (Future)
- Drag-and-drop JSON file upload
- Client-side validation and parsing
- Support for custom datasets

## 🎯 Design Principles

This MVP is built as the foundation of a long-term project:
- **Clean Architecture** - Separation of concerns, maintainable patterns
- **Type Safety** - Strict TypeScript, no compromises
- **Simplicity First** - Minimal styling, focus on functionality
- **Performance** - Smooth handling of 1000+ data points
- **Extensibility** - Easy to add new chart types and features

## 📄 License

This project is private and not licensed for public use.

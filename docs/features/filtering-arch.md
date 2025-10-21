# Filtering Architecture: URL Params + Zustand + React Query

**Created**: October 21, 2025  
**Status**: Architectural Planning  
**Purpose**: Document how to integrate URL-based filtering with existing state management

---

## Current Architecture Overview

### State Management Layers

Our project uses a **three-layer state management strategy**:

1. **Zustand** - Private UI state (theme, sidebar, dataset selection)
2. **React Query** - Server state (data fetching, caching, loading states)
3. **TanStack Router** - URL state (planned for filters, shareable state)

### Current Data Flow

```
User Action: "Load Large Dataset"
   ↓
1. Zustand: setActiveDataset('long')
   ↓
2. React Query: useLongLLMData({ enabled: activeDataset === 'long' })
   ↓
3. Service Layer: llmService.getLongData()
   ↓
4. Axios: GET /src/data/long.mock-data.json
   ↓
5. React Query: Cache data with key ['llm-data', 'long']
   ↓
6. Component: Display all 1000 responses
```

### Existing Stores

**app.store.ts** - Global UI preferences
```typescript
{
  theme: 'light' | 'dark',           // Not shareable (personal preference)
  sidebarCollapsed: boolean,         // Not shareable (UI state)
  isLoading: boolean                 // Not shareable (transient state)
}
```

**data.store.ts** - Dataset selection
```typescript
{
  activeDataset: 'short' | 'long' | null  // Currently not shareable
}
```

### React Query Integration

**Conditional Fetching Pattern:**
```typescript
const shortQuery = useShortLLMData({ enabled: activeDataset === 'short' })
const longQuery = useLongLLMData({ enabled: activeDataset === 'long' })
```

- Query only runs when `enabled: true`
- Data cached by query key: `['llm-data', 'short']` or `['llm-data', 'long']`
- 5-minute stale time for caching

---

## The Filtering Challenge

We want to add **date range** and **metrics filters** to the dashboard header:
- Date range picker (start date, end date)
- Metrics multi-select (tokens, cost, response time, quality)

### Key Questions

1. **Should filters be shareable?** Can users bookmark/share filtered dashboard views?
2. **Where should filter state live?** URL params, Zustand, or component state?
3. **How to filter data?** Client-side filtering or query-based filtering?
4. **Should dataset selection also be shareable?** Move from Zustand to URL?

---

## Option A: Client-Side Filtering (Recommended Start)

### Description
Keep existing architecture, add URL-based filters, filter data in the component.

### Data Flow
```
User loads dataset:
  1. setActiveDataset('long') → Zustand
  2. useLongLLMData fetches ALL data → React Query
  3. Data cached by ['llm-data', 'long']

User sets filters:
  1. Update URL params: ?startDate=2025-01-01&endDate=2025-01-31&metrics=tokens,cost
  2. Read URL params in component
  3. Filter React Query data in useMemo
  4. Display filtered results
```

### Implementation

**1. Add Search Schema to Route**
```typescript
// src/routes/dashboard.tsx
import { z } from 'zod'

const dashboardSearchSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  metrics: z.array(z.string()).optional().default([]),
})

export const Route = createFileRoute('/dashboard')({
  validateSearch: dashboardSearchSchema,
  component: DashboardWithLayout,
})
```

**2. Read/Write URL Params in Layout**
```typescript
// dashboard-layout.component.tsx
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@routes/dashboard'
import dayjs from 'dayjs'

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate()
  const search = Route.useSearch() // Type-safe: { startDate?, endDate?, metrics? }
  
  // Convert string dates back to Dayjs for DatePicker
  const dateRange = search.startDate && search.endDate 
    ? [dayjs(search.startDate), dayjs(search.endDate)]
    : null
  
  const handleDateChange = (dates: [Dayjs, Dayjs] | null) => {
    navigate({
      search: (prev) => ({
        ...prev,
        startDate: dates?.[0]?.format('YYYY-MM-DD'),
        endDate: dates?.[1]?.format('YYYY-MM-DD'),
      }),
    })
  }
  
  const handleMetricsChange = (selectedMetrics: string[]) => {
    navigate({
      search: (prev) => ({
        ...prev,
        metrics: selectedMetrics,
      }),
    })
  }
  
  return (
    <Layout>
      <Header>
        <RangePicker 
          value={dateRange}
          onChange={handleDateChange}
        />
        <Select
          mode="multiple"
          value={search.metrics}
          onChange={handleMetricsChange}
        />
      </Header>
      {children}
    </Layout>
  )
}
```

**3. Filter Data in Dashboard Component**
```typescript
// dashboard.tsx (DashboardPage component)
function DashboardPage() {
  const search = Route.useSearch()
  const { activeDataset } = useDataStore()
  const currentQuery = activeDataset === 'short' ? shortQuery : longQuery
  const allData = currentQuery.data?.responses || []
  
  // Client-side filtering based on URL params
  const filteredData = useMemo(() => {
    let filtered = allData
    
    // Filter by date range
    if (search.startDate && search.endDate) {
      const start = new Date(search.startDate)
      const end = new Date(search.endDate)
      
      filtered = filtered.filter(response => {
        const responseDate = new Date(response.timestamp)
        return responseDate >= start && responseDate <= end
      })
    }
    
    // Metrics filter could control what's displayed/calculated
    // (e.g., only show certain columns or metrics cards)
    
    return filtered
  }, [allData, search.startDate, search.endDate])
  
  return (
    <div>
      <ResponseTimeChart data={filteredData} />
      <ResponseTable data={filteredData} />
    </div>
  )
}
```

### Pros
- ✅ Minimal changes to existing architecture
- ✅ Filters are shareable via URL
- ✅ No changes to hooks or stores
- ✅ Easy to implement and understand
- ✅ Works with current dataset selection pattern

### Cons
- ❌ Always fetches full dataset (inefficient for real API later)
- ❌ Client-side filtering could be slow with massive datasets
- ❌ React Query cache doesn't differentiate between filter combinations

### When to Use
- **Now** - Best starting point with mock data
- Works well when datasets are reasonably sized (<10k records)
- Good for prototyping before real API exists

---

## Option B: Query-Key Integration (Future: Real API)

### Description
URL params become part of React Query's cache key, enabling per-filter caching.

### Data Flow
```
User sets filters in URL:
  1. ?startDate=2025-01-01&endDate=2025-01-31
  2. Dashboard reads URL params
  3. Pass params to useLongLLMData({ filters: { startDate, endDate } })
  4. React Query queryKey: ['llm-data', 'long', { startDate, endDate }]
  5. Each filter combination caches separately
  6. Service layer receives filters (for future API filtering)
```

### Implementation

**1. Update Hook to Accept Filters**
```typescript
// use-llm-data.hook.ts
interface LLMFilters {
  startDate?: string
  endDate?: string
}

export function useLongLLMData(
  filters?: LLMFilters,
  options?: Omit<UseQueryOptions<LLMResponseData>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['llm-data', 'long', filters], // Filters part of cache key
    queryFn: () => llmService.getLongData(filters), // Pass to service
    select: (data) => {
      // Optional: Filter in React Query select for now
      if (!filters?.startDate || !filters?.endDate) return data
      
      return {
        ...data,
        responses: data.responses.filter(response => {
          const responseDate = new Date(response.timestamp)
          return responseDate >= new Date(filters.startDate!) &&
                 responseDate <= new Date(filters.endDate!)
        })
      }
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
```

**2. Update Service Layer**
```typescript
// llm.service.ts
async getLongData(filters?: LLMFilters): Promise<LLMResponseData> {
  // For now, still fetch all data
  const response = await axios.get<LLMResponseData>('/src/data/long.mock-data.json')
  
  // Future: Pass filters to real API
  // const response = await axios.get('/api/v1/llm-data', { params: filters })
  
  return response.data
}
```

**3. Use in Dashboard**
```typescript
function DashboardPage() {
  const search = Route.useSearch()
  const { activeDataset } = useDataStore()
  
  const filters = {
    startDate: search.startDate,
    endDate: search.endDate,
  }
  
  // React Query caches each filter combo separately
  const shortQuery = useShortLLMData(filters, { enabled: activeDataset === 'short' })
  const longQuery = useLongLLMData(filters, { enabled: activeDataset === 'long' })
  
  const currentData = currentQuery.data?.responses || []
  // Data already filtered by React Query select or API
}
```

### Pros
- ✅ Each filter combination caches independently
- ✅ Ready for real API (just change service layer)
- ✅ React Query manages filtered data lifecycle
- ✅ Background refetching per filter combo

### Cons
- ❌ More complex than Option A
- ❌ With mock data, still fetches same file (no performance gain yet)
- ❌ Many filter combinations = many cache entries

### When to Use
- **Later** - When adding real API backend (Phase 3)
- When API supports server-side filtering
- When datasets are too large for client-side filtering

---

## Option C: Full URL State (Maximum Shareability)

### Description
Move ALL dashboard state (including dataset selection) to URL params.

### Example URL
```
/dashboard?dataset=long&startDate=2025-01-01&endDate=2025-01-31&metrics=tokens,cost
```

### Data Flow
```
User shares URL → Opens to exact dashboard state
  1. Read ALL state from URL params
  2. No Zustand needed for dataset selection
  3. React Query fetches based on URL params
  4. Filters applied based on URL params
  5. Everything is shareable and bookmarkable
```

### Implementation

**1. Expanded Search Schema**
```typescript
const dashboardSearchSchema = z.object({
  dataset: z.enum(['short', 'long']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  metrics: z.array(z.string()).optional().default([]),
})
```

**2. Remove data.store.ts**
- Delete `src/stores/data.store.ts`
- All dataset state lives in URL

**3. Update Dashboard Logic**
```typescript
function DashboardPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  
  // Dataset comes from URL, not Zustand
  const activeDataset = search.dataset
  
  const handleLoadLarge = () => {
    navigate({ search: { ...search, dataset: 'long' } })
  }
  
  // React Query enabled based on URL
  const longQuery = useLongLLMData({ enabled: activeDataset === 'long' })
}
```

### Pros
- ✅ 100% shareable dashboard state
- ✅ Simpler state management (one less store)
- ✅ Deep linking to exact dashboard views
- ✅ Better for collaborative workflows

### Cons
- ❌ Requires refactoring existing patterns
- ❌ Breaks current UX (dataset selection buttons won't work the same)
- ❌ More URL parameters to manage

### When to Use
- **Maybe Later** - If full shareability becomes critical
- When building collaborative features
- When user workflows require sharing exact dashboard views

---

## Recommendation: Start with Option A

### Rationale

**Option A (Client-Side Filtering)** is the best starting point because:

1. **Minimal Disruption**: Works with existing Zustand + React Query setup
2. **Immediate Value**: Filters become shareable right away
3. **Low Risk**: No breaking changes to current patterns
4. **Easy Migration**: Can upgrade to Option B when adding real API

### Implementation Path

**Phase 1 (Now)**: Option A
- Add URL search schema to dashboard route
- Wire date/metrics pickers to URL params
- Filter data in dashboard component with useMemo
- Test shareability with mock data

**Phase 2 (Later)**: Optionally upgrade to Option B
- When adding real backend API (Phase 3 in roadmap)
- Update hooks to accept filters in query key
- Update service layer to pass filters to API
- Backend handles filtering, returns subset of data

**Phase 3 (Optional)**: Consider Option C
- Only if full shareability becomes requirement
- Refactor dataset selection to URL
- Remove data.store.ts

---

## Decision Points

Before implementing, decide:

### 1. Filter Shareability
**Should users be able to share filtered dashboard views via URL?**
- **Yes** → Use URL params (Option A or B)
- **No** → Could use Zustand or component state instead

### 2. Dataset Shareability
**Should dataset selection (short/long) be in the URL?**
- **Keep in Zustand** → Current UX preserved (Option A or B)
- **Move to URL** → Full shareability (Option C)

### 3. Filtering Strategy
**Where should filtering happen?**
- **Client-side** → Component with useMemo (Option A)
- **React Query select** → Hook-level filtering (Option B variant)
- **Backend API** → Server-side filtering (Option B with real API)

---

## Code Examples by Option

### Option A: Component-Level Filtering
```typescript
const filteredData = useMemo(() => {
  return allData.filter(response => {
    if (search.startDate && search.endDate) {
      const date = new Date(response.timestamp)
      return date >= new Date(search.startDate) && date <= new Date(search.endDate)
    }
    return true
  })
}, [allData, search.startDate, search.endDate])
```

### Option B: Query-Key Filtering
```typescript
const { data } = useLongLLMData(
  { startDate: search.startDate, endDate: search.endDate },
  { enabled: activeDataset === 'long' }
)
// Data already filtered, queryKey caches per filter combo
```

### Option C: Full URL State
```typescript
// URL: /dashboard?dataset=long&startDate=2025-01-01
const search = Route.useSearch()
const { dataset, startDate, endDate } = search
// Everything driven by URL params
```

---

## Performance Considerations

### Client-Side Filtering (Option A)
- **Fast** for datasets < 10,000 records
- **Acceptable** for 10,000 - 50,000 records
- **Slow** for 50,000+ records
- Current mock data: ~1,000 responses (perfectly fine)

### Query-Key Filtering (Option B)
- Same as Option A until real API exists
- With real API: Backend handles heavy lifting
- Better for large datasets

### Cache Management
- **Option A**: One cache entry per dataset (2 entries total)
- **Option B**: One cache entry per dataset + filter combo (could be many)
- **Option C**: Same as Option A or B depending on filtering strategy

---

## Migration Path: Mock Data → Real API

### Current (Mock Data)
```typescript
// Service fetches static JSON
async getLongData() {
  return axios.get('/src/data/long.mock-data.json')
}
```

### Future (Real API with Option A)
```typescript
// Service calls real API, still fetches all data
async getLongData() {
  return axios.get('/api/v1/llm-responses')
}

// Filtering happens client-side in component
const filtered = allData.filter(/* ... */)
```

### Future (Real API with Option B)
```typescript
// Service calls real API with filters
async getLongData(filters?: LLMFilters) {
  return axios.get('/api/v1/llm-responses', { params: filters })
}

// Backend returns pre-filtered data
// No client-side filtering needed
```

---

## Testing Considerations

### URL Param Testing
```typescript
// Test shareable URLs
'/dashboard?startDate=2025-01-01&endDate=2025-01-31'
'/dashboard?metrics=tokens,cost,quality'
'/dashboard?dataset=long&startDate=2025-01-01' // Option C
```

### Filter Edge Cases
- Empty date range
- Invalid date format
- Start date > end date
- No metrics selected
- Dataset not loaded yet

### Cache Invalidation
- Clear filters button
- Reset to defaults
- Navigate away and back

---

## Related Documentation

- **Architecture**: `docs/system/architecture.md` - Full system architecture
- **State Resolution**: `docs/state-resolution.md` - State management decisions
- **Roadmap**: `docs/roadmap.md` - Phase 3: Data Management includes API integration

---

## Status & Next Steps

**Current Status**: Architectural planning complete  
**Recommended Approach**: Start with Option A (Client-Side Filtering)

**Next Steps**:
1. Decide on shareability requirements (filters, dataset)
2. Install zod for search schema validation: `npm install zod`
3. Add search schema to `/dashboard` route
4. Wire date/metrics pickers to URL params
5. Implement client-side filtering in dashboard component
6. Test shareable URLs with filtered views

**Future Considerations**:
- Upgrade to Option B when adding real API backend (Phase 3)
- Consider Option C if full shareability becomes critical
- Add URL param validation and error handling
- Implement filter presets/saved views


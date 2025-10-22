# Chart Selector Feature - Optional Enhancement

## Overview
Add a dropdown selector to toggle between different chart visualizations, allowing users to explore multiple metrics from their LLM response data. This enhances the data exploration capabilities beyond just response times.

## Feature Requirements

### Chart Selector UI
- Dropdown positioned above the chart area
- Options for 4 different chart types
- Smooth transitions between charts
- Persist selection in Zustand store (optional)
- Same chart container styling as existing response time chart

### Charts to Implement

#### 1. Response Time Over Time (Existing ✅)
**Chart Type**: Line Chart  
**X-Axis**: Timestamp  
**Y-Axis**: Response Time (ms)  
**Filters**: Success responses only  
**Current Status**: Already implemented

#### 2. Token Usage Over Time
**Chart Type**: Stacked Area Chart  
**X-Axis**: Timestamp  
**Y-Axis**: Token count  
**Series**: 
- Prompt tokens (if available)
- Completion tokens (if available)
- Total tokens (fallback)
**Filters**: Success responses only  
**Color Scheme**: Blue (prompt), Green (completion), Purple (total)

#### 3. Cost Analysis Over Time
**Chart Type**: Line Chart with Area Fill  
**X-Axis**: Timestamp  
**Y-Axis**: Cost (USD)  
**Features**:
- Cumulative cost line overlay
- Individual request costs as area fill
**Filters**: All responses (show $0.00 for errors/timeouts)  
**Format**: Currency with 4 decimal places

#### 4. Status Distribution
**Chart Type**: Pie Chart or Bar Chart  
**Data**: Count of each status type
- Success (green)
- Error (red)
- Timeout (orange)
**Additional Info**: 
- Show percentage
- Display count in legend
- Filter by model (optional dropdown)

## Implementation Plan

### Phase 1: State Management & UI Structure

**File**: `src/stores/chart.store.ts` (new)

Create a simple store to track selected chart:

```typescript
import { create } from 'zustand'

type ChartType = 'response-time' | 'token-usage' | 'cost' | 'status'

interface ChartStore {
  selectedChart: ChartType
  setSelectedChart: (chart: ChartType) => void
}

export const useChartStore = create<ChartStore>((set) => ({
  selectedChart: 'response-time',
  setSelectedChart: (chart) => set({ selectedChart: chart }),
}))
```

**File**: `src/components/ui/chart-selector.component.tsx` (new)

```typescript
import { Select } from 'antd'
import { useChartStore } from '@stores/chart.store'

const chartOptions = [
  { value: 'response-time', label: 'Response Time Over Time' },
  { value: 'token-usage', label: 'Token Usage Over Time' },
  { value: 'cost', label: 'Cost Analysis' },
  { value: 'status', label: 'Status Distribution' },
]

export function ChartSelector() {
  const { selectedChart, setSelectedChart } = useChartStore()
  
  return (
    <Select
      value={selectedChart}
      onChange={setSelectedChart}
      options={chartOptions}
      style={{ width: 250 }}
    />
  )
}
```

### Phase 2: Create New Chart Components

**File**: `src/components/charts/token-usage-chart.component.tsx` (new)

```typescript
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { LLMResponse } from '@app-types/llm-response.types'

interface TokenUsageChartProps {
  data: LLMResponse[]
}

export function TokenUsageChart({ data }: TokenUsageChartProps) {
  const chartData = data
    .filter(response => response.status === 'success' && response.total_tokens)
    .map(response => ({
      timestamp: new Date(response.timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      totalTokens: response.total_tokens,
      fullTimestamp: response.timestamp,
    }))
    .sort((a, b) => new Date(a.fullTimestamp).getTime() - new Date(b.fullTimestamp).getTime())

  if (chartData.length === 0) {
    return (
      <div style={{ padding: 60, textAlign: 'center', background: '#f5f5f5', borderRadius: 8 }}>
        <p style={{ margin: 0, color: '#8c8c8c' }}>No token data available</p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            label={{ value: 'Tokens', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'white', border: '1px solid #d9d9d9', borderRadius: 4 }}
            formatter={(value: number) => [`${value.toLocaleString()} tokens`, 'Total Tokens']}
          />
          <Area 
            type="monotone" 
            dataKey="totalTokens" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
```

**File**: `src/components/charts/cost-chart.component.tsx` (new)

```typescript
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { LLMResponse } from '@app-types/llm-response.types'

interface CostChartProps {
  data: LLMResponse[]
}

export function CostChart({ data }: CostChartProps) {
  let cumulativeCost = 0
  
  const chartData = data
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(response => {
      cumulativeCost += response.cost_usd
      return {
        timestamp: new Date(response.timestamp).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        cost: response.cost_usd,
        cumulative: cumulativeCost,
        fullTimestamp: response.timestamp,
      }
    })

  if (chartData.length === 0) {
    return (
      <div style={{ padding: 60, textAlign: 'center', background: '#f5f5f5', borderRadius: 8 }}>
        <p style={{ margin: 0, color: '#8c8c8c' }}>No cost data available</p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            label={{ value: 'Cost (USD)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toFixed(4)}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'white', border: '1px solid #d9d9d9', borderRadius: 4 }}
            formatter={(value: number, name: string) => [
              name === 'cost' ? `$${value.toFixed(4)}` : `$${value.toFixed(4)}`,
              name === 'cost' ? 'Request Cost' : 'Cumulative Cost'
            ]}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="cost" 
            stroke="#82ca9d" 
            fill="#82ca9d" 
            fillOpacity={0.3}
            name="Request Cost"
          />
          <Line 
            type="monotone" 
            dataKey="cumulative" 
            stroke="#ff7300" 
            strokeWidth={2}
            dot={false}
            name="Cumulative Cost"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
```

**File**: `src/components/charts/status-chart.component.tsx` (new)

```typescript
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { LLMResponse } from '@app-types/llm-response.types'

interface StatusChartProps {
  data: LLMResponse[]
}

const STATUS_COLORS = {
  success: '#52c41a',
  error: '#ff4d4f',
  timeout: '#faad14',
}

export function StatusChart({ data }: StatusChartProps) {
  const statusCounts = data.reduce((acc, response) => {
    acc[response.status] = (acc[response.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.toUpperCase(),
    value: count,
    percentage: ((count / data.length) * 100).toFixed(1),
  }))

  if (chartData.length === 0) {
    return (
      <div style={{ padding: 60, textAlign: 'center', background: '#f5f5f5', borderRadius: 8 }}>
        <p style={{ margin: 0, color: '#8c8c8c' }}>No status data available</p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.percentage}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={STATUS_COLORS[entry.name.toLowerCase() as keyof typeof STATUS_COLORS]} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string, props: any) => [
              `${value} responses (${props.payload.percentage}%)`,
              name
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
```

### Phase 3: Dashboard Integration

**File**: `src/routes/dashboard.tsx`

Update the chart section in the "Data Loaded" state:

```typescript
import { useChartStore } from '@stores/chart.store'
import { ChartSelector } from '@components/ui/chart-selector.component'
import { ResponseTimeChart } from '@components/charts/response-time-chart.component'
import { TokenUsageChart } from '@components/charts/token-usage-chart.component'
import { CostChart } from '@components/charts/cost-chart.component'
import { StatusChart } from '@components/charts/status-chart.component'

// Inside DashboardPage component:
const { selectedChart } = useChartStore()

// Render function for charts:
const renderChart = () => {
  switch (selectedChart) {
    case 'response-time':
      return <ResponseTimeChart data={currentData} />
    case 'token-usage':
      return <TokenUsageChart data={currentData} />
    case 'cost':
      return <CostChart data={currentData} />
    case 'status':
      return <StatusChart data={currentData} />
    default:
      return <ResponseTimeChart data={currentData} />
  }
}

// Update chart section:
<div style={{ padding: 24, background: '#ffffff', borderRadius: 8, border: '1px solid #d9d9d9', marginBottom: 16 }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
    <Title level={4} style={{ marginBottom: 0 }}>Metrics Visualization</Title>
    <ChartSelector />
  </div>
  {renderChart()}
</div>
```

## Edge Cases to Handle

### Token Usage Chart
- ✅ No token data available (empty state)
- ✅ Only total_tokens field exists (no prompt/completion breakdown)
- ✅ Success responses only

### Cost Chart
- ✅ All costs are $0.00 (show message)
- ✅ Very small costs (format correctly with 4 decimals)
- ✅ Include error/timeout rows as $0.00

### Status Chart
- ✅ Only one status type (still show pie chart)
- ✅ Empty dataset (empty state)
- ✅ Calculate percentages correctly

### All Charts
- ✅ Single data point (don't break visualization)
- ✅ Empty dataset after filtering
- ✅ Out-of-order timestamps (sort before rendering)
- ✅ Dark mode compatibility
- ✅ Responsive sizing

## Testing Checklist

### Functionality Tests
- [ ] Chart selector dropdown appears above chart
- [ ] All 4 chart options selectable
- [ ] Chart changes when new option selected
- [ ] Chart state persists when switching between datasets
- [ ] Each chart handles small dataset (5 responses)
- [ ] Each chart handles large dataset (1000 responses)
- [ ] Each chart shows appropriate empty state

### Visual Tests
- [ ] All charts look good in light mode
- [ ] All charts look good in dark mode
- [ ] Chart transitions are smooth
- [ ] Selector dropdown is properly aligned
- [ ] All colors are distinguishable
- [ ] Legend displays correctly for each chart

### Data Accuracy Tests
- [ ] Response time chart matches existing implementation
- [ ] Token usage shows correct totals
- [ ] Cost chart cumulative line adds up correctly
- [ ] Status distribution percentages sum to 100%
- [ ] All timestamps sorted chronologically

## File Structure Summary

```
src/
├── stores/
│   └── chart.store.ts (new)
├── components/
│   ├── ui/
│   │   └── chart-selector.component.tsx (new)
│   └── charts/
│       ├── response-time-chart.component.tsx (existing ✅)
│       ├── token-usage-chart.component.tsx (new)
│       ├── cost-chart.component.tsx (new)
│       └── status-chart.component.tsx (new)
└── routes/
    └── dashboard.tsx (update)
```

## Estimated Effort

- **Phase 1** (State & Selector): ~15 minutes
- **Phase 2** (Chart Components): ~45 minutes
  - Token Usage Chart: ~15 minutes
  - Cost Chart: ~20 minutes
  - Status Chart: ~10 minutes
- **Phase 3** (Integration): ~15 minutes
- **Testing**: ~30 minutes

**Total**: ~2 hours

## Success Criteria

Feature complete when:
- ✅ Chart store created and working
- ✅ Chart selector dropdown implemented
- ✅ All 4 chart components created
- ✅ Dashboard integration complete
- ✅ All charts handle edge cases gracefully
- ✅ Empty states display correctly
- ✅ Dark mode works for all charts
- ✅ No TypeScript errors
- ✅ No console errors
- ✅ Smooth user experience switching between charts

## Notes

- This is an **optional enhancement** - MVP is complete without it
- Demonstrates additional charting capabilities
- Shows pattern for extensibility (easy to add more charts)
- Recharts library already in use, so no new dependencies
- Could add more advanced features later:
  - Model comparison charts
  - Time range filters
  - Export chart as image
  - Chart configuration options


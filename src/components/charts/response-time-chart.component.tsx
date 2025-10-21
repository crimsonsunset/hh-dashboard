import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { LLMResponse } from '@app-types/llm-response.types'

interface ResponseTimeChartProps {
  data: LLMResponse[]
}

/**
 * Line chart displaying LLM response times over time
 * Filters out error/timeout responses and shows only successful completions
 */
export function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  // Filter out errors/timeouts and prepare chart data
  const chartData = data
    .filter(response => response.status === 'success' && response.response_time_ms)
    .map(response => ({
      timestamp: new Date(response.timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      responseTime: response.response_time_ms,
      fullTimestamp: response.timestamp,
    }))
    .sort((a, b) => new Date(a.fullTimestamp).getTime() - new Date(b.fullTimestamp).getTime())

  // Handle empty data case
  if (chartData.length === 0) {
    return (
      <div style={{ 
        padding: 60, 
        textAlign: 'center', 
        background: '#f5f5f5',
        borderRadius: 8 
      }}>
        <p style={{ margin: 0, color: '#8c8c8c' }}>
          No successful responses to display
        </p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #d9d9d9',
              borderRadius: 4 
            }}
            formatter={(value: number) => [`${value} ms`, 'Response Time']}
          />
          <Line 
            type="monotone" 
            dataKey="responseTime" 
            stroke="#1890ff" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


import { Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { LLMResponse } from '@app-types/llm-response.types'

interface ResponseTableProps {
  data: LLMResponse[]
}

/**
 * Virtual scrolling table displaying LLM response data
 * Handles 1000+ rows efficiently with Ant Design's virtual prop
 */
export function ResponseTable({ data }: ResponseTableProps) {
  const columns: ColumnsType<LLMResponse> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => id.substring(0, 12) + '...',
      ellipsis: true,
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: string) => 
        new Date(timestamp).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
      sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      width: 140,
      filters: [
        { text: 'GPT-4', value: 'gpt-4' },
        { text: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
        { text: 'Claude-3', value: 'claude-3' },
      ],
      onFilter: (value, record) => record.model === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colorMap = {
          success: 'green',
          error: 'red',
          timeout: 'orange',
        }
        return <Tag color={colorMap[status as keyof typeof colorMap]}>{status.toUpperCase()}</Tag>
      },
      filters: [
        { text: 'Success', value: 'success' },
        { text: 'Error', value: 'error' },
        { text: 'Timeout', value: 'timeout' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Response Time',
      dataIndex: 'response_time_ms',
      key: 'response_time_ms',
      width: 140,
      render: (time: number | null) => time ? `${time} ms` : '-',
      sorter: (a, b) => (a.response_time_ms || 0) - (b.response_time_ms || 0),
    },
    {
      title: 'Total Tokens',
      dataIndex: 'total_tokens',
      key: 'total_tokens',
      width: 120,
      render: (tokens: number | null) => tokens ?? '-',
      sorter: (a, b) => (a.total_tokens || 0) - (b.total_tokens || 0),
    },
    {
      title: 'Cost (USD)',
      dataIndex: 'cost_usd',
      key: 'cost_usd',
      width: 120,
      render: (cost: number) => `$${cost.toFixed(4)}`,
      sorter: (a, b) => a.cost_usd - b.cost_usd,
    },
    {
      title: 'Output',
      dataIndex: 'output',
      key: 'output',
      ellipsis: true,
      render: (output: string | null) => {
        if (!output) return <span style={{ color: '#8c8c8c' }}>N/A</span>
        if (output.length > 100) {
          return output.substring(0, 100) + '...'
        }
        return output
      },
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      virtual
      scroll={{ y: 600 }}
      pagination={false}
      size="small"
      bordered={false}
    />
  )
}


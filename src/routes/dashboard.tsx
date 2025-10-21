import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@components/layout/dashboard-layout.component'
import { Button, Typography, Space, Spin, Alert } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { useDataStore } from '@stores/data.store'
import { useShortLLMData, useLongLLMData } from '@hooks/use-llm-data.hook'
import { ResponseTimeChart } from '@components/charts/response-time-chart.component'

const { Title, Paragraph } = Typography

/**
 * Main data explorer page
 * Implements data loading interface with React Query + Zustand pattern
 */
function DashboardPage() {
  const { activeDataset, setActiveDataset, clearDataset } = useDataStore()
  
  // Only fetch when dataset is selected (enabled flag prevents unnecessary requests)
  const shortQuery = useShortLLMData({ enabled: activeDataset === 'short' })
  const longQuery = useLongLLMData({ enabled: activeDataset === 'long' })
  
  // Determine current data and query state
  const currentQuery = activeDataset === 'short' ? shortQuery : longQuery
  const currentData = currentQuery.data?.responses || null
  const isLoading = currentQuery.isLoading
  const isError = currentQuery.isError
  
  // Handlers
  const handleLoadSmall = () => setActiveDataset('short')
  const handleLoadLarge = () => setActiveDataset('long')
  const handleReset = () => clearDataset()
  
  // No Data State - Initial view before any dataset is loaded
  if (!activeDataset) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Title level={2}>LLM Data Explorer</Title>
        <Paragraph style={{ fontSize: 16, marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
          Load a dataset to begin exploring LLM response patterns and performance metrics
        </Paragraph>
        <Space size="large">
          <Button 
            type="primary" 
            size="large"
            onClick={handleLoadSmall}
            style={{ height: 'auto', padding: '16px 32px' }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Load Small Dataset</div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>~5 responses</div>
            </div>
          </Button>
          <Button 
            type="primary" 
            size="large"
            onClick={handleLoadLarge}
            style={{ height: 'auto', padding: '16px 32px' }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Load Large Dataset</div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>~1000 responses</div>
            </div>
          </Button>
        </Space>
      </div>
    )
  }
  
  // Loading State - Shown while React Query is fetching data
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
        <Paragraph style={{ marginTop: 16, fontSize: 16 }}>
          Loading {activeDataset === 'short' ? 'small' : 'large'} dataset...
        </Paragraph>
      </div>
    )
  }
  
  // Error State - Shown if React Query encounters an error
  if (isError) {
    return (
      <div style={{ padding: 60, maxWidth: 600, margin: '0 auto' }}>
        <Alert
          message="Error Loading Data"
          description="Failed to load the dataset. Please try again or select a different dataset."
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={handleReset}>
              Try Again
            </Button>
          }
        />
      </div>
    )
  }
  
  // Data Loaded State - Main view when data is successfully loaded
  if (currentData) {
    return (
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 24 
        }}>
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>Data Explorer</Title>
            <Paragraph style={{ marginBottom: 0, fontSize: 14 }}>
              Loaded <strong>{currentData.length}</strong> responses from <strong>{activeDataset === 'short' ? 'small' : 'large'}</strong> dataset
            </Paragraph>
          </div>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleReset}
            size="large"
          >
            Reset & Load Different Dataset
          </Button>
        </div>
        
        {/* Response Time Chart */}
        <div style={{
          padding: 24,
          background: '#ffffff',
          borderRadius: 8,
          border: '1px solid #d9d9d9',
          marginBottom: 16
        }}>
          <Title level={4} style={{ marginBottom: 16 }}>Response Time Over Time</Title>
          <ResponseTimeChart data={currentData} />
        </div>
        
        {/* Table component placeholder - Phase 4 */}
        <div style={{ 
          padding: 60, 
          textAlign: 'center', 
          background: '#f5f5f5',
          borderRadius: 8,
          border: '2px dashed #d9d9d9',
          marginTop: 16 
        }}>
          <Paragraph style={{ marginBottom: 0, fontSize: 16, color: '#8c8c8c' }}>
            📋 Table component placeholder (Phase 4)
          </Paragraph>
        </div>
      </div>
    )
  }
  
  // Fallback (should never reach here, but TypeScript safety)
  return null
}

/**
 * Dashboard page with layout wrapper
 */
function DashboardWithLayout() {
  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardWithLayout,
})

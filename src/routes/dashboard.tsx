import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@components/layout/dashboard-layout.component'
import { Typography } from 'antd'

const { Title } = Typography

/**
 * Main data explorer page - ready for take-home assignment implementation
 * 
 * TODO: Implement data explorer features:
 * - File upload component
 * - Data parsing and validation
 * - Data visualization (charts)
 * - Data table view
 */
function DashboardPage() {
  return (
    <div>
      <Title level={2}>Data Explorer</Title>
      {/* Implementation goes here */}
    </div>
  )
}

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



import { useState } from 'react'
import { Layout, Menu, Button, DatePicker, Select, Avatar } from 'antd'
import { 
  DashboardOutlined, 
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BulbOutlined,
  UserOutlined,
  ProjectOutlined
} from '@ant-design/icons'
import { Link, useLocation } from '@tanstack/react-router'
import { useAppStore } from '@stores/app.store'
import { GenericModal } from '@components/ui/generic-modal.component'
import logoLight from '@assets/logo.png'
import logoDark from '@assets/logo2.png'

const { Header, Sider, Content } = Layout
const { RangePicker } = DatePicker

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarCollapsed, setSidebarCollapsed, theme, setTheme } = useAppStore()
  const location = useLocation()
  const [modalOpen, setModalOpen] = useState(false)

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Data Explorer</Link>,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={sidebarCollapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{ 
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: 8
        }}>
          <img 
            src={theme === 'dark' ? logoDark : logoLight} 
            alt="Logo" 
            style={{ 
              height: 32,
              width: 32,
              objectFit: 'contain'
            }}
          />
          {!sidebarCollapsed && (
            <span style={{ 
              color: 'white',
              fontSize: 14,
              fontWeight: 600
            }}>
              LLM Usage Dashboard
            </span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
        
        <div style={{ padding: sidebarCollapsed ? 8 : 16 }}>
          <Button
            type="default"
            icon={<ProjectOutlined />}
            onClick={() => setModalOpen(true)}
            block={!sidebarCollapsed}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
            }}
          >
            {!sidebarCollapsed && "What's Next?"}
          </Button>
        </div>
      </Sider>
      
      <GenericModal open={modalOpen} onClose={() => setModalOpen(false)} />
      
      <Layout style={{ marginLeft: sidebarCollapsed ? 80 : 200 }}>
        <Header style={{ 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <RangePicker 
              placeholder={['Start Date', 'End Date']}
              style={{ width: 240 }}
            />
            
            <Select
              mode="multiple"
              placeholder="Select metrics"
              style={{ width: 200 }}
              options={[
                { label: 'Revenue', value: 'revenue' },
                { label: 'Users', value: 'users' },
                { label: 'Conversions', value: 'conversions' },
                { label: 'Page Views', value: 'pageViews' },
              ]}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={<BulbOutlined />}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              style={{ 
                fontSize: 16,
                color: theme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'inherit'
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar size="small" icon={<UserOutlined />} />
              <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Joe Sangiorgio</span>
            </div>
          </div>
        </Header>
        
        <Content style={{ 
          margin: 24,
          padding: 24,
          minHeight: 280,
          overflow: 'auto'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
} 

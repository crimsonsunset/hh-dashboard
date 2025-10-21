import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ConfigProvider, theme } from 'antd'
import { useAppStore } from '@stores/app.store'
import { themeConfig } from '@config/theme.config'

function RootComponent() {
  const appTheme = useAppStore((state) => state.theme)

  const finalThemeConfig = {
    ...themeConfig,
    algorithm: appTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  }

  return (
    <ConfigProvider theme={finalThemeConfig}>
      <Outlet />
      <TanStackRouterDevtools />
    </ConfigProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
}) 
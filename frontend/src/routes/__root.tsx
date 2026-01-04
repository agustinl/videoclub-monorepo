import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isSearch = location.pathname === '/search' || location.pathname === '/search/'
  const isDetail = location.pathname.startsWith('/serie/')
  const isLogin = location.pathname === '/login' || location.pathname === '/login/'

  return (
    <>
      <Header
        showBack={isDetail || isSearch}
        showAddButton={isHome}
        showLoginButton={!isLogin}
      />
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}

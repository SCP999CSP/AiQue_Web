import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Header } from '@/components/Common/Header'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { authStore } from '@/lib/auth-store'

// 定义 RouterContext 类型
export interface RouterContext {
  auth: {
    isSignedIn: boolean
    isLoaded: boolean
  }
}

export const Route = createRootRoute({
  // 定义 context 类型
  context: (): RouterContext => ({
    auth: {
      isSignedIn: authStore.getState().isSignedIn,
      isLoaded: authStore.getState().isLoaded,
    },
  }),
  component: RootComponent,
})

function RootComponent() {
  const { isSignedIn, isLoaded } = useAuth()

  // 订阅 Clerk 认证状态变化，更新到 authStore
  useEffect(() => {
    authStore.updateState({ isSignedIn, isLoaded })
  }, [isSignedIn, isLoaded])

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  )
}


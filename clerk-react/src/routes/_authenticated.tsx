import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuth } from '@clerk/clerk-react'
import { authStore } from '@/lib/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const auth = authStore.getState()
    
    // 如果状态未加载完成，直接返回，让组件层处理加载状态
    if (!auth.isLoaded) {
      return
    }
    
    // 如果已加载但未登录，重定向到登录页
    if (!auth.isSignedIn) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { isLoaded } = useAuth()

  // 如果还在加载中，显示加载状态
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
  }

  // 已登录，显示受保护的内容（认证检查已在 beforeLoad 中完成）
  return <Outlet />
}


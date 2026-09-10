import { createFileRoute, redirect, useSearch } from '@tanstack/react-router'
import { useAuth } from '@clerk/clerk-react'
import { useState } from 'react'
import { SignInModal } from '@/components/Common/SignInModal'
import { authStore } from '@/lib/auth-store'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || '/',
    }
  },
  beforeLoad: async ({ search }) => {
    const auth = authStore.getState()
    
    // 如果状态未加载完成，直接返回，让组件层处理加载状态
    if (!auth.isLoaded) {
      return
    }
    
    // 如果已登录，重定向到目标页面或首页
    if (auth.isSignedIn) {
      throw redirect({
        to: (search.redirect as string) || '/',
      })
    }
  },
  component: Login,
})

function Login() {
  const { redirect: redirectPath } = useSearch({ from: '/login' })
  const { isLoaded } = useAuth()
  const [showSignIn, setShowSignIn] = useState(true)

  // 如果还在加载中，显示加载状态
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">请先登入</h2>
        <p className="text-muted-foreground">您需要登录后才能访问该页面</p>
      </div>
      <SignInModal open={showSignIn} onOpenChange={setShowSignIn} afterSignInUrl={redirectPath} />
    </div>
  )
}


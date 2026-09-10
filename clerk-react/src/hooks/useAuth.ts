import { authStore } from '@/lib/auth-store'

/**
 * 检查用户是否已登录
 * 用于路由层的 beforeLoad 中
 */
export function isLoggedIn(): boolean {
  const auth = authStore.getState()
  return auth.isLoaded && auth.isSignedIn
}



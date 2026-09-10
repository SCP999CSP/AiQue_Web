/**
 * 认证状态存储
 * 用于在路由层（beforeLoad）访问 Clerk 认证状态
 * 状态由组件层（使用 useAuth）更新
 */
type AuthState = {
  isSignedIn: boolean
  isLoaded: boolean
}

let authState: AuthState = {
  isSignedIn: false,
  isLoaded: false,
}

export const authStore = {
  getState: (): AuthState => authState,
  
  setState: (state: AuthState) => {
    authState = state
  },
  
  updateState: (updates: Partial<AuthState>) => {
    authState = { ...authState, ...updates }
  },
}



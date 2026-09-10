import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ThemeProvider } from './components/Common/ThemeProvider'
import { queryClient } from './lib/query-client'
import { client } from './client/client.gen'  // 正确的导入

// 导入路由
import { routeTree } from './routeTree.gen'
import type { InternalAxiosRequestConfig } from 'axios'

// 配置 API 客户端
const apiBaseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

// 设置 baseURL（相当于 OpenAPI.BASE）
client.setConfig({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 创建一个组件来配置认证拦截器（需要在 ClerkProvider 内部）
function AuthInterceptor() {
  const { getToken, isSignedIn, isLoaded } = useAuth()
  
  // 使用 useEffect 确保拦截器只注册一次
  useEffect(() => {
    // 配置请求拦截器以添加认证 token
    const interceptorId = client.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig<any>) => {
        // 只有在用户已登录时才尝试获取 token
        if (isLoaded && isSignedIn) {
          try {
            const token = await getToken()
            if (token) {
              config.headers.Authorization = `Bearer ${token}`
              console.log('Token added to request:', config.url)
            } else {
              console.warn('No token available for request:', config.url)
            }
          } catch (error) {
            console.error('Failed to get token:', error)
          }
        } else {
          console.warn('User not signed in, skipping token for:', config.url)
        }
        return config
      }
    )
    
    // 清理函数：组件卸载时移除拦截器
    return () => {
      client.instance.interceptors.request.eject(interceptorId)
    }
  }, [getToken, isSignedIn, isLoaded])
  
  return null
}

// 创建路由
const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthInterceptor />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider 
          defaultTheme="system" 
          enableSystem
          attribute="class"
          disableTransitionOnChange={false}
        >
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>,
)
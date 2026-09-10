import { useQuery } from '@tanstack/react-query'
import type { User } from '@/lib/types'

// 模拟 API 调用 - 在实际项目中，这应该是一个真实的 API 端点
async function fetchUsers(): Promise<User[]> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 返回模拟数据
  return [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
    { id: 3, name: '王五', email: 'wangwu@example.com' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com' },
    { id: 5, name: '钱七', email: 'qianqi@example.com' },
  ]
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}





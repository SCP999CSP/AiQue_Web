import { createFileRoute } from '@tanstack/react-router'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { UsersTable } from '@/components/Users/UsersTable'
import { useUsers } from '@/hooks/useUsers'

export const Route = createFileRoute('/_authenticated/users')({
  component: Users,
})

function Users() {
  const { data: users, isLoading, error } = useUsers()

  if (isLoading) {
    return <div className="text-center py-8">加载中...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        错误: {error instanceof Error ? error.message : '未知错误'}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <SignedOut>
        <div className="text-center py-8">请先登录</div>
      </SignedOut>
      <SignedIn>
        <h1 className="text-4xl font-bold">用户列表</h1>
        <p className="text-muted-foreground">
          使用 TanStack Query 和 TanStack Table 展示用户数据
        </p>
        {users && <UsersTable data={users} />}
      </SignedIn> 
    </div>
  )
}


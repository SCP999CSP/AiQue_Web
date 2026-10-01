import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold">欢迎使用20261001-1</h1>
      <p className="text-muted-foreground">
        这是一个集成了以下工具的 React 应用：
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>TanStack Router - 客户端路由</li>
        <li>TanStack Query - 服务端状态管理</li>
        <li>TanStack Table - 表格组件</li>
        <li>shadcn/ui + Radix UI - UI 组件</li>
        <li>Tailwind CSS v4 - 样式框架</li>
        <li>React Hook Form + Zod - 表单验证</li>
        <li>next-themes - 主题切换</li>
      </ul>
    </div>
  )
}





import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold">关于页面</h1>
      <p className="text-muted-foreground">
        这是一个使用 TanStack Router 创建的示例页面。
      </p>
    </div>
  )
}




import { createFileRoute } from '@tanstack/react-router'
import { ExampleForm } from '@/components/Forms/ExampleForm'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

export const Route = createFileRoute('/_authenticated/form')({
  component: FormPage,
})

function FormPage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <SignedOut>
        <div className="text-center py-8">请先登录</div>
      </SignedOut>
      <SignedIn>
      <h1 className="text-4xl font-bold">表单示例</h1>
      <p className="text-muted-foreground">
        使用 React Hook Form 和 Zod 进行表单验证
      </p>
      <ExampleForm />
      </SignedIn>
    </div>
  )
}


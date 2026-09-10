import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "用户名至少需要 2 个字符",
  }),
  email: z.string().email({
    message: "请输入有效的邮箱地址",
  }),
  age: z.number().min(18, {
    message: "年龄必须大于等于 18",
  }).optional(),
})

type FormValues = z.infer<typeof formSchema>

export function ExampleForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      age: undefined,
    },
  })

  function onSubmit(values: FormValues) {
    console.log(values)
    alert(`表单提交成功！\n用户名: ${values.username}\n邮箱: ${values.email}\n年龄: ${values.age || '未填写'}`)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 border rounded-lg">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          用户名
        </label>
        <input
          id="username"
          {...form.register("username")}
          className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="请输入用户名"
        />
        {form.formState.errors.username && (
          <p className="text-sm text-destructive">
            {form.formState.errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          邮箱
        </label>
        <input
          id="email"
          type="email"
          {...form.register("email")}
          className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="请输入邮箱地址"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="age" className="text-sm font-medium">
          年龄（可选）
        </label>
        <input
          id="age"
          type="number"
          {...form.register("age", { valueAsNumber: true })}
          className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="请输入年龄"
        />
        {form.formState.errors.age && (
          <p className="text-sm text-destructive">
            {form.formState.errors.age.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        提交
      </Button>
    </form>
  )
}





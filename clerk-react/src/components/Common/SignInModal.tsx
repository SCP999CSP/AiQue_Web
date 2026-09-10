import { SignIn } from '@clerk/clerk-react'
import { Dialog, DialogPortal } from '@/components/ui/dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface SignInModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  afterSignInUrl?: string
}

export function SignInModal({ open, onOpenChange, afterSignInUrl }: SignInModalProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 动态隐藏 "Secured by" 和 "Development mode" 元素，但保留 Sign up 链接
  useEffect(() => {
    if (!mounted || !open) return

    const hideElements = () => {
      const wrapper = document.querySelector('.clerk-sign-in-wrapper')
      if (!wrapper) return

      // 遍历所有元素，查找并隐藏包含特定文字的元素
      const allElements = wrapper.querySelectorAll('*')
      allElements.forEach((el) => {
        const text = el.textContent || ''
        const className = el.getAttribute('class') || ''
        const ariaLabel = el.getAttribute('aria-label') || ''
        const title = el.getAttribute('title') || ''
        
        // 检查是否包含 "Secured by" 或 "Development mode"
        const shouldHide = 
          text.includes('Secured by') ||
          text.includes('Development mode') ||
          text.includes('Development Mode') ||
          className.includes('cl-poweredBy') ||
          className.includes('cl-securedBy') ||
          className.includes('cl-devMode') ||
          className.includes('cl-developmentMode') ||
          ariaLabel.includes('Secured') ||
          ariaLabel.includes('Development') ||
          title.includes('Secured') ||
          title.includes('Development')

        // 确保不隐藏 Sign up 相关的元素
        const isSignUp = 
          text.includes('Sign up') ||
          text.includes('Sign Up') ||
          className.includes('sign-up') ||
          className.includes('signUp') ||
          el.getAttribute('href')?.includes('sign-up') ||
          el.getAttribute('href')?.includes('signup')

        if (shouldHide && !isSignUp) {
          ;(el as HTMLElement).style.display = 'none'
        }
      })
    }

    // 初始隐藏
    const timer = setTimeout(hideElements, 100)

    // 监听 DOM 变化
    const observer = new MutationObserver(hideElements)
    if (open) {
      const wrapper = document.querySelector('.clerk-sign-in-wrapper')
      if (wrapper) {
        observer.observe(wrapper, {
          childList: true,
          subtree: true,
          characterData: true,
        })
      }
    }

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [mounted, open])

  // 根据当前主题设置 Clerk 的主题变量
  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        {/* 不显示遮罩层，背景保持原样 */}
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full max-w-[500px] translate-x-[-50%] translate-y-[-50%] border-0 bg-transparent p-0 shadow-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          )}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="clerk-sign-in-wrapper">
            <SignIn 
              routing="hash"
              afterSignInUrl={afterSignInUrl}
              appearance={{
                variables: {
                  colorBackground: isDark ? 'oklch(40% 0 0)' : 'oklch(100% 0 0)',
                  colorText: isDark ? 'oklch(98% 0 0)' : 'oklch(9% 0 0)',
                  colorInputBackground: isDark ? 'oklch(27% 0 0)' : 'oklch(90% 0 0)',
                  colorInputText: isDark ? 'oklch(98% 0 0)' : 'oklch(9% 0 0)',
                  colorPrimary: isDark ? 'oklch(70% 0.2 250)' : 'oklch(47% 0.2 250)',
                  colorTextSecondary: isDark ? 'oklch(95% 0 0)' : 'oklch(45% 0 0)',
                  colorDanger: isDark ? 'oklch(62% 0.2 25)' : 'oklch(62% 0.2 25)',
                  borderRadius: '0.5rem',
                },
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-lg border"
                }
              }}
            />
          </div>
          <style>{`
            /* 使用 CSS 隐藏已知的类名 */
            .clerk-sign-in-wrapper [class*="cl-poweredBy"],
            .clerk-sign-in-wrapper [class*="cl-poweredByClerk"],
            .clerk-sign-in-wrapper [class*="cl-securedBy"],
            .clerk-sign-in-wrapper [class*="cl-secured"],
            .clerk-sign-in-wrapper [class*="poweredBy"],
            .clerk-sign-in-wrapper [class*="securedBy"],
            .clerk-sign-in-wrapper [class*="secured-by"],
            .clerk-sign-in-wrapper [class*="cl-devMode"],
            .clerk-sign-in-wrapper [class*="cl-developmentMode"],
            .clerk-sign-in-wrapper [class*="cl-development"],
            .clerk-sign-in-wrapper [class*="dev-mode"],
            .clerk-sign-in-wrapper [class*="development-mode"],
            .clerk-sign-in-wrapper [class*="cl-dev"],
            .clerk-sign-in-wrapper [data-testid*="dev"],
            .clerk-sign-in-wrapper [data-testid*="development"] {
              display: none !important;
            }
          `}</style>
          <DialogPrimitive.Close className="absolute right-16 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

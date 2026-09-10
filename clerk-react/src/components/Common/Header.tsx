import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { Navigation } from './Navigation'
import { SignInModal } from './SignInModal'
import { Button } from '@/components/ui/button'

export function Header() {
  const [showSignIn, setShowSignIn] = useState(false)

  return (
    <>
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Navigation />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <SignedOut>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setShowSignIn(true)}
              >
                登录
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>
      <SignInModal open={showSignIn} onOpenChange={setShowSignIn} />
    </>
  )
}

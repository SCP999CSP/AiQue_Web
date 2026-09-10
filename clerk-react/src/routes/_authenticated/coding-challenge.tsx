import { createFileRoute } from '@tanstack/react-router'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { CodingChallengeGenerator } from '@/components/CodingChallenge/CodingChallengeGenerator'

export const Route = createFileRoute('/_authenticated/coding-challenge')({
  component: CodingChallengePage,
})

function CodingChallengePage() {
  return (
    <div className="space-y-4">
      <SignedOut>
        <div className="text-center py-8">请先登录</div>
      </SignedOut>
      <SignedIn>
        <h1 className="text-4xl font-bold">Coding Challenge Generater</h1>
        <p className="text-muted-foreground">
          生成编程挑战题目，提升你的编程技能
        </p>
        <CodingChallengeGenerator />
      </SignedIn>
    </div>
  )
}



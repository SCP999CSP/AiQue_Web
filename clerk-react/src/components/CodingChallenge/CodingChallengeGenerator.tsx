import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuota } from '@/hooks/useQuota'
import { useCreateQuestion, useQuestionsList } from '@/hooks/useQuestions'
import type { QuestionDifficulty } from '@/client'
import { QuestionQuiz } from './QuestionQuiz'

// 格式化日期时间
function formatDateTime(dateString?: string): string {
  if (!dateString) return '未知时间'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '未知时间'
  }
}

// 难度中文映射
function getDifficultyLabel(difficulty?: QuestionDifficulty): string {
  switch (difficulty) {
    case 'easy':
      return '简单'
    case 'medium':
      return '中等'
    case 'hard':
      return '困难'
    default:
      return '未知'
  }
}

export function CodingChallengeGenerator() {
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | ''>('')
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  
  // 使用 hooks 获取数据
  const { data: quota, isLoading: isLoadingQuota } = useQuota()
  const { data: questionsList, isLoading: isLoadingQuestions } = useQuestionsList()
  const createQuestion = useCreateQuestion()

  const remainingQuota = quota?.remaining_quota ?? 0
  const questions = questionsList ?? []

  const handleGenerate = () => {
    if (!difficulty) {
      alert('请先选择难度')
      return
    }

    if (remainingQuota <= 0) {
      alert('剩余次数不足，无法生成题目')
      return
    }

    createQuestion.mutate(difficulty as QuestionDifficulty, {
      onError: (error) => {
        alert(`生成题目失败: ${error.message}`)
      },
    })
  }

  const isLoading = isLoadingQuota || isLoadingQuestions || createQuestion.isPending
  const isButtonDisabled = !difficulty || isLoading || remainingQuota <= 0

  // 如果选中了题目，显示答题页面
  if (selectedQuestionId) {
    return (
      <QuestionQuiz 
        questionId={selectedQuestionId} 
        onClose={() => setSelectedQuestionId(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="p-6 border rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">生成设置</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">配置题目剩余次数</p>
            {isLoadingQuota ? (
              <p className="text-2xl font-bold text-primary">加载中...</p>
            ) : (
              <p className="text-2xl font-bold text-primary">{remainingQuota}</p>
            )}
          </div>
        </div>

        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <label htmlFor="difficulty" className="text-sm font-medium">
            </label>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as QuestionDifficulty)}>
              <SelectTrigger id="difficulty" className="w-full">
                <SelectValue placeholder="请选择难度" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm min-w-[200px] w-[var(--radix-select-trigger-width)]">
                <SelectItem value="easy">简单</SelectItem>
                <SelectItem value="medium">中等</SelectItem>
                <SelectItem value="hard">困难</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleGenerate} 
            className="h-10"
            disabled={isButtonDisabled}
          >
            {createQuestion.isPending ? '生成中...' : '生成题目'}
          </Button>
        </div>
      </div>

      {/* 题目列表表格 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">已生成的题目</h2>
        {isLoadingQuestions ? (
          <div className="p-8 text-center border rounded-lg">
            <p className="text-muted-foreground">加载中...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center border rounded-lg">
            <p className="text-muted-foreground">暂无题目，点击上方按钮生成题目</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    ID
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    难度
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    描述
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    生成时间
                  </th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr
                    key={question.id}
                    onClick={() => setSelectedQuestionId(question.id)}
                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                  >
                    <td className="p-4 align-middle">
                      <span className="text-sm font-mono text-muted-foreground">
                        {question.id.substring(0, 8)}...
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          question.difficulty === 'easy'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : question.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {getDifficultyLabel(question.difficulty)}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {question.question_description || '暂无描述'}
                    </td>
                    <td className="p-4 align-middle text-sm text-muted-foreground">
                      {formatDateTime(question.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* 错误提示 */}
      {createQuestion.isError && (
        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            生成题目失败: {createQuestion.error?.message || '未知错误'}
          </p>
        </div>
      )}
    </div>
  )
}


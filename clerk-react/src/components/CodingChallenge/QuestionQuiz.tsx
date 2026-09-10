import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useQuestion } from '@/hooks/useQuestions'

interface QuestionQuizProps {
  questionId: string
  onClose: () => void
}

export function QuestionQuiz({ questionId, onClose }: QuestionQuizProps) {
  const { data: question, isLoading, error } = useQuestion(questionId)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleSubmit = () => {
    if (selectedOption === null || !question) return
    
    const correct = selectedOption === question.correct_option_index
    setIsCorrect(correct)
    setIsSubmitted(true)
  }

  const handleReset = () => {
    setSelectedOption(null)
    setIsSubmitted(false)
    setIsCorrect(null)
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center border rounded-lg">
        <p className="text-muted-foreground">加载题目中...</p>
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="p-8 text-center border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-800 dark:text-red-200">
          加载题目失败: {error?.message || '未知错误'}
        </p>
        <Button onClick={onClose} className="mt-4">
          返回
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">答题</h2>
        <Button variant="outline" onClick={onClose}>
          返回列表
        </Button>
      </div>

      <div className="p-6 border rounded-lg space-y-6">
        {/* 题目内容 */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">题目</h3>
          <div className="p-4 bg-muted/50 rounded-md">
            <p className="whitespace-pre-wrap">{question.question_content}</p>
          </div>
        </div>

        {/* 选项 */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">请选择答案</h3>
          <div className="space-y-2">
            {question.options.map((option) => {
              const isSelected = selectedOption === option.option_index
              const isCorrectOption = option.option_index === question.correct_option_index
              let optionStyle = ''
              
              if (isSubmitted) {
                if (isCorrectOption) {
                  optionStyle = 'bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500'
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = 'bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-500'
                }
              } else if (isSelected) {
                optionStyle = 'bg-primary/10 border-primary'
              }

              return (
                <button
                  key={option.option_index}
                  onClick={() => !isSubmitted && setSelectedOption(option.option_index)}
                  disabled={isSubmitted}
                  className={`w-full p-4 text-left border rounded-md transition-colors ${
                    isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-muted/50'
                  } ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
                    }`}>
                      {isSelected && '✓'}
                    </div>
                    <span className="font-medium">{String.fromCharCode(65 + option.option_index)}.</span>
                    <span>{option.option_text}</span>
                    {isSubmitted && isCorrectOption && (
                      <span className="ml-auto text-green-600 dark:text-green-400 font-medium">
                        ✓ 正确答案
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 提交按钮和结果 */}
        <div className="space-y-4">
          {!isSubmitted ? (
            <Button 
              onClick={handleSubmit} 
              disabled={selectedOption === null}
              className="w-full"
            >
              提交答案
            </Button>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-md ${
                isCorrect 
                  ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}>
                <p className={`font-medium ${
                  isCorrect 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {isCorrect ? '🎉 回答正确！' : '❌ 回答错误'}
                </p>
                {!isCorrect && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    正确答案是选项 {String.fromCharCode(65 + question.correct_option_index)}
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {question.explanation}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  重新答题
                </Button>
                <Button onClick={onClose} className="flex-1">
                  返回列表
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



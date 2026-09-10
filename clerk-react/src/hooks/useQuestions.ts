import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QuestionsService } from '@/client'
import type { QuestionDifficulty, QuestionPublic, QuestionList } from '@/client'
import { useAuth } from '@clerk/clerk-react'

/**
 * 获取题目列表
 * 注意：后端实际返回 QuestionList[] 数组，但生成的类型定义可能是单个对象
 */
export function useQuestionsList() {
  const { isSignedIn, isLoaded } = useAuth()
  
  return useQuery<QuestionList[]>({
    queryKey: ['questions', 'list'],
    queryFn: async (): Promise<QuestionList[]> => {
      const response = await QuestionsService.readQuestionslist()
      if ('error' in response && response.error) {
        throw new Error('Failed to fetch questions list')
      }
      // 后端实际返回数组，使用类型断言
      return (response.data as unknown) as QuestionList[]
    },
    enabled: isLoaded && isSignedIn, // 只有在用户登录时才启用查询
  })
}

/**
 * 获取单个题目详情
 * @param questionId - 题目ID
 * @param enabled - 是否启用查询（当questionId存在时）
 */
export function useQuestion(questionId: string | undefined, enabled = true) {
  const { isSignedIn, isLoaded } = useAuth()
  
  return useQuery<QuestionPublic>({
    queryKey: ['questions', questionId],
    queryFn: async (): Promise<QuestionPublic> => {
      if (!questionId) {
        throw new Error('questionId is required')
      }
      const response = await QuestionsService.readQuestion({
        path: { question_id: questionId },
      })
      if ('error' in response && response.error) {
        throw new Error('Failed to fetch question')
      }
      if (!response.data) {
        throw new Error('No data returned from question service')
      }
      return response.data as QuestionPublic
    },
    enabled: enabled && !!questionId && isLoaded && isSignedIn, // 添加认证检查
  })
}

/**
 * 创建题目
 */
export function useCreateQuestion() {
  const queryClient = useQueryClient()

  return useMutation<QuestionPublic, Error, QuestionDifficulty>({
    mutationFn: async (difficulty): Promise<QuestionPublic> => {
      const response = await QuestionsService.createQuestion({
        query: { difficulty },
      })
      if ('error' in response && response.error) {
        throw new Error('Failed to create question')
      }
      if (!response.data) {
        throw new Error('No data returned from create question')
      }
      return response.data as QuestionPublic
    },
    onSuccess: () => {
      // 创建成功后，刷新题目列表和配额
      queryClient.invalidateQueries({ queryKey: ['questions', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['quota'] })
    },
  })
}


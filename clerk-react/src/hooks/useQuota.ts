import { useQuery } from '@tanstack/react-query'
import { QuotaService } from '@/client'
import type { ChallengeQuotaPublic } from '@/client'
import { useAuth } from '@clerk/clerk-react'

/**
 * 获取用户配额信息
 */
export function useQuota() {
  const { isSignedIn, isLoaded } = useAuth()
  
  return useQuery<ChallengeQuotaPublic>({
    queryKey: ['quota'],
    queryFn: async (): Promise<ChallengeQuotaPublic> => {
      const response = await QuotaService.readQuota()
      if ('error' in response && response.error) {
        throw new Error('Failed to fetch quota')
      }
      if (!response.data) {
        throw new Error('No data returned from quota service')
      }
      return response.data as ChallengeQuotaPublic
    },
    enabled: isLoaded && isSignedIn, // 只有在用户登录时才启用查询
  })
}


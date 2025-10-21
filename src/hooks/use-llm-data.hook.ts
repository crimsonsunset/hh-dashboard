import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { llmService } from '@services/llm.service'
import type { LLMResponseData } from '@app-types/llm-response.types'

/**
 * Hook to fetch short LLM dataset (small sample)
 * @param options - React Query options (e.g., enabled flag for conditional fetching)
 * @returns React Query result with short LLM data
 */
export function useShortLLMData(options?: Omit<UseQueryOptions<LLMResponseData>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['llm-data', 'short'],
    queryFn: () => llmService.getShortData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

/**
 * Hook to fetch long LLM dataset (full dataset)
 * @param options - React Query options (e.g., enabled flag for conditional fetching)
 * @returns React Query result with long LLM data
 */
export function useLongLLMData(options?: Omit<UseQueryOptions<LLMResponseData>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['llm-data', 'long'],
    queryFn: () => llmService.getLongData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}


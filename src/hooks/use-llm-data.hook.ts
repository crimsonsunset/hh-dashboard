import { useQuery } from '@tanstack/react-query'
import { llmService } from '@services/llm.service'

/**
 * Hook to fetch short LLM dataset (small sample)
 * @returns React Query result with short LLM data
 */
export function useShortLLMData() {
  return useQuery({
    queryKey: ['llm-data', 'short'],
    queryFn: () => llmService.getShortData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch long LLM dataset (full dataset)
 * @returns React Query result with long LLM data
 */
export function useLongLLMData() {
  return useQuery({
    queryKey: ['llm-data', 'long'],
    queryFn: () => llmService.getLongData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}


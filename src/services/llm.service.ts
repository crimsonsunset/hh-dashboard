import { apiClient } from '@config/axios.config'
import type { LLMResponseData } from '@app-types/llm-response.types'

/**
 * Service for fetching LLM monitoring data
 */
class LLMService {
  /**
   * Fetches short dataset of LLM responses (small sample for testing)
   * @returns Promise with LLM response data
   */
  async getShortData(): Promise<LLMResponseData> {
    const response = await apiClient.get<LLMResponseData>('/short.mock-data.json')
    return response.data
  }

  /**
   * Fetches long dataset of LLM responses (full dataset)
   * @returns Promise with LLM response data
   */
  async getLongData(): Promise<LLMResponseData> {
    const response = await apiClient.get<LLMResponseData>('/long.mock-data.json')
    return response.data
  }
}

export const llmService = new LLMService()


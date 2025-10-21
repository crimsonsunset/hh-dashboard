import axios from 'axios'
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
    const response = await axios.get<LLMResponseData>('/src/data/short.mock-data.json')
    return response.data
  }

  /**
   * Fetches long dataset of LLM responses (full dataset)
   * @returns Promise with LLM response data
   */
  async getLongData(): Promise<LLMResponseData> {
    const response = await axios.get<LLMResponseData>('/src/data/long.mock-data.json')
    return response.data
  }
}

export const llmService = new LLMService()


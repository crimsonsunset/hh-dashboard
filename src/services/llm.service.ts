import axios from 'axios'

/**
 * Service for fetching LLM monitoring data
 */
class LLMService {
  /**
   * Fetches short dataset of LLM responses (small sample for testing)
   * @returns Promise with LLM response data
   */
  async getShortData() {
    const response = await axios.get('/src/data/short.mock-data.json')
    return response.data
  }

  /**
   * Fetches long dataset of LLM responses (full dataset)
   * @returns Promise with LLM response data
   */
  async getLongData() {
    const response = await axios.get('/src/data/long.mock-data.json')
    return response.data
  }
}

export const llmService = new LLMService()


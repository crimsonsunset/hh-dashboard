/**
 * Type definitions for LLM monitoring data structures
 * Generated from mock data structure in src/data/*.mock-data.json
 */

/**
 * Error information for failed LLM requests
 */
export interface ErrorInfo {
  type: string
  message: string
}

/**
 * Quality evaluation metrics for LLM responses
 */
export interface EvaluationMetrics {
  relevance_score: number
  factual_accuracy: number
  coherence_score: number
  response_quality: number
}

/**
 * Individual LLM API response data
 */
export interface LLMResponse {
  id: string
  timestamp: string
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | string
  prompt_tokens: number
  completion_tokens: number | null
  total_tokens: number | null
  response_time_ms: number
  status: 'success' | 'error' | 'timeout'
  cost_usd: number
  temperature: number
  max_tokens: number
  prompt_template: string
  output: string | null
  evaluation_metrics: EvaluationMetrics | null
  error: ErrorInfo | null
}

/**
 * Container for multiple LLM responses
 */
export interface LLMResponseData {
  responses: LLMResponse[]
}


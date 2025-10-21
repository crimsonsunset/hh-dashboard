import type { LLMResponseData } from '@app-types/llm-response.types'

export interface ValidationResult {
  valid: boolean
  error?: string
  data?: LLMResponseData
}

/**
 * Layer 1: Validate file extension
 */
function validateExtension(file: File): { valid: boolean; error?: string } {
  if (!file.name.endsWith('.json')) {
    return { valid: false, error: 'Invalid file type. Please upload a .json file.' }
  }
  return { valid: true }
}

/**
 * Layer 2: Validate JSON is parseable
 */
async function validateJSON(file: File): Promise<{ valid: boolean; error?: string; data?: unknown }> {
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    return { valid: true, data }
  } catch {
    return { valid: false, error: 'Invalid JSON format. File contains syntax errors.' }
  }
}

/**
 * Layer 3: Validate schema matches LLMResponseData
 */
function validateSchema(data: unknown): { valid: boolean; error?: string; data?: LLMResponseData } {
  // Check if data has responses array
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid schema. Expected object with "responses" array.' }
  }

  // Type guard to check responses property
  const dataObj = data as Record<string, unknown>
  
  if (!Array.isArray(dataObj.responses)) {
    return { valid: false, error: 'Invalid schema. Missing "responses" array.' }
  }

  // Validate each response has required fields
  for (let i = 0; i < dataObj.responses.length; i++) {
    const response = dataObj.responses[i] as Record<string, unknown>
    
    if (!response.id || typeof response.id !== 'string') {
      return { valid: false, error: `Invalid schema. Response ${i + 1} missing "id" field.` }
    }
    
    if (!response.timestamp || typeof response.timestamp !== 'string') {
      return { valid: false, error: `Invalid schema. Response ${i + 1} missing "timestamp" field.` }
    }
    
    if (!response.model || typeof response.model !== 'string') {
      return { valid: false, error: `Invalid schema. Response ${i + 1} missing "model" field.` }
    }
    
    if (!response.status || !['success', 'error', 'timeout'].includes(response.status as string)) {
      return { valid: false, error: `Invalid schema. Response ${i + 1} has invalid "status" field.` }
    }
  }

  return { valid: true, data: data as LLMResponseData }
}

/**
 * Full validation pipeline (all 3 layers)
 * Validates file extension, JSON parseability, and schema conformance
 */
export async function validateUploadedFile(file: File): Promise<ValidationResult> {
  // Layer 1: Extension
  const extensionResult = validateExtension(file)
  if (!extensionResult.valid) {
    return extensionResult
  }

  // Layer 2: Parseable JSON
  const jsonResult = await validateJSON(file)
  if (!jsonResult.valid) {
    return { valid: false, error: jsonResult.error }
  }

  // Layer 3: Schema validation
  const schemaResult = validateSchema(jsonResult.data)
  if (!schemaResult.valid) {
    return { valid: false, error: schemaResult.error }
  }

  return { valid: true, data: schemaResult.data }
}


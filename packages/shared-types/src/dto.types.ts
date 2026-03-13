// DTO para el request de análisis (frontend → backend)
export interface AnalyzeRequestDto {
  text: string
  businessType?: string
}

// DTO para la respuesta de error estandarizada
export interface ApiErrorResponse {
  statusCode: number
  message: string
  error?: string
  timestamp: string
}

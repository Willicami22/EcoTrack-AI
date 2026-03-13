// Categorías de actividades de carbono
export type CarbonCategory = 'transport' | 'energy' | 'waste' | 'water' | 'other'

// Nivel de confianza en la estimación
export type ConfidenceLevel = 'high' | 'medium' | 'low'

// Actividad de carbono extraída por la IA
export interface CarbonActivity {
  category: CarbonCategory
  description: string
  quantity: number
  unit: string
  co2_kg_estimate: number
  confidence: ConfidenceLevel
}

// Respuesta completa del análisis de IA
export interface AnalysisResult {
  activities: CarbonActivity[]
  summary: string
  total_co2_kg: number
  recommendations: string[]
}

// Factor de emisión de referencia
export interface EmissionFactor {
  category: CarbonCategory
  name: string
  factor_kg_per_unit: number
  unit: string
  source: string
}

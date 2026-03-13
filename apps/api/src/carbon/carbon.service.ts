import { Injectable, Logger } from '@nestjs/common'
import { AiService } from '../ai/ai.service'
import type { AnalysisResult, EmissionFactor } from '@ecotrack/shared-types'

// Factores de emisión de referencia (GHG Protocol)
const EMISSION_FACTORS: EmissionFactor[] = [
  {
    category: 'transport',
    name: 'Camioneta / auto diésel',
    factor_kg_per_unit: 0.21,
    unit: 'km',
    source: 'GHG Protocol',
  },
  {
    category: 'transport',
    name: 'Vuelo doméstico (por pasajero)',
    factor_kg_per_unit: 0.255,
    unit: 'km',
    source: 'ICAO Carbon Calculator',
  },
  {
    category: 'energy',
    name: 'Electricidad (Colombia)',
    factor_kg_per_unit: 0.126,
    unit: 'kWh',
    source: 'UPME 2023',
  },
  {
    category: 'energy',
    name: 'Gas natural',
    factor_kg_per_unit: 2.0,
    unit: 'm³',
    source: 'GHG Protocol',
  },
  {
    category: 'waste',
    name: 'Residuos orgánicos',
    factor_kg_per_unit: 0.5,
    unit: 'kg',
    source: 'IPCC 2006',
  },
  {
    category: 'waste',
    name: 'Residuos mixtos',
    factor_kg_per_unit: 1.0,
    unit: 'kg',
    source: 'IPCC 2006',
  },
  {
    category: 'water',
    name: 'Agua potable',
    factor_kg_per_unit: 0.001,
    unit: 'litro',
    source: 'Water Footprint Network',
  },
]

@Injectable()
export class CarbonService {
  private readonly logger = new Logger(CarbonService.name)
  // Almacenamiento en memoria de los últimos 10 análisis
  private readonly analysisHistory = new Map<string, AnalysisResult>()
  private readonly historyKeys: string[] = []
  private readonly MAX_HISTORY = 10

  constructor(private readonly aiService: AiService) {}

  async analyzeFootprint(
    text: string,
    businessType?: string
  ): Promise<AnalysisResult> {
    const contextText = businessType
      ? `[Tipo de negocio: ${businessType}]\n${text}`
      : text

    const result = await this.aiService.analyzeActivities(contextText)

    // Asegurar que total_co2_kg es correcto sumando las actividades
    const calculatedTotal = result.activities.reduce(
      (sum, act) => sum + act.co2_kg_estimate,
      0
    )
    result.total_co2_kg = Math.round(calculatedTotal * 100) / 100

    // Generar top 3 recomendaciones si no vienen de la IA
    if (!result.recommendations || result.recommendations.length === 0) {
      result.recommendations = this.generateRecommendations(result)
    }

    // Guardar en historial (máximo 10)
    this.saveToHistory(result)

    this.logger.log(
      `Análisis completado: ${result.activities.length} actividades, ${result.total_co2_kg} kg CO₂`
    )

    return result
  }

  getEmissionFactors(): EmissionFactor[] {
    return EMISSION_FACTORS
  }

  private generateRecommendations(result: AnalysisResult): string[] {
    const recommendations: string[] = []

    // Identificar la categoría con mayor CO₂
    const categoryTotals = result.activities.reduce(
      (acc, act) => {
        acc[act.category] = (acc[act.category] ?? 0) + act.co2_kg_estimate
        return acc
      },
      {} as Record<string, number>
    )

    const topCategory = Object.entries(categoryTotals).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0]

    if (topCategory === 'transport') {
      recommendations.push(
        'Considera implementar rutas de reparto optimizadas para reducir kilómetros recorridos en un 20-30%.'
      )
    } else if (topCategory === 'energy') {
      recommendations.push(
        'Migra a energías renovables o instala paneles solares para reducir el impacto de tu consumo eléctrico.'
      )
    } else if (topCategory === 'waste') {
      recommendations.push(
        'Implementa un programa de separación en origen para desviar residuos orgánicos al compostaje.'
      )
    }

    recommendations.push(
      'Realiza un diagnóstico energético de tus instalaciones para identificar equipos de alto consumo.'
    )
    recommendations.push(
      `Tu huella de ${result.total_co2_kg} kg CO₂ equivale a plantar ${Math.ceil(result.total_co2_kg / 21)} árboles para compensarla.`
    )

    return recommendations.slice(0, 3)
  }

  private saveToHistory(result: AnalysisResult): void {
    const key = `analysis-${Date.now()}`
    this.analysisHistory.set(key, result)
    this.historyKeys.push(key)

    // Mantener solo los últimos MAX_HISTORY
    if (this.historyKeys.length > this.MAX_HISTORY) {
      const oldestKey = this.historyKeys.shift()
      if (oldestKey) this.analysisHistory.delete(oldestKey)
    }
  }
}

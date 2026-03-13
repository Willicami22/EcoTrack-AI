import OpenAI from 'openai'
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { AnalysisResult } from '@ecotrack/shared-types'

const SYSTEM_PROMPT = `Eres el motor de análisis de EcoTrack AI. Tu tarea es extraer actividades
con huella de carbono del texto del usuario y devolver EXCLUSIVAMENTE un
JSON válido con esta estructura exacta:

{
  "activities": [
    {
      "category": "transport" | "energy" | "waste" | "water" | "other",
      "description": string,
      "quantity": number,
      "unit": string,
      "co2_kg_estimate": number,
      "confidence": "high" | "medium" | "low"
    }
  ],
  "summary": string,
  "total_co2_kg": number,
  "recommendations": [string, string, string]
}

Usa factores de emisión estándar GHG Protocol:
- Transporte (camioneta/auto): ~0.21 kg CO2/km · vuelo doméstico: ~0.255 kg CO2/km por pasajero
- Electricidad (Colombia): ~0.126 kg CO2/kWh · España: ~0.23 kg CO2/kWh · México: ~0.45 kg CO2/kWh
- Gas natural: ~2.0 kg CO2/m³
- Residuos orgánicos: ~0.5 kg CO2/kg · residuos mixtos: ~1.0 kg CO2/kg
- Agua: ~0.001 kg CO2/litro

Si la cantidad es ambigua, asume el caso promedio y marca confidence como "low".
Genera exactamente 3 recomendaciones concretas y accionables para reducir la huella.
No incluyas texto fuera del JSON. No uses markdown. Solo el objeto JSON puro.`

@Injectable()
export class AiService {
  private readonly client: OpenAI
  private readonly model: string
  private readonly logger = new Logger(AiService.name)

  constructor(private readonly config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    })
    this.model = this.config.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini'
  }

  async analyzeActivities(userText: string): Promise<AnalysisResult> {
    this.logger.log(`Analizando texto (${userText.length} chars) con ${this.model}`)

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userText },
        ],
        temperature: 0.2,
      })

      const rawContent = response.choices[0]?.message?.content
      if (!rawContent) {
        throw new Error('OpenAI devolvió una respuesta vacía')
      }

      this.logger.log(`Raw response: ${rawContent.substring(0, 100)}...`)

      const parsed = JSON.parse(rawContent) as AnalysisResult

      // Validación básica de estructura
      if (!Array.isArray(parsed.activities)) {
        throw new Error('La respuesta no contiene el campo "activities"')
      }

      return parsed
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      this.logger.error(`Error en OpenAI: ${message}`)

      if (error instanceof HttpException) throw error

      throw new HttpException(
        `Error al procesar con IA: ${message}`,
        HttpStatus.BAD_GATEWAY
      )
    }
  }
}

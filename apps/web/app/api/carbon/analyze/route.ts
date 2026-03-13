import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import OpenAI from 'openai'
import type { AnalysisResult } from '@ecotrack/shared-types'

const analyzeSchema = z.object({
  text: z.string().min(10).max(2000),
  businessType: z.string().max(100).optional(),
})

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown
    const parsed = analyzeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const apiKey = process.env['OPENAI_API_KEY']
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key de OpenAI no configurada' },
        { status: 500 }
      )
    }

    // Si hay un backend NestJS desplegado, úsalo; si no, llama a OpenAI directamente
    const backendUrl = process.env['NEXT_PUBLIC_API_URL']
    if (backendUrl && !backendUrl.includes('localhost')) {
      const response = await fetch(`${backendUrl}/carbon/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      const data = await response.json() as unknown
      if (!response.ok) return NextResponse.json(data, { status: response.status })
      return NextResponse.json(data)
    }

    // Modo Vercel / serverless: OpenAI directo desde el servidor Next.js
    const client = new OpenAI({ apiKey })
    const model = process.env['OPENAI_MODEL'] ?? 'gpt-4o-mini'

    const contextText = parsed.data.businessType
      ? `[Tipo de negocio: ${parsed.data.businessType}]\n${parsed.data.text}`
      : parsed.data.text

    const completion = await client.chat.completions.create({
      model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: contextText },
      ],
      temperature: 0.2,
    })

    const rawContent = completion.choices[0]?.message?.content
    if (!rawContent) {
      return NextResponse.json({ error: 'Respuesta vacía de la IA' }, { status: 502 })
    }

    const result = JSON.parse(rawContent) as AnalysisResult

    // Recalcular total para consistencia
    const calculatedTotal = result.activities.reduce(
      (sum, act) => sum + act.co2_kg_estimate, 0
    )
    result.total_co2_kg = Math.round(calculatedTotal * 100) / 100

    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      { error: `Error al procesar: ${message}` },
      { status: 502 }
    )
  }
}

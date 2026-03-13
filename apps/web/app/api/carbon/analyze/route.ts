import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const analyzeSchema = z.object({
  text: z.string().min(10).max(2000),
  businessType: z.string().max(100).optional(),
})

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

    const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001'

    const response = await fetch(`${apiUrl}/carbon/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })

    const data = await response.json() as unknown

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Error al conectar con el servidor de análisis' },
      { status: 502 }
    )
  }
}

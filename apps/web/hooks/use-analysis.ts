'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { AnalysisResult, AnalyzeRequestDto } from '@ecotrack/shared-types'

interface UseAnalysisReturn {
  result: AnalysisResult | null
  isLoading: boolean
  error: string | null
  analyze: (dto: AnalyzeRequestDto) => Promise<void>
  reset: () => void
}

export function useAnalysis(): UseAnalysisReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (dto: AnalyzeRequestDto) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/carbon/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      })

      const data = await response.json() as unknown

      if (!response.ok) {
        const errorData = data as { error?: string; message?: string }
        throw new Error(errorData.error ?? errorData.message ?? 'Error en el análisis')
      }

      setResult(data as AnalysisResult)
      toast.success('¡Análisis completado!', {
        description: 'Tu huella de carbono ha sido calculada.',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      toast.error('Error al analizar', { description: message })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { result, isLoading, error, analyze, reset }
}

'use client'

import type { AnalysisResult } from '@ecotrack/shared-types'
import { CarbonDonutChart } from './CarbonDonutChart'
import { ActivityCard } from './ActivityCard'
import { RecommendationCard } from './RecommendationCard'
import { formatCO2 } from '../lib/utils'

interface ResultsDashboardProps {
  result: AnalysisResult
  onReset: () => void
}

function getCO2Level(kg: number): { label: string; color: string; emoji: string } {
  if (kg < 50) return { label: 'Bajo impacto', color: 'text-emerald-600', emoji: '🟢' }
  if (kg < 200) return { label: 'Impacto moderado', color: 'text-amber-600', emoji: '🟡' }
  return { label: 'Alto impacto', color: 'text-red-600', emoji: '🔴' }
}

export function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  const level = getCO2Level(result.total_co2_kg)

  return (
    <div className="animate-slide-up space-y-5">
      {/* Header — Total CO₂ */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Huella de Carbono Total</p>
            <p className="text-5xl font-bold tracking-tight text-slate-900">
              {formatCO2(result.total_co2_kg)}
            </p>
            <p className={`mt-2 text-sm font-medium ${level.color}`}>
              {level.emoji} {level.label}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">Actividades detectadas</p>
            <p className="text-3xl font-bold text-emerald-600">{result.activities.length}</p>
          </div>
        </div>

        {result.summary && (
          <p className="mt-4 text-sm text-slate-600 border-t border-slate-100 pt-4 leading-relaxed">
            {result.summary}
          </p>
        )}

        <button
          onClick={onReset}
          className="mt-4 text-xs text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
        >
          Realizar nuevo análisis
        </button>
      </div>

      {/* Gráfico de dona */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">
          Desglose por Categoría
        </h3>
        <CarbonDonutChart
          activities={result.activities}
          totalCo2Kg={result.total_co2_kg}
        />
      </div>

      {/* Actividades detectadas */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          Actividades Detectadas
        </h3>
        <div className="space-y-3">
          {result.activities.map((activity, i) => (
            <ActivityCard key={i} activity={activity} />
          ))}
        </div>
      </div>

      {/* Recomendaciones */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Top 3 Recomendaciones
          </h3>
          <div className="space-y-3">
            {result.recommendations.slice(0, 3).map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

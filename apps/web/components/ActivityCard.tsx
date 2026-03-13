import { cn } from '../lib/utils'
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_COLORS, formatCO2 } from '../lib/utils'
import type { CarbonActivity } from '@ecotrack/shared-types'

interface ActivityCardProps {
  activity: CarbonActivity
}

const CONFIDENCE_STYLES = {
  high: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
} as const

const CONFIDENCE_LABELS = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
} as const

export function ActivityCard({ activity }: ActivityCardProps) {
  const color = CATEGORY_COLORS[activity.category]

  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Ícono categoría */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
        style={{ backgroundColor: `${color}20` }}
      >
        {CATEGORY_ICONS[activity.category]}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-slate-800 leading-snug">
            {activity.description}
          </p>
          <span className="shrink-0 text-sm font-bold text-slate-700">
            {formatCO2(activity.co2_kg_estimate)}
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {CATEGORY_LABELS[activity.category]}
          </span>

          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              CONFIDENCE_STYLES[activity.confidence]
            )}
          >
            Confianza {CONFIDENCE_LABELS[activity.confidence]}
          </span>

          <span className="text-xs text-slate-400">
            {activity.quantity} {activity.unit}
          </span>
        </div>
      </div>
    </div>
  )
}

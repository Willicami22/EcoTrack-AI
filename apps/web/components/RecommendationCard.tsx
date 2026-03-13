interface RecommendationCardProps {
  recommendation: string
  index: number
}

const ICONS = ['🎯', '♻️', '🌿']
const LABELS = ['Acción prioritaria', 'Medida verde', 'Consejo práctico']

export function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const icon = ICONS[index] ?? '💡'
  const label = LABELS[index] ?? 'Recomendación'

  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 transition-shadow hover:shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-0.5">
          {label}
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">{recommendation}</p>
      </div>
    </div>
  )
}

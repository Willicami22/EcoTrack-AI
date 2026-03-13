export function LoadingAnalysis() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Header skeleton */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 animate-pulse rounded-full bg-emerald-100" />
          <div className="space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="h-8 w-32 animate-pulse rounded bg-slate-100" />
      </div>

      {/* Chart skeleton */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-100 mb-4" />
        <div className="mx-auto h-64 w-64 animate-pulse rounded-full bg-slate-100" />
      </div>

      {/* Activities skeleton */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-3">
        <div className="h-4 w-36 animate-pulse rounded bg-slate-100 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>La IA está analizando tus actividades...</span>
      </div>
    </div>
  )
}

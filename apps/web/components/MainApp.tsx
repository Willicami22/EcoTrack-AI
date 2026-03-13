'use client'

import { useAnalysis } from '../hooks/use-analysis'
import { ChatInput } from './ChatInput'
import { ResultsDashboard } from './ResultsDashboard'
import { LoadingAnalysis } from './LoadingAnalysis'

export function MainApp() {
  const { result, isLoading, analyze, reset } = useAnalysis()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-slate-800 text-lg">EcoTrack AI</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:block">
            Calcula tu huella de carbono con IA
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] lg:grid-cols-[1fr_1.1fr]">
          {/* Columna izquierda — Input */}
          <div className="space-y-6">
            {/* Hero */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Mide el impacto de{' '}
                <span className="text-emerald-600">tu negocio</span>
              </h1>
              <p className="mt-3 text-slate-500 text-base leading-relaxed">
                Describe en lenguaje natural las actividades de tu empresa y
                obtén un análisis instantáneo de huella de carbono con
                recomendaciones accionables.
              </p>
            </div>

            {/* Pasos */}
            <div className="flex flex-col gap-2">
              {[
                { n: '1', text: 'Describe tus actividades del día' },
                { n: '2', text: 'La IA extrae y cuantifica cada fuente de CO₂' },
                { n: '3', text: 'Recibe recomendaciones personalizadas' },
              ].map(({ n, text }) => (
                <div key={n} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {n}
                  </div>
                  <p className="text-sm text-slate-600">{text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <ChatInput onSubmit={(text) => void analyze({ text })} isLoading={isLoading} />

            {/* Badge */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>⚡</span>
              <span>Impulsado por GPT-4o · Factores GHG Protocol</span>
            </div>
          </div>

          {/* Columna derecha — Resultados */}
          <div className="min-h-[400px]">
            {isLoading && <LoadingAnalysis />}

            {!isLoading && result && (
              <ResultsDashboard result={result} onReset={reset} />
            )}

            {!isLoading && !result && (
              <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50">
                <div className="text-center space-y-3 p-8">
                  <div className="text-5xl">📊</div>
                  <p className="font-medium text-slate-600">
                    Tu análisis aparecerá aquí
                  </p>
                  <p className="text-sm text-slate-400 max-w-xs">
                    Escribe las actividades de tu negocio y presiona{' '}
                    <strong>Calcular</strong> para ver el desglose de CO₂
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white/50 mt-16">
        <div className="mx-auto max-w-5xl px-4 py-4 text-center">
          <p className="text-xs text-slate-400">
            EcoTrack AI · Capstone Vibe Coding · Estimaciones basadas en GHG Protocol
          </p>
        </div>
      </footer>
    </div>
  )
}

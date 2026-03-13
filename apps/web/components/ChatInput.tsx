'use client'

import { useState } from 'react'
import { cn } from '../lib/utils'

interface ChatInputProps {
  onSubmit: (text: string) => void
  isLoading: boolean
}

const SUGGESTED_EXAMPLES = [
  'Usamos 5 camionetas de reparto y gastamos 200 kWh de luz al día',
  '3 empleados viajaron en avión a Bogotá, vuelo de 1 hora',
  'Generamos 50 kg de residuos y usamos gas natural por 8 horas',
]

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim().length >= 10) {
      onSubmit(text.trim())
    }
  }

  const handleExample = (example: string) => {
    setText(example)
  }

  const charCount = text.length
  const isValid = charCount >= 10 && charCount <= 2000

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe las actividades de tu negocio hoy...&#10;Ej: usamos 3 camionetas y gastamos 150 kWh de electricidad"
            rows={5}
            maxLength={2000}
            disabled={isLoading}
            className={cn(
              'w-full resize-none rounded-xl border-2 bg-white px-4 py-3',
              'text-slate-800 placeholder-slate-400',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-0',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isValid || charCount === 0
                ? 'border-slate-200 focus:border-emerald-400'
                : 'border-amber-300 focus:border-amber-400'
            )}
          />
          <span
            className={cn(
              'absolute bottom-3 right-3 text-xs',
              charCount > 1800 ? 'text-amber-500' : 'text-slate-400'
            )}
          >
            {charCount}/2000
          </span>
        </div>

        {charCount > 0 && charCount < 10 && (
          <p className="text-xs text-amber-600">Mínimo 10 caracteres para analizar</p>
        )}

        <button
          type="submit"
          disabled={!isValid || isLoading}
          className={cn(
            'w-full rounded-xl px-6 py-3.5 font-semibold text-white',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2',
            isValid && !isLoading
              ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] cursor-pointer'
              : 'bg-slate-300 cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Analizando con IA...
            </span>
          ) : (
            '🌱 Calcular Huella de Carbono'
          )}
        </button>
      </form>

      {/* Ejemplos sugeridos */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Ejemplos sugeridos
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_EXAMPLES.map((example, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleExample(example)}
              disabled={isLoading}
              className={cn(
                'rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5',
                'text-xs text-emerald-700 text-left',
                'transition-colors duration-150',
                'hover:bg-emerald-100 hover:border-emerald-300',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {example.length > 60 ? `${example.substring(0, 57)}...` : example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

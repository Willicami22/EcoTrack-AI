import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { CarbonCategory } from '@ecotrack/shared-types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CATEGORY_LABELS: Record<CarbonCategory, string> = {
  transport: 'Transporte',
  energy: 'Energía',
  waste: 'Residuos',
  water: 'Agua',
  other: 'Otros',
}

export const CATEGORY_COLORS: Record<CarbonCategory, string> = {
  transport: '#f59e0b',
  energy: '#3b82f6',
  waste: '#ef4444',
  water: '#06b6d4',
  other: '#8b5cf6',
}

export const CATEGORY_ICONS: Record<CarbonCategory, string> = {
  transport: '🚛',
  energy: '⚡',
  waste: '🗑️',
  water: '💧',
  other: '🏭',
}

export function formatCO2(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} t`
  return `${kg.toFixed(1)} kg`
}

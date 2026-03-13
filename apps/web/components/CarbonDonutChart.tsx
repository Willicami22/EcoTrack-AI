'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { CarbonActivity } from '@ecotrack/shared-types'
import { CATEGORY_COLORS, CATEGORY_LABELS, formatCO2 } from '../lib/utils'

interface CarbonDonutChartProps {
  activities: CarbonActivity[]
  totalCo2Kg: number
}

export function CarbonDonutChart({ activities, totalCo2Kg }: CarbonDonutChartProps) {
  // Agrupar por categoría
  const categoryData = activities.reduce(
    (acc, act) => {
      const cat = act.category
      acc[cat] = (acc[cat] ?? 0) + act.co2_kg_estimate
      return acc
    },
    {} as Record<string, number>
  )

  const chartData = Object.entries(categoryData).map(([category, value]) => ({
    name: CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category,
    value: Math.round(value * 10) / 10,
    color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ?? '#94a3b8',
  }))

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${formatCO2(value)}`, 'CO₂']}
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontSize: '13px',
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs text-slate-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Total en el centro */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center" style={{ marginBottom: '30px' }}>
          <p className="text-2xl font-bold text-slate-800">
            {formatCO2(totalCo2Kg)}
          </p>
          <p className="text-xs text-slate-500">CO₂ total</p>
        </div>
      </div>
    </div>
  )
}

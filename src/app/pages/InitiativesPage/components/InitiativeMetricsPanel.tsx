import type { CSSProperties } from 'react'
import { Card } from '../../../components/ui/Card'
import { tokens } from '../../../components/ui/tokens'

type InitiativeMetricsPanelProps = {
  annualCalculatedGain: number
  componentsCount: number
  kpiRowsCount: number
  fixedRowsCount: number
  stage: string
  status: string
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function InitiativeMetricsPanel({
  annualCalculatedGain,
  componentsCount,
  kpiRowsCount,
  fixedRowsCount,
  stage,
  status,
}: InitiativeMetricsPanelProps) {
  const metricStyle: CSSProperties = { margin: 0, fontSize: 18, fontWeight: 700, color: tokens.colors.textPrimary }

  return (
    <Card>
      <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700 }}>Key Metrics</h3>
      <div style={{ border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.sm, overflow: 'hidden' }}>
        {[
          ['Annual Calculated Gain', currency.format(annualCalculatedGain)],
          ['Components', String(componentsCount)],
          ['KPI Rows', String(kpiRowsCount)],
          ['Fixed Rows', String(fixedRowsCount)],
          ['Stage', stage],
          ['Status', status],
        ].map(([label, value], index) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
              borderTop: index === 0 ? 'none' : `1px solid ${tokens.colors.border}`,
              background: index % 2 === 0 ? tokens.colors.surfaceMuted : tokens.colors.surface,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: tokens.colors.textSecondary }}>{label}</span>
            <span style={{ ...metricStyle, fontSize: 14 }}>{value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

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
  const metricStyle: CSSProperties = { margin: 0, fontSize: 14, fontWeight: 700, color: tokens.colors.textPrimary }

  return (
    <Card>
      <h3 style={{ margin: `0 0 ${tokens.spacing.sm}px`, fontSize: 14, fontWeight: 600, color: tokens.colors.textSecondary }}>
        Key Metrics
      </h3>
      <div style={{ border: `1px solid ${tokens.colors.border}`, overflow: 'hidden' }}>
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
              alignItems: 'center',
              padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
              borderTop: index === 0 ? 'none' : `1px solid ${tokens.colors.border}`,
              background: tokens.colors.surface,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: tokens.colors.textMuted }}>{label}</span>
            <span style={{ ...metricStyle, textAlign: 'right' }}>{value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

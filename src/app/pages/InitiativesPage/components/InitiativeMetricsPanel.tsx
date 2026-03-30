import type { CSSProperties } from 'react'
import { Card } from '../../../components/ui/Card'
import { tokens } from '../../../components/ui/tokens'

type InitiativeMetricsPanelProps = {
  annualGain: number
  implementationCost: number
  componentsCount: number
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function InitiativeMetricsPanel({
  annualGain,
  implementationCost,
  componentsCount,
}: InitiativeMetricsPanelProps) {
  const metricStyle: CSSProperties = {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: tokens.colors.textPrimary,
  }

  return (
    <Card>
      <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>Key Metrics</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing.md }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: tokens.colors.textMuted }}>Annual Gain</p>
          <p style={metricStyle}>{currency.format(annualGain)}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: tokens.colors.textMuted }}>Implementation Cost</p>
          <p style={metricStyle}>{currency.format(implementationCost)}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: tokens.colors.textMuted }}>Components</p>
          <p style={metricStyle}>{componentsCount}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: tokens.colors.textMuted }}>Net Annual Impact</p>
          <p style={metricStyle}>{currency.format(annualGain - implementationCost)}</p>
        </div>
      </div>
    </Card>
  )
}

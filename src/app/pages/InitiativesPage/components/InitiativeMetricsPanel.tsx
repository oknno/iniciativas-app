import type { CSSProperties } from 'react'
import { Card } from '../../../components/ui/Card'
import { Field } from '../../../components/ui/Field'
import { Section } from '../../../components/ui/Section'
import { uiTokens } from '../../../components/ui/tokens'

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

const rowStyle: CSSProperties = {
  padding: `${uiTokens.spacing.sm}px ${uiTokens.spacing.md}px`,
  borderTop: `1px solid ${uiTokens.colors.border}`,
}

export function InitiativeMetricsPanel({
  annualCalculatedGain,
  componentsCount,
  kpiRowsCount,
  fixedRowsCount,
  stage,
  status,
}: InitiativeMetricsPanelProps) {
  const metrics = [
    ['Annual Calculated Gain', currency.format(annualCalculatedGain)],
    ['Components', String(componentsCount)],
    ['KPI Rows', String(kpiRowsCount)],
    ['Fixed Rows', String(fixedRowsCount)],
    ['Stage', stage],
    ['Status', status],
  ]

  return (
    <Card>
      <Section title="Key Metrics">
        <div style={{ border: `1px solid ${uiTokens.colors.border}`, overflow: 'hidden' }}>
          {metrics.map(([label, value], index) => (
            <div key={label} style={{ ...rowStyle, borderTop: index === 0 ? 'none' : rowStyle.borderTop }}>
              <Field label={label} value={value} layout="inline" />
            </div>
          ))}
        </div>
      </Section>
    </Card>
  )
}

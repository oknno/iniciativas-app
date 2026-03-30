import type { CSSProperties } from 'react'
import { Card } from '../../../components/ui/Card'
import { tokens } from '../../../components/ui/tokens'
import type { InitiativeStage } from '../../../../domain/initiatives/entities/InitiativeStage'
import type { InitiativeStatus } from '../../../../domain/initiatives/entities/InitiativeStatus'

type InitiativeMetricsPanelProps = {
  annualCalculatedGain: number
  componentsCount: number
  kpiRowsCount: number
  fixedRowsCount: number
  stage: InitiativeStage
  status: InitiativeStatus
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const confidenceByStage: Record<InitiativeStage, number> = {
  DRAFTING: 42,
  ASSESSMENT: 63,
  VALIDATION: 81,
  GOVERNANCE_GATE: 91,
}

const readinessByStatus: Record<InitiativeStatus, number> = {
  DRAFT: 35,
  IN_REVIEW: 68,
  APPROVED: 95,
  REJECTED: 12,
}

export function InitiativeMetricsPanel({
  annualCalculatedGain,
  componentsCount,
  kpiRowsCount,
  fixedRowsCount,
  stage,
  status,
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
          <p style={{ margin: 0, fontSize: 12, color: tokens.colors.textMuted }}>Annual Calculated Gain</p>
          <p style={metricStyle}>{currency.format(annualCalculatedGain)}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: tokens.colors.textMuted }}>Components</p>
          <p style={metricStyle}>{componentsCount}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: tokens.colors.textMuted }}>KPI Rows</p>
          <p style={metricStyle}>{kpiRowsCount}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: tokens.colors.textMuted }}>Fixed Rows</p>
          <p style={metricStyle}>{fixedRowsCount}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: tokens.colors.textMuted }}>Delivery Confidence</p>
          <p style={metricStyle}>{confidenceByStage[stage]}%</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: tokens.colors.textMuted }}>Execution Readiness</p>
          <p style={metricStyle}>{readinessByStatus[status]}%</p>
        </div>
      </div>
    </Card>
  )
}

import { Card } from '../../../../components/ui/Card'
import { tokens } from '../../../../components/ui/tokens'

type ReviewConfigurationPanelProps = {
  componentsCount: number
  kpiRowsCount: number
  fixedRowsCount: number
}

export function ReviewConfigurationPanel({ componentsCount, kpiRowsCount, fixedRowsCount }: ReviewConfigurationPanelProps) {
  return (
    <Card>
      <h4 style={{ margin: 0, fontSize: 15 }}>Configuration summary</h4>
      <div style={{ marginTop: tokens.spacing.sm, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: tokens.spacing.sm }}>
        <p style={{ margin: 0 }}>Components: <strong>{componentsCount}</strong></p>
        <p style={{ margin: 0 }}>KPI rows: <strong>{kpiRowsCount}</strong></p>
        <p style={{ margin: 0 }}>Fixed rows: <strong>{fixedRowsCount}</strong></p>
      </div>
    </Card>
  )
}

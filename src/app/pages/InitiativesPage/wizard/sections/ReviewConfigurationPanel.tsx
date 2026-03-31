import { Card } from '../../../../components/ui/Card'
import { tokens } from '../../../../components/ui/tokens'

type ReviewConfigurationPanelProps = {
  componentsCount: number
  kpiRowsCount: number
  fixedRowsCount: number
}

export function ReviewConfigurationPanel({ componentsCount, kpiRowsCount, fixedRowsCount }: ReviewConfigurationPanelProps) {
  return (
    <Card style={{ borderColor: tokens.colors.borderStrong }}>
      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Configuration summary</h4>
      <div style={{ marginTop: tokens.spacing.sm, border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.sm }}>
        {[
          ['Components', componentsCount],
          ['KPI rows', kpiRowsCount],
          ['Fixed rows', fixedRowsCount],
        ].map(([label, value], index) => (
          <div
            key={String(label)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
              borderTop: index === 0 ? 'none' : `1px solid ${tokens.colors.border}`,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: tokens.colors.textSecondary }}>{label}</span>
            <strong style={{ fontSize: 13 }}>{value}</strong>
          </div>
        ))}
      </div>
    </Card>
  )
}

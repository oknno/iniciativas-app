import { tokens } from '../../../../components/ui/tokens'

type ReviewConfigurationPanelProps = {
  componentsCount: number
  kpiRowsCount: number
  fixedRowsCount: number
}

export function ReviewConfigurationPanel({ componentsCount, kpiRowsCount, fixedRowsCount }: ReviewConfigurationPanelProps) {
  return (
    <div style={{ border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md }}>
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
  )
}

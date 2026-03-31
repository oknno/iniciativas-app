import { tokens } from '../../../../components/ui/tokens'

type ReviewConfigurationPanelProps = {
  componentsCount: number
  kpiRowsCount: number
  fixedRowsCount: number
}

export function ReviewConfigurationPanel({ componentsCount, kpiRowsCount, fixedRowsCount }: ReviewConfigurationPanelProps) {
  return (
    <div style={{ border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md, overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          padding: `${tokens.spacing.sm}px ${tokens.spacing.sm}px`,
          background: tokens.colors.surfaceMuted,
          borderBottom: `1px solid ${tokens.colors.border}`,
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.2,
          color: tokens.colors.textMuted,
        }}
      >
        <span>Item</span>
        <span>Count</span>
      </div>
      {[
        ['Components', componentsCount],
        ['KPI rows', kpiRowsCount],
        ['Fixed rows', fixedRowsCount],
      ].map(([label, value], index) => (
        <div
          key={String(label)}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            padding: `${tokens.spacing.sm}px ${tokens.spacing.sm}px`,
            borderTop: index === 0 ? 'none' : `1px solid ${tokens.colors.border}`,
            background: index % 2 === 0 ? '#ffffff' : '#fbfcfe',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: tokens.colors.textSecondary }}>{label}</span>
          <strong style={{ fontSize: 13, textAlign: 'right' }}>{value}</strong>
        </div>
      ))}
    </div>
  )
}

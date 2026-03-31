import { tokens } from '../../../../components/ui/tokens'

type ReviewConfigurationPanelProps = {
  componentsCount: number
  kpiRowsCount: number
  fixedRowsCount: number
}

export function ReviewConfigurationPanel({ componentsCount, kpiRowsCount, fixedRowsCount }: ReviewConfigurationPanelProps) {
  const hasNoComponents = componentsCount === 0
  const hasNoValueRows = kpiRowsCount === 0 && fixedRowsCount === 0

  return (
    <div style={{ display: 'grid', gap: tokens.spacing.sm }}>
      <div
        style={{
          border: `1px solid ${hasNoComponents || hasNoValueRows ? tokens.colors.warningText : tokens.colors.successText}`,
          borderRadius: tokens.radius.sm,
          padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
          color: hasNoComponents || hasNoValueRows ? tokens.colors.warningText : tokens.colors.successText,
          fontSize: 12,
          fontWeight: 600,
          background: hasNoComponents || hasNoValueRows ? tokens.colors.warningSoft : tokens.colors.successSoft,
        }}
      >
        {hasNoComponents
          ? 'Nenhum componente configurado.'
          : hasNoValueRows
            ? 'Sem linhas de valores para cálculo.'
            : 'Configuração mínima concluída.'}
      </div>
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
        <span>Quantidade</span>
      </div>
      {[
        ['Componentes', componentsCount],
        ['Linhas KPI', kpiRowsCount],
        ['Linhas fixas', fixedRowsCount],
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
    </div>
  )
}

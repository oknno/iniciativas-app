import type { ConversionPreviewGroup } from '../../../../../application/mappers/initiatives/initiativeValueMappers'
import { MONTHS } from '../../../../../application/mappers/initiatives/initiativeValueMappers'
import { tokens } from '../../../../components/ui/tokens'

type ConversionPreviewPanelProps = {
  groups: readonly ConversionPreviewGroup[]
}

export function ConversionPreviewPanel({ groups }: ConversionPreviewPanelProps) {
  if (groups.length === 0) {
    return <div style={{ fontSize: 13, color: tokens.colors.textSecondary }}>No conversion values are used by configured components.</div>
  }

  return (
    <div style={{ display: 'grid', gap: tokens.spacing.sm }}>
      {groups.map((group) => (
        <div key={group.conversionCode} style={{ border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md, overflow: 'hidden' }}>
          <div style={{ padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`, borderBottom: `1px solid ${tokens.colors.border}`, background: '#f8fafc' }}>
            <strong style={{ fontSize: 13 }}>{group.conversionName}</strong>
            <div style={{ fontSize: 12, color: tokens.colors.textSecondary }}>
              {group.sourceUnit} → {group.targetUnit}
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', minWidth: 820, width: '100%', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#ffffff' }}>
                  {MONTHS.map(({ month, label }) => (
                    <th key={month} style={monthHeaderStyle}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {MONTHS.map(({ month }) => (
                    <td key={month} style={monthValueCellStyle}>
                      {group.monthlyValues[month] ?? '-'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

const monthHeaderStyle = {
  padding: `${tokens.spacing.sm}px ${tokens.spacing.xs}px`,
  borderBottom: `1px solid ${tokens.colors.border}`,
  textAlign: 'center' as const,
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  color: tokens.colors.textMuted,
}

const monthValueCellStyle = {
  padding: `${tokens.spacing.sm}px ${tokens.spacing.xs}px`,
  borderRight: `1px solid ${tokens.colors.border}`,
  textAlign: 'right' as const,
  fontWeight: 600,
  color: tokens.colors.textPrimary,
}

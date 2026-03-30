import type { ConversionPreviewGroup } from '../../../../../application/mappers/initiatives/initiativeValueMappers'
import { MONTHS } from '../../../../../application/mappers/initiatives/initiativeValueMappers'
import { tokens } from '../../../../components/ui/tokens'

type ConversionPreviewPanelProps = {
  groups: readonly ConversionPreviewGroup[]
}

export function ConversionPreviewPanel({ groups }: ConversionPreviewPanelProps) {
  if (groups.length === 0) {
    return <div style={{ fontSize: 14, color: tokens.colors.textSecondary }}>No conversion values are used by configured components.</div>
  }

  return (
    <div style={{ display: 'grid', gap: tokens.spacing.sm }}>
      {groups.map((group) => (
        <div key={group.conversionCode} style={{ border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md }}>
          <div style={{ padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`, borderBottom: `1px solid ${tokens.colors.border}`, background: '#f8fafc' }}>
            <strong style={{ fontSize: 14 }}>{group.conversionName}</strong>
            <div style={{ fontSize: 12, color: tokens.colors.textSecondary }}>
              {group.sourceUnit} → {group.targetUnit}
            </div>
          </div>
          <div style={{ padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`, display: 'grid', gridTemplateColumns: 'repeat(12, minmax(68px, 1fr))', gap: tokens.spacing.xs, overflowX: 'auto' }}>
            {MONTHS.map(({ month, label }) => (
              <div key={month} style={{ minWidth: 68 }}>
                <div style={{ fontSize: 11, color: tokens.colors.textMuted, textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{group.monthlyValues[month] ?? '-'}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

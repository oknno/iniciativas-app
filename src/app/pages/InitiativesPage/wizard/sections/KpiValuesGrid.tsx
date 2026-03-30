import type { CSSProperties } from 'react'
import type { KpiValueGridRow, MonthNumber, MonthlyInputMap } from '../../../../../application/mappers/initiatives/initiativeValueMappers'
import { MONTHS } from '../../../../../application/mappers/initiatives/initiativeValueMappers'
import { tokens } from '../../../../components/ui/tokens'

type KpiValuesGridProps = {
  rows: readonly KpiValueGridRow[]
  valuesByRow: Readonly<Record<string, MonthlyInputMap>>
  onValueChange: (rowSignature: string, month: MonthNumber, value: string) => void
}

export function KpiValuesGrid({ rows, valuesByRow, onValueChange }: KpiValuesGridProps) {
  if (rows.length === 0) {
    return (
      <div style={{ fontSize: 14, color: tokens.colors.textSecondary }}>No KPI-based components configured for this initiative.</div>
    )
  }

  return (
    <div style={{ overflowX: 'auto', border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md }}>
      <table style={{ borderCollapse: 'collapse', minWidth: 1020, width: '100%' }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            <th style={headerStyle}>Component / KPI</th>
            {MONTHS.map(({ month, label }) => (
              <th key={month} style={headerStyle}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.signature}>
              <td style={{ ...cellStyle, minWidth: 240 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{row.componentName}</div>
                <div style={{ fontSize: 12, color: tokens.colors.textSecondary }}>
                  {row.kpiName} ({row.unit})
                </div>
              </td>
              {MONTHS.map(({ month }) => (
                <td key={month} style={cellStyle}>
                  <input
                    type="number"
                    value={valuesByRow[row.signature]?.[month] ?? ''}
                    onChange={(event) => onValueChange(row.signature, month, event.target.value)}
                    placeholder="-"
                    style={inputStyle}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const headerStyle: CSSProperties = {
  borderBottom: `1px solid ${tokens.colors.border}`,
  borderRight: `1px solid ${tokens.colors.border}`,
  padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
  textAlign: 'left',
  fontSize: 12,
  textTransform: 'uppercase',
  color: tokens.colors.textMuted,
}

const cellStyle: CSSProperties = {
  borderBottom: `1px solid ${tokens.colors.border}`,
  borderRight: `1px solid ${tokens.colors.border}`,
  padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
}

const inputStyle: CSSProperties = {
  width: '100%',
  minWidth: 72,
  border: `1px solid ${tokens.colors.borderStrong}`,
  borderRadius: tokens.radius.sm,
  padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
  fontSize: 13,
}

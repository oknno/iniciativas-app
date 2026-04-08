import type { CSSProperties } from 'react'
import type { ConversionValueGridRow, MonthNumber, MonthlyInputMap } from '../../../../../application/mappers/initiatives/initiativeValueMappers'
import { MONTHS } from '../../../../../application/mappers/initiatives/initiativeValueMappers'
import { tokens } from '../../../../components/ui/tokens'

type ConversionValuesGridProps = {
  rows: readonly ConversionValueGridRow[]
  valuesByRow: Readonly<Record<string, MonthlyInputMap>>
  monthlyErrorsByRow: Readonly<Record<string, readonly MonthNumber[]>>
  isEditable: boolean
  onValueChange: (rowSignature: string, month: MonthNumber, value: string) => void
}

export function ConversionValuesGrid({
  rows,
  valuesByRow,
  monthlyErrorsByRow,
  isEditable,
  onValueChange,
}: ConversionValuesGridProps) {
  if (rows.length === 0) {
    return <div style={{ fontSize: 13, color: tokens.colors.textSecondary }}>Nenhuma conversão aplicável para os componentes atuais.</div>
  }

  return (
    <div style={{ overflowX: 'auto', border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md }}>
      <table style={{ borderCollapse: 'collapse', minWidth: 1020, width: '100%' }}>
        <thead>
          <tr style={{ background: tokens.colors.surfaceMuted }}>
            <th style={headerStyle}>Conversão</th>
            {MONTHS.map(({ month, label }) => (
              <th key={month} style={{ ...headerStyle, textAlign: 'right' }}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.signature} style={{ background: index % 2 === 0 ? '#ffffff' : '#fbfcfe' }}>
              <td style={{ ...cellStyle, ...rowLabelStyle }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{row.conversionName}</div>
                <div style={{ fontSize: 12, color: tokens.colors.textSecondary }}>
                  {row.sourceUnit} → {row.targetUnit}
                </div>
              </td>
              {MONTHS.map(({ month }) => {
                const hasError = Boolean(monthlyErrorsByRow[row.signature]?.includes(month))

                return (
                  <td key={month} style={cellStyle}>
                    <input
                      type="number"
                      value={valuesByRow[row.signature]?.[month] ?? ''}
                      onChange={(event) => onValueChange(row.signature, month, event.target.value)}
                      placeholder="-"
                      disabled={!isEditable}
                      style={{
                        ...inputStyle,
                        borderColor: hasError ? tokens.colors.dangerText : tokens.colors.borderStrong,
                        background: isEditable ? '#ffffff' : '#f8fafc',
                      }}
                    />
                  </td>
                )
              })}
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
  padding: `${tokens.spacing.sm}px ${tokens.spacing.sm}px`,
  textAlign: 'left',
  fontSize: 11,
  textTransform: 'uppercase',
  color: tokens.colors.textMuted,
  fontWeight: 700,
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
  height: 32,
  padding: `0 ${tokens.spacing.sm}px`,
  fontSize: 13,
  textAlign: 'right',
  color: tokens.colors.textPrimary,
}

const rowLabelStyle: CSSProperties = {
  minWidth: 260,
  position: 'sticky',
  left: 0,
  zIndex: 1,
  background: 'inherit',
}

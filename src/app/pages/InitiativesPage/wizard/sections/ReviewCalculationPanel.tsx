import { tokens } from '../../../../components/ui/tokens'
import type { CalculateInitiativeResultDto } from '../../../../../application/dto/calculation/CalculateInitiativeResultDto'

type ReviewCalculationPanelProps = {
  calculation: CalculateInitiativeResultDto
  mode: 'monthly' | 'details'
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export function ReviewCalculationPanel({ calculation, mode }: ReviewCalculationPanelProps) {
  const annualGain = calculation.results.reduce((sum, item) => sum + item.gainValue, 0)

  if (mode === 'monthly') {
    return (
      <div style={{ border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: tokens.colors.surfaceMuted }}>
              <th align="left" style={headerCellStyle}>
                Month
              </th>
              <th align="right" style={headerCellStyle}>
                Gain
              </th>
            </tr>
          </thead>
          <tbody>
            {calculation.results.map((item) => (
              <tr key={`${item.year}-${item.month}`}>
                <td style={bodyCellStyle}>{item.year}-{String(item.month).padStart(2, '0')}</td>
                <td style={{ ...bodyCellStyle, textAlign: 'right' }}>{currency.format(item.gainValue)}</td>
              </tr>
            ))}
            <tr style={{ background: '#f8fafc' }}>
              <td style={{ ...bodyCellStyle, fontWeight: 700 }}>Total annual gain</td>
              <td style={{ ...bodyCellStyle, textAlign: 'right', fontWeight: 700 }}>{currency.format(annualGain)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div style={{ border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 860 }}>
        <thead>
          <tr style={{ background: tokens.colors.surfaceMuted }}>
            <th align="left" style={headerCellStyle}>Month</th>
            <th align="left" style={headerCellStyle}>Component</th>
            <th align="left" style={headerCellStyle}>Formula</th>
            <th align="right" style={headerCellStyle}>Raw</th>
            <th align="right" style={headerCellStyle}>Signed</th>
            <th align="left" style={headerCellStyle}>Explanation</th>
          </tr>
        </thead>
        <tbody>
          {calculation.details.map((item, index) => (
            <tr key={`${item.month}-${item.componentType}-${index}`}>
              <td style={bodyCellStyle}>{item.year}-{String(item.month).padStart(2, '0')}</td>
              <td style={bodyCellStyle}>{item.componentType}</td>
              <td style={bodyCellStyle}>{item.formulaCode}</td>
              <td style={{ ...bodyCellStyle, textAlign: 'right' }}>{currency.format(item.rawValue)}</td>
              <td style={{ ...bodyCellStyle, textAlign: 'right' }}>{currency.format(item.signedValue)}</td>
              <td style={bodyCellStyle}>{item.explanation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const headerCellStyle = {
  borderBottom: `1px solid ${tokens.colors.border}`,
  padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
  fontSize: 12,
  textTransform: 'uppercase' as const,
  color: tokens.colors.textMuted,
  letterSpacing: 0.2,
}

const bodyCellStyle = {
  borderBottom: `1px solid ${tokens.colors.border}`,
  padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
}

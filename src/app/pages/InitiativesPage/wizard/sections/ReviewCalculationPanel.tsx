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
    if (calculation.results.length === 0) {
      return (
        <div style={{ fontSize: 13, color: tokens.colors.textSecondary }}>
          Resultado mensal ainda não disponível. Preencha as etapas anteriores para calcular o preview.
        </div>
      )
    }

    return (
      <div style={{ border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: tokens.colors.surfaceMuted }}>
              <th align="left" style={headerCellStyle}>
                Mês
              </th>
              <th align="right" style={headerCellStyle}>
                Ganho
              </th>
            </tr>
          </thead>
          <tbody>
            {calculation.results.map((item, index) => (
              <tr key={`${item.year}-${item.month}`} style={{ background: index % 2 === 0 ? '#ffffff' : '#fbfcfe' }}>
                <td style={bodyCellStyle}>{item.year}-{String(item.month).padStart(2, '0')}</td>
                <td style={{ ...bodyCellStyle, textAlign: 'right' }}>{currency.format(item.gainValue)}</td>
              </tr>
            ))}
            <tr style={{ background: '#f8fafc' }}>
              <td style={{ ...bodyCellStyle, fontWeight: 700 }}>Ganho anual total</td>
              <td style={{ ...bodyCellStyle, textAlign: 'right', fontWeight: 700 }}>{currency.format(annualGain)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  if (calculation.details.length === 0) {
    return (
      <div style={{ fontSize: 13, color: tokens.colors.textSecondary }}>
        Detalhamento indisponível no momento. O cálculo será exibido após atualização do preview.
      </div>
    )
  }

  return (
    <div style={{ border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 860 }}>
        <thead>
          <tr style={{ background: tokens.colors.surfaceMuted }}>
            <th align="left" style={headerCellStyle}>Mês</th>
            <th align="left" style={headerCellStyle}>Componente</th>
            <th align="left" style={headerCellStyle}>KPI</th>
            <th align="left" style={headerCellStyle}>Conversão</th>
            <th align="right" style={headerCellStyle}>Base</th>
            <th align="right" style={headerCellStyle}>Valor de conversão</th>
            <th align="right" style={headerCellStyle}>Resultado</th>
          </tr>
        </thead>
        <tbody>
          {calculation.details.map((item, index) => (
            <tr key={`${item.month}-${item.componentType}-${index}`} style={{ background: index % 2 === 0 ? '#ffffff' : '#fbfcfe' }}>
              <td style={bodyCellStyle}>{item.year}-{String(item.month).padStart(2, '0')}</td>
              <td style={bodyCellStyle}>{item.componentType}</td>
              <td style={bodyCellStyle}>{item.kpiCode ?? '-'}</td>
              <td style={bodyCellStyle}>{item.conversionCode ?? '-'}</td>
              <td style={{ ...bodyCellStyle, textAlign: 'right' }}>{currency.format(item.baseValue ?? 0)}</td>
              <td style={{ ...bodyCellStyle, textAlign: 'right' }}>{currency.format(item.conversionValue ?? 0)}</td>
              <td style={{ ...bodyCellStyle, textAlign: 'right' }}>{currency.format(item.resultValue ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const headerCellStyle = {
  borderBottom: `1px solid ${tokens.colors.border}`,
  padding: `${tokens.spacing.sm}px ${tokens.spacing.sm}px`,
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  color: tokens.colors.textMuted,
  letterSpacing: 0.2,
}

const bodyCellStyle = {
  borderBottom: `1px solid ${tokens.colors.border}`,
  padding: `${tokens.spacing.sm}px ${tokens.spacing.sm}px`,
}

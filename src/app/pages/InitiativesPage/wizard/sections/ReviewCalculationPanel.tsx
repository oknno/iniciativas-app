import { Card } from '../../../../components/ui/Card'
import { tokens } from '../../../../components/ui/tokens'
import type { CalculateInitiativeResultDto } from '../../../../../application/dto/calculation/CalculateInitiativeResultDto'

type ReviewCalculationPanelProps = {
  calculation: CalculateInitiativeResultDto
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export function ReviewCalculationPanel({ calculation }: ReviewCalculationPanelProps) {
  const annualGain = calculation.results.reduce((sum, item) => sum + item.gainValue, 0)

  return (
    <Card style={{ borderColor: tokens.colors.borderStrong }}>
      <h4 style={{ marginTop: 0, marginBottom: tokens.spacing.sm, fontSize: 14, fontWeight: 700 }}>Monthly result</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, border: `1px solid ${tokens.colors.border}` }}>
        <thead>
          <tr style={{ background: tokens.colors.surfaceMuted }}>
            <th align="left">Month</th>
            <th align="right">Gain</th>
          </tr>
        </thead>
        <tbody>
          {calculation.results.map((item) => (
            <tr key={`${item.year}-${item.month}`}><td>{item.year}-{String(item.month).padStart(2, '0')}</td><td align="right">{currency.format(item.gainValue)}</td></tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginBottom: 0, fontSize: 13 }}>
        <strong>Total annual gain: {currency.format(annualGain)}</strong>
      </p>

      <h4 style={{ marginTop: 20, marginBottom: tokens.spacing.sm, fontSize: 14, fontWeight: 700 }}>Calculation detail</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, border: `1px solid ${tokens.colors.border}` }}>
        <thead>
          <tr style={{ background: tokens.colors.surfaceMuted }}>
            <th align="left">Month</th><th align="left">Component</th><th align="left">Formula</th><th align="right">Raw</th><th align="right">Signed</th><th align="left">Explanation</th>
          </tr>
        </thead>
        <tbody>
          {calculation.details.map((item, index) => (
            <tr key={`${item.month}-${item.componentType}-${index}`}>
              <td>{item.year}-{String(item.month).padStart(2, '0')}</td>
              <td>{item.componentType}</td>
              <td>{item.formulaCode}</td>
              <td align="right">{currency.format(item.rawValue)}</td>
              <td align="right">{currency.format(item.signedValue)}</td>
              <td>{item.explanation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

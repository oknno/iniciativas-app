import { Card } from '../../../../components/ui/Card'
import { tokens } from '../../../../components/ui/tokens'

export function ValuesStep() {
  return (
    <Card
      style={{
        borderStyle: 'dashed',
        color: tokens.colors.textSecondary,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 17, color: tokens.colors.textPrimary }}>Values input</h3>
      <p style={{ margin: `${tokens.spacing.xs}px 0 0`, fontSize: 14 }}>
        Placeholder: value inputs and assumptions will be added in a next iteration.
      </p>
    </Card>
  )
}

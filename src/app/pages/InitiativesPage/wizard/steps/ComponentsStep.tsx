import { Card } from '../../../../components/ui/Card'
import { tokens } from '../../../../components/ui/tokens'

export function ComponentsStep() {
  return (
    <Card
      style={{
        borderStyle: 'dashed',
        color: tokens.colors.textSecondary,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 17, color: tokens.colors.textPrimary }}>Component structure</h3>
      <p style={{ margin: `${tokens.spacing.xs}px 0 0`, fontSize: 14 }}>
        Placeholder: component configuration UI will be added in a next iteration.
      </p>
    </Card>
  )
}

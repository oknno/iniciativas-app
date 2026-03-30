import { Card } from '../../../../components/ui/Card'
import { tokens } from '../../../../components/ui/tokens'

export function ReviewStep() {
  return (
    <Card
      style={{
        borderStyle: 'dashed',
        color: tokens.colors.textSecondary,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 17, color: tokens.colors.textPrimary }}>Review and confirm</h3>
      <p style={{ margin: `${tokens.spacing.xs}px 0 0`, fontSize: 14 }}>
        Placeholder: final summary and confirmation controls will be added in a next iteration.
      </p>
    </Card>
  )
}

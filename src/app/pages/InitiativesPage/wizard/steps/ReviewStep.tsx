import { Card } from '../../../../components/ui/Card'
import { tokens } from '../../../../components/ui/tokens'
import type { CalculateInitiativeResultDto } from '../../../../../application/dto/calculation/CalculateInitiativeResultDto'
import type { InitiativeDetailDto } from '../../../../../application/dto/initiatives/InitiativeDetailDto'

type ReviewStepProps = {
  selectedInitiative?: InitiativeDetailDto
  calculation: CalculateInitiativeResultDto
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function ReviewStep({ selectedInitiative, calculation }: ReviewStepProps) {
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
      <p style={{ margin: `${tokens.spacing.sm}px 0 0`, fontSize: 13 }}>
        Typed references → initiative: {selectedInitiative?.code ?? 'N/A'}, final gain sample:{' '}
        {currency.format(calculation.finalGain)}, details: {calculation.detail.length}
      </p>
    </Card>
  )
}

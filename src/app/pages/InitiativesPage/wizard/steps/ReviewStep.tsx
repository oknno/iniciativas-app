import { tokens } from '../../../../components/ui/tokens'
import type { CalculateInitiativeResultDto } from '../../../../../application/dto/calculation/CalculateInitiativeResultDto'
import type { InitiativeDetailDto } from '../../../../../application/dto/initiatives/InitiativeDetailDto'
import { ReviewCalculationPanel } from '../sections/ReviewCalculationPanel'
import { ReviewConfigurationPanel } from '../sections/ReviewConfigurationPanel'

type ReviewStepProps = {
  selectedInitiative?: InitiativeDetailDto
  calculation: CalculateInitiativeResultDto
  componentsCount: number
  kpiRowsCount: number
  fixedRowsCount: number
}

export function ReviewStep({ selectedInitiative, calculation, componentsCount, kpiRowsCount, fixedRowsCount }: ReviewStepProps) {
  return (
    <div style={{ display: 'grid', gap: tokens.spacing.md }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>7. Review and Confirm</h3>
        <p style={{ margin: `${tokens.spacing.xs}px 0 0`, fontSize: 13, color: tokens.colors.textSecondary }}>
          Initiative: {selectedInitiative?.unidade ?? 'New initiative'}
        </p>
      </div>
      <ReviewConfigurationPanel componentsCount={componentsCount} kpiRowsCount={kpiRowsCount} fixedRowsCount={fixedRowsCount} />
      <ReviewCalculationPanel calculation={calculation} />
    </div>
  )
}

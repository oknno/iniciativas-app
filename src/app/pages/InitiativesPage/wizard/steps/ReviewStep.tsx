import { Section } from '../../../../components/ui/Section'
import { uiTokens } from '../../../../components/ui/tokens'
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
    <div style={{ display: 'grid', gap: uiTokens.spacing.md }}>
      <Section title="7. Review and Confirm" subtitle={`Initiative: ${selectedInitiative?.unidade ?? 'New initiative'}`}>
        <></>
      </Section>
      <ReviewConfigurationPanel componentsCount={componentsCount} kpiRowsCount={kpiRowsCount} fixedRowsCount={fixedRowsCount} />
      <ReviewCalculationPanel calculation={calculation} />
    </div>
  )
}

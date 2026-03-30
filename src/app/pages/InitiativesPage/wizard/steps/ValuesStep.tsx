import { Card } from '../../../../components/ui/Card'
import { tokens } from '../../../../components/ui/tokens'
import type { InitiativeDetailDto } from '../../../../../application/dto/initiatives/InitiativeDetailDto'

type ValuesStepProps = {
  selectedInitiative?: InitiativeDetailDto
  kpiValuesCount: number
  componentValuesCount: number
}

export function ValuesStep({ selectedInitiative, kpiValuesCount, componentValuesCount }: ValuesStepProps) {
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
      <p style={{ margin: `${tokens.spacing.sm}px 0 0`, fontSize: 13 }}>
        Typed references → initiative: {selectedInitiative?.code ?? 'N/A'}, KPI values: {kpiValuesCount}, component
        values: {componentValuesCount}
      </p>
    </Card>
  )
}

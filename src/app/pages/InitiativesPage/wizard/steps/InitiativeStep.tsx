import { Card } from '../../../../components/ui/Card'
import { tokens } from '../../../../components/ui/tokens'
import type { InitiativeDetailDto } from '../../../../../application/dto/initiatives/InitiativeDetailDto'

type InitiativeStepProps = {
  selectedInitiative?: InitiativeDetailDto
}

export function InitiativeStep({ selectedInitiative }: InitiativeStepProps) {
  return (
    <Card
      style={{
        borderStyle: 'dashed',
        color: tokens.colors.textSecondary,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 17, color: tokens.colors.textPrimary }}>Initiative details</h3>
      <p style={{ margin: `${tokens.spacing.xs}px 0 0`, fontSize: 14 }}>
        Placeholder: main initiative information form will be added in a next iteration.
      </p>
      <p style={{ margin: `${tokens.spacing.sm}px 0 0`, fontSize: 13 }}>
        Selected reference: <strong>{selectedInitiative?.code ?? 'No initiative selected'}</strong>
      </p>
    </Card>
  )
}

import { Card } from '../../../../components/ui/Card'
import { tokens } from '../../../../components/ui/tokens'
import type { InitiativeDetailDto } from '../../../../../application/dto/initiatives/InitiativeDetailDto'

type ComponentsStepProps = {
  selectedInitiative?: InitiativeDetailDto
  componentCatalogSize: number
  kpiCatalogSize: number
  conversionCatalogSize: number
}

export function ComponentsStep({
  selectedInitiative,
  componentCatalogSize,
  kpiCatalogSize,
  conversionCatalogSize,
}: ComponentsStepProps) {
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
      <p style={{ margin: `${tokens.spacing.sm}px 0 0`, fontSize: 13 }}>
        Typed references → initiative components: {selectedInitiative?.components.length ?? 0}, component catalog:{' '}
        {componentCatalogSize}, KPI catalog: {kpiCatalogSize}, conversion catalog: {conversionCatalogSize}
      </p>
    </Card>
  )
}

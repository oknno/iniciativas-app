import { Card } from '../../../../components/ui/Card'
import { tokens } from '../../../../components/ui/tokens'
import type { ComponentMasterDto } from '../../../../../application/dto/catalogs/ComponentMasterDto'
import type { ConversionMasterDto } from '../../../../../application/dto/catalogs/ConversionMasterDto'
import type { FormulaMasterDto } from '../../../../../application/dto/catalogs/FormulaMasterDto'
import type { KpiMasterDto } from '../../../../../application/dto/catalogs/KpiMasterDto'
import { getInitiativeComponentDraftErrors } from '../../../../../application/mappers/initiatives/initiativeComponentMappers'
import type { InitiativeComponentDraftDto } from '../../../../../application/mappers/initiatives/initiativeComponentMappers'
import { ComponentConfigGrid } from '../sections/ComponentConfigGrid'

type ComponentsStepProps = {
  components: readonly InitiativeComponentDraftDto[]
  componentCatalog: readonly ComponentMasterDto[]
  kpiCatalog: readonly KpiMasterDto[]
  conversionCatalog: readonly ConversionMasterDto[]
  formulaCatalog: readonly FormulaMasterDto[]
  isLoading: boolean
  onAddComponent: () => void
  onRemoveComponent: (index: number) => void
  onUpdateComponent: (index: number, patch: Partial<InitiativeComponentDraftDto>) => void
}

export function ComponentsStep({
  components,
  componentCatalog,
  kpiCatalog,
  conversionCatalog,
  formulaCatalog,
  isLoading,
  onAddComponent,
  onRemoveComponent,
  onUpdateComponent,
}: ComponentsStepProps) {
  const validationByRow = Object.fromEntries(
    components.map((component, index) => [index, getInitiativeComponentDraftErrors(component, componentCatalog)]),
  )

  return (
    <Card style={{ borderColor: tokens.colors.borderStrong }}>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: tokens.colors.textPrimary }}>3. Informação Operacional</h3>
      <p style={{ margin: `${tokens.spacing.xs}px 0 ${tokens.spacing.sm}px`, fontSize: 13, color: tokens.colors.textSecondary }}>
        Configure the value components for this initiative. Direction and calculation type are automatically inferred from
        the selected component type.
      </p>

      {isLoading ? (
        <p style={{ margin: 0, fontSize: 13, color: tokens.colors.textMuted }}>Loading initiative components...</p>
      ) : (
        <div style={{ border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.sm, padding: tokens.spacing.sm }}>
          <ComponentConfigGrid
            components={components}
            componentCatalog={componentCatalog}
            kpiCatalog={kpiCatalog}
            conversionCatalog={conversionCatalog}
            formulaCatalog={formulaCatalog}
            validationByRow={validationByRow}
            onAddComponent={onAddComponent}
            onRemoveComponent={onRemoveComponent}
            onUpdateComponent={onUpdateComponent}
          />
        </div>
      )}
    </Card>
  )
}

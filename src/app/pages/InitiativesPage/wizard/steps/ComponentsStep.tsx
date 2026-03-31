import { Card } from '../../../../components/ui/Card'
import { Section } from '../../../../components/ui/Section'
import { uiTokens } from '../../../../components/ui/tokens'
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
  loadingMessage?: string
  loadErrorMessage?: string | null
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
  loadingMessage,
  loadErrorMessage,
  onAddComponent,
  onRemoveComponent,
  onUpdateComponent,
}: ComponentsStepProps) {
  const validationByRow = Object.fromEntries(
    components.map((component, index) => [index, getInitiativeComponentDraftErrors(component, componentCatalog)]),
  )

  return (
    <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
      <Section
        title="2. Configuração dos Componentes"
        subtitle="Defina os componentes de valor utilizados na iniciativa. Direção e tipo de cálculo são inferidos do componente selecionado."
      >
        <div style={{ border: `1px solid ${uiTokens.colors.border}`, borderRadius: uiTokens.radius.md, padding: uiTokens.spacing.md }}>
          {isLoading ? (
            <p style={{ margin: 0, ...uiTokens.typography.body, color: uiTokens.colors.textMuted }}>
              {loadingMessage ?? 'Carregando componentes da iniciativa...'}
            </p>
          ) : (
            <>
              {loadErrorMessage ? (
                <p style={{ margin: `0 0 ${uiTokens.spacing.sm}px`, ...uiTokens.typography.caption, color: uiTokens.colors.dangerText }}>
                  {loadErrorMessage}
                </p>
              ) : null}
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
            </>
          )}
        </div>
      </Section>
    </Card>
  )
}

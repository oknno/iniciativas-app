import type { ConversionValueDto } from '../../../../../application/dto/catalogs/ConversionValueDto'
import type { ComponentMasterDto } from '../../../../../application/dto/catalogs/ComponentMasterDto'
import type { ConversionMasterDto } from '../../../../../application/dto/catalogs/ConversionMasterDto'
import type { KpiMasterDto } from '../../../../../application/dto/catalogs/KpiMasterDto'
import type { InitiativeComponentDraftDto } from '../../../../../application/mappers/initiatives/initiativeComponentMappers'
import type { MonthNumber, MonthlyInputMap } from '../../../../../application/mappers/initiatives/initiativeValueMappers'
import {
  buildConversionPreviewGroups,
  buildFixedValueGridRows,
  buildKpiValueGridRows,
} from '../../../../../application/mappers/initiatives/initiativeValueMappers'
import type { Scenario } from '../../../../../domain/initiatives/value-objects/Scenario'
import type { InitiativeId } from '../../../../../domain/initiatives/value-objects/InitiativeId'
import { Card } from '../../../../components/ui/Card'
import { Section } from '../../../../components/ui/Section'
import { uiTokens } from '../../../../components/ui/tokens'
import { ConversionPreviewPanel } from '../sections/ConversionPreviewPanel'
import { FixedValuesGrid } from '../sections/FixedValuesGrid'
import { KpiValuesGrid } from '../sections/KpiValuesGrid'

type ValuesStepProps = {
  components: readonly InitiativeComponentDraftDto[]
  componentCatalog: readonly ComponentMasterDto[]
  kpiCatalog: readonly KpiMasterDto[]
  conversionCatalog: readonly ConversionMasterDto[]
  conversionValues: readonly ConversionValueDto[]
  year: number
  scenario: Scenario
  initiativeId?: InitiativeId
  isLoadingValues: boolean
  valuesLoadErrorMessage?: string | null
  isPreviewCalculating: boolean
  previewErrorMessage?: string | null
  kpiValuesByRow: Readonly<Record<string, MonthlyInputMap>>
  fixedValuesByRow: Readonly<Record<string, MonthlyInputMap>>
  onKpiValueChange: (rowSignature: string, month: MonthNumber, value: string) => void
  onFixedValueChange: (rowSignature: string, month: MonthNumber, value: string) => void
}

export function ValuesStep({
  components,
  componentCatalog,
  kpiCatalog,
  conversionCatalog,
  conversionValues,
  year,
  scenario,
  initiativeId,
  isLoadingValues,
  valuesLoadErrorMessage,
  isPreviewCalculating,
  previewErrorMessage,
  kpiValuesByRow,
  fixedValuesByRow,
  onKpiValueChange,
  onFixedValueChange,
}: ValuesStepProps) {
  const kpiRows = buildKpiValueGridRows(components, componentCatalog, kpiCatalog)
  const fixedRows = buildFixedValueGridRows(components, componentCatalog)
  const conversionGroups = buildConversionPreviewGroups(components, conversionCatalog, conversionValues, year, scenario, initiativeId)

  return (
    <div style={{ display: 'grid', gap: uiTokens.spacing.md }}>
      <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
        <Section title="3.1 Valores de KPI" subtitle={`Cenário: ${scenario} · Ano: ${year}`}>
          {isLoadingValues ? (
            <p style={{ margin: `0 0 ${uiTokens.spacing.sm}px`, ...uiTokens.typography.caption, color: uiTokens.colors.textMuted }}>
              Buscando valores mensais...
            </p>
          ) : null}
          {valuesLoadErrorMessage ? (
            <p style={{ margin: `0 0 ${uiTokens.spacing.sm}px`, ...uiTokens.typography.caption, color: uiTokens.colors.dangerText }}>
              {valuesLoadErrorMessage}
            </p>
          ) : null}
          <div style={{ border: `1px solid ${uiTokens.colors.border}`, borderRadius: uiTokens.radius.md, padding: uiTokens.spacing.sm }}>
            <KpiValuesGrid rows={kpiRows} valuesByRow={kpiValuesByRow} onValueChange={onKpiValueChange} />
          </div>
        </Section>
      </Card>

      <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
        <Section title="3.2 Valores Fixos" subtitle="Valores base para componentes fixos.">
          <div style={{ border: `1px solid ${uiTokens.colors.border}`, borderRadius: uiTokens.radius.md, padding: uiTokens.spacing.sm }}>
            <FixedValuesGrid rows={fixedRows} valuesByRow={fixedValuesByRow} onValueChange={onFixedValueChange} />
          </div>
        </Section>
      </Card>

      <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
        <Section title="3.3 Preview de Conversão" subtitle="Pré-visualização somente leitura dos fatores de conversão.">
          {isPreviewCalculating ? (
            <p style={{ margin: `0 0 ${uiTokens.spacing.sm}px`, ...uiTokens.typography.caption, color: uiTokens.colors.textMuted }}>
              Calculando preview...
            </p>
          ) : null}
          {previewErrorMessage ? (
            <p style={{ margin: `0 0 ${uiTokens.spacing.sm}px`, ...uiTokens.typography.caption, color: uiTokens.colors.dangerText }}>
              {previewErrorMessage}
            </p>
          ) : null}
          <div style={{ border: `1px solid ${uiTokens.colors.border}`, borderRadius: uiTokens.radius.md, padding: uiTokens.spacing.sm }}>
            <ConversionPreviewPanel groups={conversionGroups} />
          </div>
        </Section>
      </Card>
    </div>
  )
}

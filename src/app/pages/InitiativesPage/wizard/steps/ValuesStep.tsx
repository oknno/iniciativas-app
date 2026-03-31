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
  kpiValuesByRow,
  fixedValuesByRow,
  onKpiValueChange,
  onFixedValueChange,
}: ValuesStepProps) {
  const kpiRows = buildKpiValueGridRows(components, componentCatalog, kpiCatalog)
  const fixedRows = buildFixedValueGridRows(components, componentCatalog)
  const conversionGroups = buildConversionPreviewGroups(components, conversionCatalog, conversionValues, year, scenario)

  return (
    <div style={{ display: 'grid', gap: uiTokens.spacing.md }}>
      <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
        <Section title="3.1 KPI Values" subtitle={`Scenario: ${scenario} · Year: ${year}`}>
          <div style={{ border: `1px solid ${uiTokens.colors.border}`, borderRadius: uiTokens.radius.md, padding: uiTokens.spacing.sm }}>
            <KpiValuesGrid rows={kpiRows} valuesByRow={kpiValuesByRow} onValueChange={onKpiValueChange} />
          </div>
        </Section>
      </Card>

      <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
        <Section title="3.2 Fixed Values" subtitle="Valores base para componentes FIXED.">
          <div style={{ border: `1px solid ${uiTokens.colors.border}`, borderRadius: uiTokens.radius.md, padding: uiTokens.spacing.sm }}>
            <FixedValuesGrid rows={fixedRows} valuesByRow={fixedValuesByRow} onValueChange={onFixedValueChange} />
          </div>
        </Section>
      </Card>

      <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
        <Section title="3.3 Conversion Preview" subtitle="Pré-visualização somente leitura dos fatores de conversão.">
          <div style={{ border: `1px solid ${uiTokens.colors.border}`, borderRadius: uiTokens.radius.md, padding: uiTokens.spacing.sm }}>
            <ConversionPreviewPanel groups={conversionGroups} />
          </div>
        </Section>
      </Card>
    </div>
  )
}

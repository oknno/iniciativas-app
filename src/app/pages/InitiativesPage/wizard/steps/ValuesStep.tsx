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
      <Card style={{ borderColor: uiTokens.colors.borderStrong }}>
        <Section title="4. KPI Monthly Inputs" subtitle={`Scenario: ${scenario} · Year: ${year}`}>
          <KpiValuesGrid rows={kpiRows} valuesByRow={kpiValuesByRow} onValueChange={onKpiValueChange} />
        </Section>
      </Card>

      <Card style={{ borderColor: uiTokens.colors.borderStrong }}>
        <Section title="5. Fixed Component Inputs" subtitle="Enter base values for FIXED components. These are stored as independent inputs.">
          <FixedValuesGrid rows={fixedRows} valuesByRow={fixedValuesByRow} onValueChange={onFixedValueChange} />
        </Section>
      </Card>

      <Card style={{ borderColor: uiTokens.colors.borderStrong }}>
        <Section title="6. Conversion Preview (read-only)" subtitle="Conversion values used by KPI-based components grouped by conversion type.">
          <ConversionPreviewPanel groups={conversionGroups} />
        </Section>
      </Card>
    </div>
  )
}

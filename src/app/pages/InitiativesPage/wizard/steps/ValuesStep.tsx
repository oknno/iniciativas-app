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
import { tokens } from '../../../../components/ui/tokens'
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
    <div style={{ display: 'grid', gap: tokens.spacing.md }}>
      <Card>
        <h3 style={{ margin: 0, fontSize: 17, color: tokens.colors.textPrimary }}>Monthly KPI values</h3>
        <p style={{ margin: `${tokens.spacing.xs}px 0 ${tokens.spacing.md}px`, fontSize: 13, color: tokens.colors.textSecondary }}>
          Scenario: <strong>{scenario}</strong> · Year: <strong>{year}</strong>
        </p>
        <KpiValuesGrid rows={kpiRows} valuesByRow={kpiValuesByRow} onValueChange={onKpiValueChange} />
      </Card>

      <Card>
        <h3 style={{ margin: 0, fontSize: 17, color: tokens.colors.textPrimary }}>Monthly fixed component values</h3>
        <p style={{ margin: `${tokens.spacing.xs}px 0 ${tokens.spacing.md}px`, fontSize: 13, color: tokens.colors.textSecondary }}>
          Enter base values for FIXED components. These are stored as independent inputs.
        </p>
        <FixedValuesGrid rows={fixedRows} valuesByRow={fixedValuesByRow} onValueChange={onFixedValueChange} />
      </Card>

      <Card>
        <h3 style={{ margin: 0, fontSize: 17, color: tokens.colors.textPrimary }}>Conversion preview (read-only)</h3>
        <p style={{ margin: `${tokens.spacing.xs}px 0 ${tokens.spacing.md}px`, fontSize: 13, color: tokens.colors.textSecondary }}>
          Conversion values used by KPI-based components grouped by conversion type.
        </p>
        <ConversionPreviewPanel groups={conversionGroups} />
      </Card>
    </div>
  )
}

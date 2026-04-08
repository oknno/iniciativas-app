import type { ConversionValueDto } from '../../../../../application/dto/catalogs/ConversionValueDto'
import type { ComponentMasterDto } from '../../../../../application/dto/catalogs/ComponentMasterDto'
import type { ConversionMasterDto } from '../../../../../application/dto/catalogs/ConversionMasterDto'
import type { KpiMasterDto } from '../../../../../application/dto/catalogs/KpiMasterDto'
import type { InitiativeComponentDraftDto } from '../../../../../application/mappers/initiatives/initiativeComponentMappers'
import type { MonthNumber, MonthlyInputMap } from '../../../../../application/mappers/initiatives/initiativeValueMappers'
import {
  MONTHS,
  buildConversionValueGridRows,
  buildConversionPreviewGroups,
  buildFixedValueGridRows,
  buildKpiValueGridRows,
} from '../../../../../application/mappers/initiatives/initiativeValueMappers'
import type { InitiativeStatus } from '../../../../../domain/initiatives/entities/InitiativeStatus'
import type { UserRole } from '../../../../../domain/initiatives/services/initiativePolicy'
import type { Scenario } from '../../../../../domain/initiatives/value-objects/Scenario'
import type { InitiativeId } from '../../../../../domain/initiatives/value-objects/InitiativeId'
import { Card } from '../../../../components/ui/Card'
import { Section } from '../../../../components/ui/Section'
import { uiTokens } from '../../../../components/ui/tokens'
import { ConversionPreviewPanel } from '../sections/ConversionPreviewPanel'
import { ConversionValuesGrid } from '../sections/ConversionValuesGrid'
import { FixedValuesGrid } from '../sections/FixedValuesGrid'
import { KpiValuesGrid } from '../sections/KpiValuesGrid'

type ValuesStepProps = {
  components: readonly InitiativeComponentDraftDto[]
  componentCatalog: readonly ComponentMasterDto[]
  kpiCatalog: readonly KpiMasterDto[]
  conversionCatalog: readonly ConversionMasterDto[]
  conversionValues: readonly ConversionValueDto[]
  year: number | null
  scenario: Scenario | ''
  initiativeId?: InitiativeId
  isLoadingValues: boolean
  valuesLoadErrorMessage?: string | null
  isPreviewCalculating: boolean
  previewErrorMessage?: string | null
  initiativeStatus?: InitiativeStatus
  actorRole?: UserRole
  kpiValuesByRow: Readonly<Record<string, MonthlyInputMap>>
  fixedValuesByRow: Readonly<Record<string, MonthlyInputMap>>
  conversionValuesByRow: Readonly<Record<string, MonthlyInputMap>>
  onKpiValueChange: (rowSignature: string, month: MonthNumber, value: string) => void
  onFixedValueChange: (rowSignature: string, month: MonthNumber, value: string) => void
  onConversionValueChange: (rowSignature: string, month: MonthNumber, value: string) => void
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
  initiativeStatus,
  actorRole,
  kpiValuesByRow,
  fixedValuesByRow,
  conversionValuesByRow,
  onKpiValueChange,
  onFixedValueChange,
  onConversionValueChange,
}: ValuesStepProps) {
  const kpiRows = buildKpiValueGridRows(components, componentCatalog, kpiCatalog)
  const fixedRows = buildFixedValueGridRows(components, componentCatalog)
  const conversionGroups =
    year === null || scenario === ''
      ? []
      : buildConversionPreviewGroups(components, conversionCatalog, conversionValues, year, scenario, initiativeId)
  const conversionRows = buildConversionValueGridRows(components, conversionCatalog)
  const isCtrlLocalEditable = actorRole === 'CTRL_LOCAL' && initiativeStatus === 'IN_REVIEW_LOCAL'
  const canEditConversion = isCtrlLocalEditable || actorRole === 'DEV' || actorRole === 'ADMIN'
  const conversionMonthlyErrorsByRow = conversionRows.reduce<Record<string, readonly MonthNumber[]>>((acc, row) => {
    const rowValues = conversionValuesByRow[row.signature] ?? {}
    const invalidMonths = MONTHS.filter(({ month }) => {
      const rawValue = rowValues[month]
      if (!canEditConversion || rawValue === undefined || rawValue.trim() === '') {
        return false
      }

      return !Number.isFinite(Number(rawValue))
    }).map(({ month }) => month)

    if (invalidMonths.length > 0) {
      acc[row.signature] = invalidMonths
    }

    return acc
  }, {})

  console.log('[InitiativeWizard] Loaded conversion preview values:', conversionGroups)

  return (
    <div style={{ display: 'grid', gap: uiTokens.spacing.md }}>
      <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
        <Section title="3.1 Valores de KPI" subtitle={`Cenário: ${scenario || '-'} · Ano: ${year ?? '-'}`}>
          {year === null || scenario === '' ? (
            <p style={{ margin: `0 0 ${uiTokens.spacing.sm}px`, ...uiTokens.typography.caption, color: uiTokens.colors.warningText }}>
              Selecione ano e cenário na etapa inicial para carregar os valores.
            </p>
          ) : null}
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
        <Section
          title="3.3 Conversões por iniciativa"
          subtitle={
            canEditConversion
              ? 'CTRL_LOCAL, DEV e ADMIN podem editar fatores mensais no status de revisão local.'
              : 'Somente leitura. Edição disponível apenas para CTRL_LOCAL em revisão local (ou DEV/ADMIN).'
          }
        >
          {Object.keys(conversionMonthlyErrorsByRow).length > 0 ? (
            <p style={{ margin: `0 0 ${uiTokens.spacing.sm}px`, ...uiTokens.typography.caption, color: uiTokens.colors.dangerText }}>
              Existem valores de conversão mensais inválidos. Preencha apenas números.
            </p>
          ) : null}
          <div style={{ border: `1px solid ${uiTokens.colors.border}`, borderRadius: uiTokens.radius.md, padding: uiTokens.spacing.sm }}>
            <ConversionValuesGrid
              rows={conversionRows}
              valuesByRow={conversionValuesByRow}
              monthlyErrorsByRow={conversionMonthlyErrorsByRow}
              isEditable={canEditConversion}
              onValueChange={onConversionValueChange}
            />
          </div>
        </Section>
      </Card>

      <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
        <Section title="3.4 Preview de Conversão" subtitle="Pré-visualização somente leitura dos fatores de conversão.">
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

import type { ComponentMasterDto } from '../../../../../application/dto/catalogs/ComponentMasterDto'
import type { ConversionMasterDto } from '../../../../../application/dto/catalogs/ConversionMasterDto'
import type { FormulaMasterDto } from '../../../../../application/dto/catalogs/FormulaMasterDto'
import type { KpiMasterDto } from '../../../../../application/dto/catalogs/KpiMasterDto'
import type { InitiativeComponentDraftDto } from '../../../../../application/mappers/initiatives/initiativeComponentMappers'
import { asConversionCode } from '../../../../../domain/catalogs/value-objects/ConversionCode'
import { asFormulaCode } from '../../../../../domain/catalogs/value-objects/FormulaCode'
import { asKpiCode } from '../../../../../domain/catalogs/value-objects/KpiCode'
import { tokens } from '../../../../components/ui/tokens'

type ComponentConfigGridProps = {
  components: readonly InitiativeComponentDraftDto[]
  componentCatalog: readonly ComponentMasterDto[]
  kpiCatalog: readonly KpiMasterDto[]
  conversionCatalog: readonly ConversionMasterDto[]
  formulaCatalog: readonly FormulaMasterDto[]
  validationByRow: Readonly<Record<number, readonly string[]>>
  onAddComponent: () => void
  onRemoveComponent: (index: number) => void
  onUpdateComponent: (index: number, patch: Partial<InitiativeComponentDraftDto>) => void
}

const cellInputStyle = {
  width: '100%',
  border: `1px solid ${tokens.colors.borderStrong}`,
  borderRadius: tokens.radius.sm,
  fontSize: 13,
  color: tokens.colors.textPrimary,
  padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
  background: '#ffffff',
} as const

const actionButtonStyle = {
  border: `1px solid ${tokens.colors.borderStrong}`,
  borderRadius: tokens.radius.sm,
  background: '#ffffff',
  padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  color: tokens.colors.textPrimary,
} as const

export function ComponentConfigGrid({
  components,
  componentCatalog,
  kpiCatalog,
  conversionCatalog,
  formulaCatalog,
  validationByRow,
  onAddComponent,
  onRemoveComponent,
  onUpdateComponent,
}: ComponentConfigGridProps) {
  if (components.length === 0) {
    return (
      <div style={{ display: 'grid', gap: tokens.spacing.sm }}>
        <div
          style={{
            border: `1px dashed ${tokens.colors.borderStrong}`,
            borderRadius: tokens.radius.md,
            padding: tokens.spacing.md,
            color: tokens.colors.textSecondary,
            fontSize: 13,
            background: '#f8fafc',
          }}
        >
          No components configured yet. Add at least one component to start the value engine setup.
        </div>
        <div>
          <button type="button" onClick={onAddComponent} style={actionButtonStyle}>
            Add component
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: tokens.spacing.sm }}>
      <div style={{ overflowX: 'auto', border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr .7fr .8fr 1fr 1fr 1fr auto',
            gap: tokens.spacing.sm,
            fontSize: 12,
            color: tokens.colors.textMuted,
            padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
            borderBottom: `1px solid ${tokens.colors.border}`,
            background: tokens.colors.surfaceMuted,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.3,
          }}
        >
          <span>Component Type</span>
          <span>Direction</span>
          <span>Calc Type</span>
          <span>KPI</span>
          <span>Conversion</span>
          <span>Formula</span>
          <span />
        </div>

        {components.map((component, index) => {
          const selectedCatalog = componentCatalog.find((catalogItem) => catalogItem.code === component.componentCode)
          const calculationType = selectedCatalog?.defaultCalculationType ?? component.calculationType
          const isKpiBased = calculationType === 'KPI_BASED'
          const validationErrors = validationByRow[index] ?? []

          return (
            <div
              key={`${component.id ?? 'new'}-${index}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.3fr .7fr .8fr 1fr 1fr 1fr auto',
                gap: tokens.spacing.sm,
                padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
                borderBottom: `1px solid ${tokens.colors.border}`,
                alignItems: 'start',
                background: index % 2 === 0 ? '#ffffff' : '#fbfcfe',
              }}
            >
              <div style={{ display: 'grid', gap: 6 }}>
                <select
                  style={cellInputStyle}
                  value={component.componentCode}
                  onChange={(event) => onUpdateComponent(index, { componentCode: event.target.value })}
                >
                  <option value="">Select component</option>
                  {componentCatalog.map((catalogItem) => (
                    <option key={catalogItem.code} value={catalogItem.code}>
                      {catalogItem.name}
                    </option>
                  ))}
                </select>
                {validationErrors.length > 0 ? (
                  <span style={{ fontSize: 12, color: tokens.colors.dangerText }}>{validationErrors[0]}</span>
                ) : null}
              </div>

              <span style={{ fontSize: 13, color: tokens.colors.textSecondary, padding: `${tokens.spacing.xs}px 0` }}>
                {selectedCatalog ? (selectedCatalog.defaultDirection === 1 ? 'Positive' : 'Negative') : '-'}
              </span>

              <span style={{ fontSize: 13, color: tokens.colors.textSecondary, padding: `${tokens.spacing.xs}px 0` }}>
                {selectedCatalog ? (selectedCatalog.defaultCalculationType === 'KPI_BASED' ? 'KPI Based' : 'Fixed') : '-'}
              </span>

              <select
                style={{ ...cellInputStyle, background: isKpiBased ? '#ffffff' : '#f1f5f9' }}
                value={component.kpiCode ?? ''}
                onChange={(event) => onUpdateComponent(index, { kpiCode: event.target.value ? asKpiCode(event.target.value) : undefined })}
                disabled={!isKpiBased}
              >
                <option value="">Select KPI</option>
                {kpiCatalog.map((kpi) => (
                  <option key={kpi.code} value={kpi.code}>
                    {kpi.name}
                  </option>
                ))}
              </select>

              <select
                style={{ ...cellInputStyle, background: isKpiBased ? '#ffffff' : '#f1f5f9' }}
                value={component.conversionCode ?? ''}
                onChange={(event) => onUpdateComponent(index, { conversionCode: event.target.value ? asConversionCode(event.target.value) : undefined })}
                disabled={!isKpiBased}
              >
                <option value="">Select conversion</option>
                {conversionCatalog.map((conversion) => (
                  <option key={conversion.code} value={conversion.code}>
                    {conversion.name}
                  </option>
                ))}
              </select>

              <select
                style={cellInputStyle}
                value={component.formulaCode ?? ''}
                onChange={(event) => onUpdateComponent(index, { formulaCode: event.target.value ? asFormulaCode(event.target.value) : undefined })}
              >
                <option value="">Select formula</option>
                {formulaCatalog.map((formula) => (
                  <option key={formula.code} value={formula.code}>
                    {formula.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => onRemoveComponent(index)}
                style={{
                  border: `1px solid ${tokens.colors.borderStrong}`,
                  borderRadius: tokens.radius.sm,
                  background: '#ffffff',
                  padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
                  fontSize: 12,
                  cursor: 'pointer',
                  color: tokens.colors.textSecondary,
                }}
              >
                Remove
              </button>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button type="button" onClick={onAddComponent} style={actionButtonStyle}>
          Add component
        </button>
      </div>
    </div>
  )
}

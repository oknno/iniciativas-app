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

const toFriendlyValidationMessage = (message: string): string => {
  if (message === 'Component type is required.') {
    return 'Selecione o componente.'
  }

  if (message === 'Formula is required.') {
    return 'Selecione a fórmula.'
  }

  if (message === 'KPI is required for KPI based components.') {
    return 'Selecione o KPI do componente.'
  }

  if (message === 'Conversion is required for KPI based components.') {
    return 'Selecione a conversão do componente.'
  }

  return 'Revise a configuração deste componente.'
}

const cellInputStyle = {
  width: '100%',
  border: `1px solid ${tokens.colors.borderStrong}`,
  borderRadius: tokens.radius.sm,
  fontSize: 13,
  color: tokens.colors.textPrimary,
  height: 34,
  padding: `0 ${tokens.spacing.sm}px`,
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
          Nenhum componente configurado. Adicione pelo menos um componente para continuar.
        </div>
        <div>
          <button type="button" onClick={onAddComponent} style={actionButtonStyle}>
            Adicionar componente
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
            gridTemplateColumns: 'minmax(180px, 1.3fr) minmax(90px, .7fr) minmax(90px, .8fr) minmax(140px, 1fr) minmax(140px, 1fr) minmax(140px, 1fr) auto',
            gap: tokens.spacing.sm,
            fontSize: 12,
            color: tokens.colors.textMuted,
            padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
            borderBottom: `1px solid ${tokens.colors.border}`,
            background: tokens.colors.surfaceMuted,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.3,
          }}
        >
          <span>Componente</span>
          <span>Direção</span>
          <span>Tipo cálculo</span>
          <span>KPI</span>
          <span>Conversão</span>
          <span>Fórmula</span>
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
                gridTemplateColumns: 'minmax(180px, 1.3fr) minmax(90px, .7fr) minmax(90px, .8fr) minmax(140px, 1fr) minmax(140px, 1fr) minmax(140px, 1fr) auto',
                gap: tokens.spacing.sm,
                padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                borderBottom: `1px solid ${tokens.colors.border}`,
                alignItems: 'center',
                background: index % 2 === 0 ? '#ffffff' : '#fbfcfe',
              }}
            >
              <div style={{ display: 'grid', gap: 6 }}>
                <select
                  style={cellInputStyle}
                  value={component.componentCode}
                  onChange={(event) => onUpdateComponent(index, { componentCode: event.target.value })}
                >
                  <option value="">Selecione um componente</option>
                  {componentCatalog.map((catalogItem) => (
                    <option key={catalogItem.code} value={catalogItem.code}>
                      {catalogItem.name}
                    </option>
                  ))}
                </select>
                {validationErrors.length > 0 ? (
                  <span style={{ fontSize: 12, color: tokens.colors.dangerText }}>
                    {toFriendlyValidationMessage(validationErrors[0])}
                  </span>
                ) : null}
              </div>

              <span style={{ fontSize: 13, color: tokens.colors.textSecondary }}>
                {selectedCatalog ? (selectedCatalog.defaultDirection === 1 ? 'Positiva' : 'Negativa') : '-'}
              </span>

              <span style={{ fontSize: 13, color: tokens.colors.textSecondary }}>
                {selectedCatalog ? (selectedCatalog.defaultCalculationType === 'KPI_BASED' ? 'KPI' : 'Fixo') : '-'}
              </span>

              <select
                style={{ ...cellInputStyle, background: isKpiBased ? '#ffffff' : '#f3f4f6', color: isKpiBased ? tokens.colors.textPrimary : tokens.colors.textSecondary }}
                value={component.kpiCode ?? ''}
                onChange={(event) => onUpdateComponent(index, { kpiCode: event.target.value ? asKpiCode(event.target.value) : undefined })}
                disabled={!isKpiBased}
              >
                <option value="">Selecione um KPI</option>
                {kpiCatalog.map((kpi) => (
                  <option key={kpi.code} value={kpi.code}>
                    {kpi.name}
                  </option>
                ))}
              </select>

              <select
                style={{ ...cellInputStyle, background: isKpiBased ? '#ffffff' : '#f3f4f6', color: isKpiBased ? tokens.colors.textPrimary : tokens.colors.textSecondary }}
                value={component.conversionCode ?? ''}
                onChange={(event) => onUpdateComponent(index, { conversionCode: event.target.value ? asConversionCode(event.target.value) : undefined })}
                disabled={!isKpiBased}
              >
                <option value="">Selecione uma conversão</option>
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
                <option value="">Selecione uma fórmula</option>
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
                  height: 34,
                  padding: `0 ${tokens.spacing.sm}px`,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: tokens.colors.textSecondary,
                }}
              >
                Remover
              </button>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button type="button" onClick={onAddComponent} style={actionButtonStyle}>
          Adicionar componente
        </button>
      </div>
    </div>
  )
}

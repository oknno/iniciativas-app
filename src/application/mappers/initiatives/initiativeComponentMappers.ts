import type { ComponentMasterDto } from '../../dto/catalogs/ComponentMasterDto'
import type { SaveInitiativeComponentDto } from '../../dto/initiatives/SaveInitiativeComponentDto'
import type { CalculationType } from '../../../domain/catalogs/value-objects/CalculationType'
import type { ConversionCode } from '../../../domain/catalogs/value-objects/ConversionCode'
import type { FormulaCode } from '../../../domain/catalogs/value-objects/FormulaCode'
import type { KpiCode } from '../../../domain/catalogs/value-objects/KpiCode'
import type { InitiativeComponent } from '../../../domain/initiatives/entities/InitiativeComponent'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'

export interface InitiativeComponentDraftDto {
  readonly id?: string
  readonly componentCode: string
  readonly calculationType: CalculationType
  readonly direction: 1 | -1
  readonly componentType: InitiativeComponent['componentType']
  readonly kpiCode?: KpiCode
  readonly conversionCode?: ConversionCode
  readonly formulaCode?: FormulaCode
  readonly sortOrder: number
}

const resolveCatalogComponent = (
  draft: InitiativeComponentDraftDto,
  componentCatalog: readonly ComponentMasterDto[],
): ComponentMasterDto | undefined =>
  componentCatalog.find((component) => component.componentType === (draft.componentCode || draft.componentType)) ??
  componentCatalog.find((component) => component.componentType === draft.componentType) ??
  componentCatalog.find((component) => component.code === draft.componentCode)

export const toInitiativeComponentDraftDto = (
  component: InitiativeComponent,
  componentCatalog: readonly ComponentMasterDto[],
): InitiativeComponentDraftDto => {
  const byType = componentCatalog.find((catalogComponent) => catalogComponent.componentType === component.componentType)
  const byCode = componentCatalog.find((catalogComponent) => catalogComponent.code === component.componentType)
  const catalogMatch = byType ?? byCode

  console.log('[InitiativeComponentMapper] Catalog match for component type:', {
    componentType: component.componentType,
    matched: Boolean(catalogMatch),
    catalogComponentType: catalogMatch?.componentType,
  })

  return {
    id: component.id,
    componentCode: catalogMatch?.code ?? component.componentType,
    calculationType: catalogMatch?.defaultCalculationType ?? component.calculationType,
    direction: catalogMatch?.defaultDirection ?? component.direction,
    componentType: catalogMatch?.componentType ?? component.componentType,
    kpiCode: component.kpiCode,
    conversionCode: component.conversionCode,
    formulaCode: component.formulaCode,
    sortOrder: component.sortOrder,
  }
}

export const toSaveInitiativeComponentDto = (
  draft: InitiativeComponentDraftDto,
  initiativeId: InitiativeId,
  componentCatalog: readonly ComponentMasterDto[],
  sortOrder: number,
): SaveInitiativeComponentDto => {
  const catalogComponent = resolveCatalogComponent(draft, componentCatalog)

  if (!catalogComponent) {
    throw new Error('Component type is required.')
  }

  return {
    id: draft.id,
    initiativeId,
    name: catalogComponent.name,
    componentType: catalogComponent.componentType,
    direction: draft.direction,
    calculationType: draft.calculationType,
    kpiCode: draft.calculationType === 'KPI_BASED' ? draft.kpiCode : undefined,
    conversionCode: draft.calculationType === 'KPI_BASED' ? draft.conversionCode : undefined,
    formulaCode: draft.formulaCode,
    sortOrder,
  }
}

export const getInitiativeComponentDraftErrors = (
  draft: InitiativeComponentDraftDto,
  componentCatalog: readonly ComponentMasterDto[],
): readonly string[] => {
  const errors: string[] = []
  const catalogComponent = resolveCatalogComponent(draft, componentCatalog)

  if (!catalogComponent) {
    errors.push('Component type is required.')
    return errors
  }

  if (!draft.formulaCode) {
    errors.push('Formula is required.')
  }

  if (draft.calculationType === 'KPI_BASED') {
    if (!draft.kpiCode) {
      errors.push('KPI is required for KPI based components.')
    }

    if (!draft.conversionCode) {
      errors.push('Conversion is required for KPI based components.')
    }
  }

  return errors
}

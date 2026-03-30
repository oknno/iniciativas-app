import type { SaveInitiativeComponentDto } from '../../../application/dto/initiatives/SaveInitiativeComponentDto'
import type { InitiativeComponent } from '../../../domain/initiatives/entities/InitiativeComponent'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import { asConversionCode } from '../../../domain/catalogs/value-objects/ConversionCode'
import { asFormulaCode } from '../../../domain/catalogs/value-objects/FormulaCode'
import { asKpiCode } from '../../../domain/catalogs/value-objects/KpiCode'
import { asInitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

let nextComponentId = 3

const newComponentId = (): string => {
  const id = `COMP-${String(nextComponentId).padStart(3, '0')}`
  nextComponentId += 1
  return id
}

let initiativeComponentsState: Record<string, InitiativeComponent[]> = {
  'INIT-001': [
    {
      id: 'COMP-001',
      initiativeId: asInitiativeId('INIT-001'),
      name: 'Energy Savings',
      componentType: 'ENERGY',
      direction: 1,
      calculationType: 'KPI_BASED',
      kpiCode: asKpiCode('KPI-KWH-SAVED'),
      conversionCode: asConversionCode('CONV-KWH-USD'),
      formulaCode: asFormulaCode('FORMULA-LINEAR-DEFAULT'),
      sortOrder: 1,
    },
    {
      id: 'COMP-002',
      initiativeId: asInitiativeId('INIT-001'),
      name: 'Implementation Cost',
      componentType: 'OTHER',
      direction: -1,
      calculationType: 'FIXED',
      formulaCode: asFormulaCode('FORMULA-LINEAR-DEFAULT'),
      sortOrder: 2,
    },
  ],
}

const cloneComponent = (component: InitiativeComponent): InitiativeComponent => structuredClone(component)

export const initiativeComponentsRepository = {
  async listByInitiativeId(initiativeId: InitiativeId): Promise<readonly InitiativeComponent[]> {
    await wait(80)
    return (initiativeComponentsState[initiativeId] ?? []).map(cloneComponent)
  },

  async saveByInitiativeId(
    initiativeId: InitiativeId,
    components: readonly SaveInitiativeComponentDto[],
  ): Promise<readonly InitiativeComponent[]> {
    await wait(120)

    const nextState = components
      .slice()
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map<InitiativeComponent>((component, index) => ({
        id: component.id ?? newComponentId(),
        initiativeId,
        name: component.name,
        componentType: component.componentType,
        direction: component.direction,
        calculationType: component.calculationType,
        kpiCode: component.kpiCode,
        conversionCode: component.conversionCode,
        formulaCode: component.formulaCode,
        fixedValue: component.fixedValue,
        sortOrder: index + 1,
      }))

    initiativeComponentsState = {
      ...initiativeComponentsState,
      [initiativeId]: nextState,
    }

    return nextState.map(cloneComponent)
  },
}

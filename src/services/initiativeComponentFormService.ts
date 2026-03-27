import type { ComponentMaster } from '../types/component'
import type { FormulaMaster } from '../types/formula'
import type { ComponentTypeCode } from '../types/component'

export interface InitiativeComponentFormState {
  componentType: ComponentTypeCode
  kpiCode: string
  conversionCode: string
  formulaCode: string
}

export const INITIAL_COMPONENT_FORM_STATE: InitiativeComponentFormState = {
  componentType: 'FTE_SAVING',
  kpiCode: '',
  conversionCode: '',
  formulaCode: 'MULTIPLIER',
}

function isFixedComponent(componentType: ComponentTypeCode, componentCatalog: ComponentMaster[]): boolean {
  const component = componentCatalog.find((item) => item.componentType === componentType)
  return component?.calculationType === 'FIXED'
}

export function normalizeComponentFormState(
  state: InitiativeComponentFormState,
  componentCatalog: ComponentMaster[],
): InitiativeComponentFormState {
  if (isFixedComponent(state.componentType, componentCatalog)) {
    return {
      ...state,
      formulaCode: 'DIRECT_VALUE',
      kpiCode: '',
      conversionCode: '',
    }
  }

  if (state.formulaCode === 'DIRECT_VALUE') {
    return {
      ...state,
      formulaCode: 'MULTIPLIER',
    }
  }

  return state
}

export function validateComponentForm(
  data: InitiativeComponentFormState,
  componentCatalog: ComponentMaster[],
): string | null {
  const isFixed = isFixedComponent(data.componentType, componentCatalog)

  if (!isFixed) {
    if (!data.kpiCode) {
      return 'Componentes KPI_BASED exigem KPI.'
    }

    if (!data.conversionCode) {
      return 'Componentes KPI_BASED exigem conversão.'
    }

    if (data.formulaCode !== 'MULTIPLIER') {
      return 'Componentes KPI_BASED exigem fórmula MULTIPLIER na PoC.'
    }
  }

  if (isFixed && data.formulaCode !== 'DIRECT_VALUE') {
    return 'Componentes FIXED exigem fórmula DIRECT_VALUE.'
  }

  return null
}

export function getAvailableFormulas(
  formState: InitiativeComponentFormState,
  formulas: FormulaMaster[],
  componentCatalog: ComponentMaster[],
): FormulaMaster[] {
  if (!isFixedComponent(formState.componentType, componentCatalog)) {
    return formulas.filter((formula) => formula.code === 'MULTIPLIER')
  }

  return formulas.filter((formula) => formula.code === 'DIRECT_VALUE')
}

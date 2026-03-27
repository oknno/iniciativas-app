import type { FormulaMaster } from '../types/formula'
import type { InitiativeComponentType } from '../types/initiativeComponent'

export interface InitiativeComponentFormState {
  componentType: InitiativeComponentType
  kpiCode: string
  conversionCode: string
  formulaCode: string
}

export const INITIAL_COMPONENT_FORM_STATE: InitiativeComponentFormState = {
  componentType: 'KPI_BASED',
  kpiCode: '',
  conversionCode: '',
  formulaCode: 'MULTIPLIER',
}

export function normalizeComponentFormState(
  state: InitiativeComponentFormState,
): InitiativeComponentFormState {
  if (state.componentType === 'FIXED') {
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
): string | null {
  if (data.componentType === 'KPI_BASED') {
    if (!data.kpiCode) {
      return 'Componentes KPI_BASED exigem kpiCode.'
    }

    if (!data.conversionCode) {
      return 'Componentes KPI_BASED exigem conversionCode.'
    }

    if (data.formulaCode !== 'MULTIPLIER') {
      return 'Componentes KPI_BASED exigem formulaCode=MULTIPLIER na PoC.'
    }
  }

  if (data.componentType === 'FIXED' && data.formulaCode !== 'DIRECT_VALUE') {
    return 'Componentes FIXED exigem formulaCode=DIRECT_VALUE.'
  }

  return null
}

export function getAvailableFormulas(
  formState: InitiativeComponentFormState,
  formulas: FormulaMaster[],
): FormulaMaster[] {
  if (formState.componentType === 'KPI_BASED') {
    return formulas.filter((formula) => formula.code === 'MULTIPLIER')
  }

  return formulas.filter((formula) => formula.code === 'DIRECT_VALUE')
}

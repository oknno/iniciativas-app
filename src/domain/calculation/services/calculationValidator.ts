import type { InitiativeComponent } from '../../initiatives/entities/InitiativeComponent'
import { isFormulaSupportedForCalculationType, resolveSupportedFormula } from '../rules/formulaRules'

export const validateComponentConfiguration = (component: InitiativeComponent): readonly string[] => {
  const errors: string[] = []

  if (!component.formulaCode) {
    errors.push(`Missing formula for component ${component.name}`)
    return errors
  }

  const formula = resolveSupportedFormula(component.formulaCode)
  if (!formula) {
    errors.push(`Unsupported formula ${component.formulaCode} for component ${component.name}`)
    return errors
  }

  if (!isFormulaSupportedForCalculationType(component.calculationType, formula)) {
    errors.push(`Unsupported formula/calculation type combination for component ${component.name}`)
  }

  if (component.calculationType === 'KPI_BASED') {
    if (!component.kpiCode) {
      errors.push(`Missing KPI reference for component ${component.name}`)
    }
    if (!component.conversionCode) {
      errors.push(`Missing conversion reference for component ${component.name}`)
    }
  }

  return errors
}

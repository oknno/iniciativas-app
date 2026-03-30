import type { InitiativeComponent } from '../../initiatives/entities/InitiativeComponent'

export const explainKpiMultiplier = (component: InitiativeComponent): string => {
  if (!component.kpiCode || !component.conversionCode) {
    return `Missing references for ${component.name}`
  }

  return `${component.kpiCode} × ${component.conversionCode}`
}

export const explainFixedValue = (component: InitiativeComponent): string =>
  `Direct fixed value for ${component.componentType}`

export const explainMissingConversion = (conversionCode: string): string =>
  `Missing conversion value for ${conversionCode}`

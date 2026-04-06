import type { InitiativeComponentListItem } from '../../src/services/sharepoint/lists/initiativeComponentsListApi'
import type { CreateInitiativeComponentPayload } from '../../src/services/sharepoint/lists/initiativeComponentsListApi'
import type { CalculationDetailListItem } from '../../src/services/sharepoint/lists/calculationDetailsListApi'

export const initiativeComponentLookupFixture: InitiativeComponentListItem = {
  Id: 501,
  InitiativeIdId: 100,
  Title: 'Aumento de receita',
  ComponentId: 'REVENUE_DELTA',
  SortOrder: 1,
  Direction: -1,
  CalculationType: 'KPI_BASED',
  ComponentType: {
    Id: 10,
    Title: 'Receita',
    ComponentType: 'REVENUE',
  },
  KPICode: {
    Id: 20,
    KPICode: 'KPI_REV',
  },
  ConversionCode: {
    Id: 30,
    ConversionCode: 'CONV_REV',
  },
  FormulaCode: {
    Id: 40,
    FormulaCode: 'F_REV',
  },
}

export const createInitiativeComponentPayloadFixture = {
  componentTypeId: 10,
  kpiCodeId: 20,
  conversionCodeId: 30,
  formulaCodeId: 40,
} as const

export const expectedInitiativeComponentCreatePayload: Omit<CreateInitiativeComponentPayload, 'InitiativeIdId'> = {
  ComponentId: 'REVENUE_DELTA',
  Title: 'Aumento de receita',
  ComponentTypeId: 10,
  KPICodeId: 20,
  ConversionCodeId: 30,
  FormulaCodeId: 40,
  Direction: -1,
  CalculationType: 'KPI_BASED',
}

export const calculationDetailFixture: CalculationDetailListItem = {
  Id: 901,
  InitiativeIdId: 100,
  InitiativeId: 100,
  ComponentType: 'REVENUE',
  CalculationType: 'KPI_BASED',
  Direction: -1,
  KPICode: 'KPI_REV',
  ConversionCode: 'CONV_REV',
  Year: 2026,
  Month: 1,
  BaseValue: 10,
  ConversionValue: 2,
  ResultValue: 20,
}

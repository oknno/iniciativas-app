import type { InitiativeDetailDto } from '../../../../application/dto/initiatives/InitiativeDetailDto'
import type { InitiativeListItemDto } from '../../../../application/dto/initiatives/InitiativeListItemDto'
import { asConversionCode } from '../../../../domain/catalogs/value-objects/ConversionCode'
import { asFormulaCode } from '../../../../domain/catalogs/value-objects/FormulaCode'
import { asKpiCode } from '../../../../domain/catalogs/value-objects/KpiCode'
import { asInitiativeId } from '../../../../domain/initiatives/value-objects/InitiativeId'

export const mockInitiativeList: readonly InitiativeListItemDto[] = [
  {
    id: asInitiativeId('INIT-001'),
    unidade: 'CAP-001',
    title: 'Plant Energy Optimization',
    responsavel: 'Maria Gomez',
    stage: 'ASSESSMENT',
    status: 'IN_REVIEW',
    annualGain: 780000,
  },
  {
    id: asInitiativeId('INIT-002'),
    unidade: 'CAP-002',
    title: 'Supplier Rebate Redesign',
    responsavel: 'David Singh',
    stage: 'VALIDATION',
    status: 'APPROVED',
    annualGain: 520000,
  },
  {
    id: asInitiativeId('INIT-003'),
    unidade: 'CAP-003',
    title: 'Packaging Material Right-sizing',
    responsavel: 'Nina Patel',
    stage: 'DRAFTING',
    status: 'DRAFT',
    annualGain: 245000,
  },
]

export const mockInitiativeDetails: readonly InitiativeDetailDto[] = [
  {
    id: asInitiativeId('INIT-001'),
    unidade: 'CAP-001',
    title: 'Plant Energy Optimization',
    responsavel: 'Maria Gomez',
    stage: 'ASSESSMENT',
    status: 'IN_REVIEW',
    annualGain: 780000,
    components: [
      {
        id: 'COMP-001',
        initiativeId: asInitiativeId('INIT-001'),
        name: 'Electricity savings',
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
        name: 'One-time implementation',
        componentType: 'OTHER',
        direction: -1,
        calculationType: 'FIXED',
        fixedValue: 265000,
        sortOrder: 2,
      },
    ],
  },
]

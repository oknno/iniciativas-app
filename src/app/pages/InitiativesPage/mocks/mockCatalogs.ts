import type { ComponentMasterDto } from '../../../../application/dto/catalogs/ComponentMasterDto'
import type { ConversionMasterDto } from '../../../../application/dto/catalogs/ConversionMasterDto'
import type { ConversionValueDto } from '../../../../application/dto/catalogs/ConversionValueDto'
import type { FormulaMasterDto } from '../../../../application/dto/catalogs/FormulaMasterDto'
import type { KpiMasterDto } from '../../../../application/dto/catalogs/KpiMasterDto'
import { asConversionCode } from '../../../../domain/catalogs/value-objects/ConversionCode'
import { asFormulaCode } from '../../../../domain/catalogs/value-objects/FormulaCode'
import { asKpiCode } from '../../../../domain/catalogs/value-objects/KpiCode'

export const mockComponentCatalog: readonly ComponentMasterDto[] = [
  {
    code: 'CMP-ENERGY-SAVINGS',
    name: 'Energy Savings',
    componentType: 'ENERGY',
    defaultDirection: 1,
    defaultCalculationType: 'KPI_BASED',
    active: true,
  },
  {
    code: 'CMP-MATERIAL-REDUCTION',
    name: 'Material Reduction',
    componentType: 'MATERIAL',
    defaultDirection: 1,
    defaultCalculationType: 'KPI_BASED',
    active: true,
  },
  {
    code: 'CMP-IMPLEMENTATION-COST',
    name: 'Implementation Cost',
    componentType: 'OTHER',
    defaultDirection: -1,
    defaultCalculationType: 'FIXED',
    active: true,
  },
]

export const mockKpiCatalog: readonly KpiMasterDto[] = [
  { code: asKpiCode('KPI-KWH-SAVED'), name: 'kWh Saved', unit: 'kWh', active: true },
  { code: asKpiCode('KPI-TON-MATERIAL'), name: 'Material Reduced', unit: 'ton', active: true },
]

export const mockConversionCatalog: readonly ConversionMasterDto[] = [
  {
    code: asConversionCode('CONV-KWH-USD'),
    name: 'kWh to USD',
    sourceUnit: 'kWh',
    targetUnit: 'USD',
    active: true,
  },
  {
    code: asConversionCode('CONV-TON-USD'),
    name: 'Ton to USD',
    sourceUnit: 'ton',
    targetUnit: 'USD',
    active: true,
  },
]

export const mockFormulaCatalog: readonly FormulaMasterDto[] = [
  {
    code: asFormulaCode('FORMULA-LINEAR-DEFAULT'),
    name: 'Linear default',
    formulaType: 'LINEAR',
    expression: 'value',
    active: true,
  },
]

export const mockConversionValues: readonly ConversionValueDto[] = [
  {
    conversionCode: asConversionCode('CONV-KWH-USD'),
    monthRef: '2026-01',
    scenario: 'BASE',
    value: 0.14,
  },
  {
    conversionCode: asConversionCode('CONV-TON-USD'),
    monthRef: '2026-01',
    scenario: 'BASE',
    value: 34,
  },
]

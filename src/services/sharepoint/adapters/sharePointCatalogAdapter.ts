import type { ComponentMasterDto } from '../../../application/dto/catalogs/ComponentMasterDto'
import type { ConversionMasterDto } from '../../../application/dto/catalogs/ConversionMasterDto'
import type { ConversionValueDto } from '../../../application/dto/catalogs/ConversionValueDto'
import type { FormulaMasterDto } from '../../../application/dto/catalogs/FormulaMasterDto'
import type { KpiMasterDto } from '../../../application/dto/catalogs/KpiMasterDto'
import { asConversionCode } from '../../../domain/catalogs/value-objects/ConversionCode'
import { asFormulaCode } from '../../../domain/catalogs/value-objects/FormulaCode'
import { asKpiCode } from '../../../domain/catalogs/value-objects/KpiCode'
import { asInitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { ComponentMasterListItem } from '../lists/componentMasterListApi'
import type { ConversionMasterListItem } from '../lists/conversionMasterListApi'
import type { ConversionValueListItem } from '../lists/conversionValuesListApi'
import type { FormulaMasterListItem } from '../lists/formulaMasterListApi'
import type { FormulaTermListItem } from '../lists/formulaTermsListApi'
import type { KpiMasterListItem } from '../lists/kpiMasterListApi'
import type { FormulaTerm } from '../../../domain/catalogs/entities/FormulaTerm'

const toMonthRef = (year: number, month: number): ConversionValueDto['monthRef'] =>
  `${year}-${String(month).padStart(2, '0')}` as ConversionValueDto['monthRef']

export const fromSharePointComponentCatalog = (item: ComponentMasterListItem): ComponentMasterDto => ({
  code: item.ComponentType,
  name: item.Title,
  componentType: item.ComponentType as ComponentMasterDto['componentType'],
  defaultDirection: item.Direction as ComponentMasterDto['defaultDirection'],
  defaultCalculationType: item.CalculationType as ComponentMasterDto['defaultCalculationType'],
  active: true,
})

export const fromSharePointKpiCatalog = (item: KpiMasterListItem): KpiMasterDto => ({
  code: asKpiCode(item.KPICode),
  name: item.Title,
  unit: item.Unit,
  active: true,
})

export const fromSharePointConversionCatalog = (item: ConversionMasterListItem): ConversionMasterDto => ({
  code: asConversionCode(item.ConversionCode),
  name: item.Title,
  sourceUnit: item.Unit,
  targetUnit: item.Unit,
  active: true,
})

export const fromSharePointFormulaCatalog = (item: FormulaMasterListItem): FormulaMasterDto => ({
  code: asFormulaCode(item.FormulaCode),
  name: item.Title,
  formulaType: item.FormulaType as FormulaMasterDto['formulaType'],
  expression: item.Title,
  active: true,
})

export const fromSharePointConversionValue = (item: ConversionValueListItem): ConversionValueDto => ({
  conversionCode: asConversionCode(item.ConversionCode),
  initiativeId: item.InitiativeId !== undefined && item.InitiativeId !== null ? asInitiativeId(String(item.InitiativeId)) : undefined,
  monthRef: toMonthRef(item.Year, item.Month),
  scenario: (item.Scenario ?? 'BASE') as ConversionValueDto['scenario'],
  value: Number(item.Value),
})

export const fromSharePointFormulaTerm = (item: FormulaTermListItem): FormulaTerm => ({
  formulaCode: asFormulaCode(item.FormulaCode),
  componentType: item.ComponentType as FormulaTerm['componentType'],
  order: Number(item.Order),
  operation: item.Operation as FormulaTerm['operation'],
  signal: Number(item.Signal) >= 0 ? 1 : -1,
  calculationType: (item.CalculationType ?? 'KPI_BASED') as FormulaTerm['calculationType'],
  kpiCode: item.KPICode ? asKpiCode(item.KPICode) : undefined,
  conversionCode: item.ConversionCode ? asConversionCode(item.ConversionCode) : undefined,
})

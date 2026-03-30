import type { ComponentMasterDto } from '../../../application/dto/catalogs/ComponentMasterDto'
import type { ConversionMasterDto } from '../../../application/dto/catalogs/ConversionMasterDto'
import type { ConversionValueDto } from '../../../application/dto/catalogs/ConversionValueDto'
import type { FormulaMasterDto } from '../../../application/dto/catalogs/FormulaMasterDto'
import type { KpiMasterDto } from '../../../application/dto/catalogs/KpiMasterDto'
import { asConversionCode } from '../../../domain/catalogs/value-objects/ConversionCode'
import { asFormulaCode } from '../../../domain/catalogs/value-objects/FormulaCode'
import { asKpiCode } from '../../../domain/catalogs/value-objects/KpiCode'
import type { ComponentMasterListItem } from '../lists/componentMasterListApi'
import type { ConversionMasterListItem } from '../lists/conversionMasterListApi'
import type { ConversionValueListItem } from '../lists/conversionValuesListApi'
import type { FormulaMasterListItem } from '../lists/formulaMasterListApi'
import type { KpiMasterListItem } from '../lists/kpiMasterListApi'

export const fromSharePointComponentCatalog = (item: ComponentMasterListItem): ComponentMasterDto => ({
  code: item.Code,
  name: item.Title,
  description: item.Description,
  componentType: item.ComponentType as ComponentMasterDto['componentType'],
  defaultDirection: item.DefaultDirection as ComponentMasterDto['defaultDirection'],
  defaultCalculationType: item.DefaultCalculationType as ComponentMasterDto['defaultCalculationType'],
  active: Boolean(item.Active),
})

export const fromSharePointKpiCatalog = (item: KpiMasterListItem): KpiMasterDto => ({
  code: asKpiCode(item.Code),
  name: item.Title,
  unit: item.Unit,
  description: item.Description,
  active: Boolean(item.Active),
})

export const fromSharePointConversionCatalog = (item: ConversionMasterListItem): ConversionMasterDto => ({
  code: asConversionCode(item.Code),
  name: item.Title,
  sourceUnit: item.SourceUnit,
  targetUnit: item.TargetUnit,
  description: item.Description,
  active: Boolean(item.Active),
})

export const fromSharePointFormulaCatalog = (item: FormulaMasterListItem): FormulaMasterDto => ({
  code: asFormulaCode(item.Code),
  name: item.Title,
  formulaType: item.FormulaType as FormulaMasterDto['formulaType'],
  expression: item.Expression,
  description: item.Description,
  active: Boolean(item.Active),
})

export const fromSharePointConversionValue = (item: ConversionValueListItem): ConversionValueDto => ({
  conversionCode: asConversionCode(item.ConversionCode),
  monthRef: item.MonthRef as ConversionValueDto['monthRef'],
  scenario: item.Scenario as ConversionValueDto['scenario'],
  value: Number(item.Value),
})

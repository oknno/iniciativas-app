import type { ComponentMasterDto } from '../../dto/catalogs/ComponentMasterDto'
import type { ConversionMasterDto } from '../../dto/catalogs/ConversionMasterDto'
import type { ConversionValueDto } from '../../dto/catalogs/ConversionValueDto'
import type { FormulaMasterDto } from '../../dto/catalogs/FormulaMasterDto'
import type { KpiMasterDto } from '../../dto/catalogs/KpiMasterDto'

export interface CatalogsDtoBundle {
  readonly componentCatalog: readonly ComponentMasterDto[]
  readonly kpiCatalog: readonly KpiMasterDto[]
  readonly conversionCatalog: readonly ConversionMasterDto[]
  readonly formulaCatalog: readonly FormulaMasterDto[]
  readonly conversionValues: readonly ConversionValueDto[]
}

export const buildCatalogsDtoBundle = (input: {
  readonly components: readonly ComponentMasterDto[]
  readonly kpis: readonly KpiMasterDto[]
  readonly conversions: readonly ConversionMasterDto[]
  readonly formulas: readonly FormulaMasterDto[]
  readonly conversionValues: readonly ConversionValueDto[]
}): CatalogsDtoBundle => ({
  componentCatalog: input.components,
  kpiCatalog: input.kpis,
  conversionCatalog: input.conversions,
  formulaCatalog: input.formulas,
  conversionValues: input.conversionValues,
})

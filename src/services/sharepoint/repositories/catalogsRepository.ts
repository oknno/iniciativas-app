import type { ComponentMasterDto } from '../../../application/dto/catalogs/ComponentMasterDto'
import type { ConversionMasterDto } from '../../../application/dto/catalogs/ConversionMasterDto'
import type { ConversionValueDto } from '../../../application/dto/catalogs/ConversionValueDto'
import type { FormulaMasterDto } from '../../../application/dto/catalogs/FormulaMasterDto'
import type { KpiMasterDto } from '../../../application/dto/catalogs/KpiMasterDto'
import {
  fromSharePointComponentCatalog,
  fromSharePointConversionCatalog,
  fromSharePointConversionValue,
  fromSharePointFormulaCatalog,
  fromSharePointKpiCatalog,
} from '../adapters/sharePointCatalogAdapter'
import { listAll as listComponentMaster } from '../lists/componentMasterListApi'
import { listAll as listConversionMaster } from '../lists/conversionMasterListApi'
import { listAll as listConversionValues } from '../lists/conversionValuesListApi'
import { listAll as listFormulaMaster } from '../lists/formulaMasterListApi'
import { listAll as listKpiMaster } from '../lists/kpiMasterListApi'

export interface CatalogBundle {
  readonly components: readonly ComponentMasterDto[]
  readonly kpis: readonly KpiMasterDto[]
  readonly conversions: readonly ConversionMasterDto[]
  readonly formulas: readonly FormulaMasterDto[]
  readonly conversionValues: readonly ConversionValueDto[]
}

export const catalogsRepository = {
  async listComponentCatalog(): Promise<readonly ComponentMasterDto[]> {
    const items = await listComponentMaster()
    return items.map(fromSharePointComponentCatalog)
  },

  async listKpiCatalog(): Promise<readonly KpiMasterDto[]> {
    const items = await listKpiMaster()
    return items.map(fromSharePointKpiCatalog)
  },

  async listConversionCatalog(): Promise<readonly ConversionMasterDto[]> {
    const items = await listConversionMaster()
    return items.map(fromSharePointConversionCatalog)
  },

  async listFormulaCatalog(): Promise<readonly FormulaMasterDto[]> {
    const items = await listFormulaMaster()
    return items.map(fromSharePointFormulaCatalog)
  },

  async listConversionValues(): Promise<readonly ConversionValueDto[]> {
    const items = await listConversionValues()
    return items.map(fromSharePointConversionValue)
  },

  async listAllCatalogs(): Promise<CatalogBundle> {
    const [components, kpis, conversions, formulas, conversionValues] = await Promise.all([
      this.listComponentCatalog(),
      this.listKpiCatalog(),
      this.listConversionCatalog(),
      this.listFormulaCatalog(),
      this.listConversionValues(),
    ])

    return {
      components,
      kpis,
      conversions,
      formulas,
      conversionValues,
    }
  },
}

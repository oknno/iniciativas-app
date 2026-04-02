import type { ConversionValueDto } from '../../dto/catalogs/ConversionValueDto'
import type { SaveComponentValueDto } from '../../dto/initiatives/SaveComponentValueDto'
import type { SaveKpiValueDto } from '../../dto/initiatives/SaveKpiValueDto'
import type { ConversionValue } from '../../../domain/catalogs/entities/ConversionValue'
import type { InitiativeCalculationSnapshot } from '../../../domain/calculation/entities/CalculationResult'

export const toConversionValues = (items: readonly ConversionValueDto[]): readonly ConversionValue[] =>
  items.map((item) => ({
    conversionCode: item.conversionCode,
    initiativeId: item.initiativeId,
    monthRef: item.monthRef,
    scenario: item.scenario,
    value: item.value,
  }))

export interface PreviewCalculationInput {
  readonly initiativeId: SaveKpiValueDto['initiativeId']
  readonly year: number
  readonly scenario: SaveKpiValueDto['scenario']
  readonly components: readonly import('../../../domain/initiatives/entities/InitiativeComponent').InitiativeComponent[]
  readonly kpiValues: readonly SaveKpiValueDto[]
  readonly componentValues: readonly SaveComponentValueDto[]
  readonly conversionValues: readonly ConversionValueDto[]
}

export const buildSnapshot = (snapshot: InitiativeCalculationSnapshot): InitiativeCalculationSnapshot => snapshot

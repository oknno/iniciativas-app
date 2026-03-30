import type { KpiCode } from '../../../domain/catalogs/value-objects/KpiCode'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { MonthRef } from '../../../domain/initiatives/value-objects/MonthRef'
import type { Scenario } from '../../../domain/initiatives/value-objects/Scenario'

export interface SaveKpiValueDto {
  readonly initiativeId: InitiativeId
  readonly componentId: string
  readonly kpiCode: KpiCode
  readonly monthRef: MonthRef
  readonly scenario: Scenario
  readonly value: number
}

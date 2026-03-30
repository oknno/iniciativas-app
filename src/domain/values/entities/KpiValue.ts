import type { KpiCode } from '../../catalogs/value-objects/KpiCode'
import type { InitiativeId } from '../../initiatives/value-objects/InitiativeId'
import type { MonthRef } from '../../initiatives/value-objects/MonthRef'
import type { Scenario } from '../../initiatives/value-objects/Scenario'

export interface KpiValue {
  readonly initiativeId: InitiativeId
  readonly componentId: string
  readonly kpiCode: KpiCode
  readonly monthRef: MonthRef
  readonly scenario: Scenario
  readonly value: number
}

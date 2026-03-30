import type { Direction } from '../../catalogs/value-objects/Direction'
import type { InitiativeId } from '../../initiatives/value-objects/InitiativeId'
import type { MonthRef } from '../../initiatives/value-objects/MonthRef'
import type { Scenario } from '../../initiatives/value-objects/Scenario'

export interface ComponentValue {
  readonly initiativeId: InitiativeId
  readonly componentId: string
  readonly monthRef: MonthRef
  readonly scenario: Scenario
  readonly baseValue: number
  readonly direction: Direction
  readonly signedValue: number
}

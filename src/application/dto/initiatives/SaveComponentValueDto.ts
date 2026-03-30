import type { Direction } from '../../../domain/catalogs/value-objects/Direction'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { MonthRef } from '../../../domain/initiatives/value-objects/MonthRef'
import type { Scenario } from '../../../domain/initiatives/value-objects/Scenario'

export interface SaveComponentValueDto {
  readonly initiativeId: InitiativeId
  readonly componentId: string
  readonly monthRef: MonthRef
  readonly scenario: Scenario
  readonly baseValue: number
  readonly direction: Direction
}

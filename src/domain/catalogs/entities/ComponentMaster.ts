import type { CalculationType } from '../value-objects/CalculationType'
import type { ComponentType } from '../value-objects/ComponentType'
import type { Direction } from '../value-objects/Direction'

export interface ComponentMaster {
  readonly code: string
  readonly name: string
  readonly description?: string
  readonly componentType: ComponentType
  readonly defaultDirection: Direction
  readonly defaultCalculationType: CalculationType
  readonly active: boolean
}

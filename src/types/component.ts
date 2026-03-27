export type ComponentType = 'POSITIVO' | 'NEGATIVO' | 'BASE'

export type Direction = 1 | -1

export type CalculationType = 'KPI_BASED' | 'FIXED'

export interface ComponentMaster {
  id: number
  title: string
  code: string
  type: ComponentType
  direction: Direction
  calculationType: CalculationType
  isActive?: boolean
  description?: string
  created?: string
  modified?: string
}

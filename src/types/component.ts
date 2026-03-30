export type Direction = 1 | -1

export type CalculationType = 'KPI_BASED' | 'FIXED'

export type ComponentTypeCode =
  | 'FTE_SAVING'
  | 'ENERGY_SAVING'
  | 'MATERIAL_SAVING'
  | 'PRODUCTIVITY_GAIN'
  | 'REVENUE_GAIN'
  | 'SOFTWARE_COST'
  | 'SERVICE_COST'
  | 'ADDITIONAL_OPEX'
  | 'CAPEX_IMPACT'

export interface ComponentMaster {
  id: number
  title: string
  componentType: ComponentTypeCode
  direction: Direction
  calculationType: CalculationType
  isActive: boolean
}

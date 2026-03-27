export type KPIType = 'ABSOLUTE' | 'VOLUME' | 'RATE' | 'PERCENTAGE'

export type KPICode =
  | 'FTE_REDUCTION'
  | 'ENERGY_CONSUMPTION'
  | 'MATERIAL_CONSUMPTION'
  | 'PRODUCTION_VOLUME'
  | 'PRODUCTIVITY'
  | 'SCRAP_RATE'
  | 'DOWNTIME'
  | 'CYCLE_TIME'
  | 'YIELD'

export interface KpiMaster {
  id: number
  title: string
  code: KPICode
  unit: string
  type: KPIType
  isActive: boolean
}

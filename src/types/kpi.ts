export type KPICode = string

export type KPIType = 'MONETARIO' | 'PERCENTUAL' | 'VOLUME' | 'INDICE'

export interface KpiMaster {
  id: number
  title: string
  code: KPICode
  type: KPIType
  unit?: string
  source?: string
  isActive?: boolean
  created?: string
  modified?: string
}

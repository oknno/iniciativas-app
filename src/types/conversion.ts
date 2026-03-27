export type ConversionCode = string

export interface ConversionMaster {
  id: number
  title: string
  code: ConversionCode
  fromUnit: string
  toUnit: string
  factor: number
  isActive?: boolean
  created?: string
  modified?: string
}

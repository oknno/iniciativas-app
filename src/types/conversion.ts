export type ConversionCode =
  | 'COST_PER_FTE'
  | 'COST_PER_KWH'
  | 'COST_PER_TON'
  | 'PRICE_PER_TON'
  | 'COST_PER_HOUR'
  | 'COST_PER_KG'
  | 'COST_PER_M3'
  | 'EXCHANGE_RATE'
  | 'MARGIN_PER_TON'

export interface ConversionMaster {
  id: number
  title: string
  code: ConversionCode
  unit: string
  isActive: boolean
}

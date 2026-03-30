import type { ConversionMaster } from '../types/conversion'

const conversionMasterMock: ConversionMaster[] = [
  { id: 1, title: 'Cost per FTE', code: 'COST_PER_FTE', unit: 'R$/FTE', isActive: true },
  { id: 2, title: 'Cost per kWh', code: 'COST_PER_KWH', unit: 'R$/kWh', isActive: true },
  { id: 3, title: 'Cost per Ton', code: 'COST_PER_TON', unit: 'R$/ton', isActive: true },
  { id: 4, title: 'Price per Ton', code: 'PRICE_PER_TON', unit: 'R$/ton', isActive: true },
  { id: 5, title: 'Cost per Hour', code: 'COST_PER_HOUR', unit: 'R$/h', isActive: true },
  { id: 6, title: 'Cost per kg', code: 'COST_PER_KG', unit: 'R$/kg', isActive: true },
  { id: 7, title: 'Cost per m³', code: 'COST_PER_M3', unit: 'R$/m³', isActive: true },
  { id: 8, title: 'Exchange Rate', code: 'EXCHANGE_RATE', unit: 'BRL/USD', isActive: true },
  { id: 9, title: 'Margin per Ton', code: 'MARGIN_PER_TON', unit: 'R$/ton', isActive: true },
]

export async function getConversionMasterCatalog(): Promise<ConversionMaster[]> {
  return Promise.resolve(conversionMasterMock)
}

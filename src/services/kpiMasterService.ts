import type { KpiMaster } from '../types/kpi'

const kpiMasterMock: KpiMaster[] = [
  { id: 1, title: 'FTE Reduction', code: 'FTE_REDUCTION', unit: 'FTE', type: 'ABSOLUTE', isActive: true },
  { id: 2, title: 'Energy Consumption', code: 'ENERGY_CONSUMPTION', unit: 'kWh', type: 'ABSOLUTE', isActive: true },
  { id: 3, title: 'Material Consumption', code: 'MATERIAL_CONSUMPTION', unit: 'kg', type: 'ABSOLUTE', isActive: true },
  { id: 4, title: 'Production Volume', code: 'PRODUCTION_VOLUME', unit: 'ton', type: 'VOLUME', isActive: true },
  { id: 5, title: 'Productivity', code: 'PRODUCTIVITY', unit: 'ton/h', type: 'RATE', isActive: true },
  { id: 6, title: 'Scrap Rate', code: 'SCRAP_RATE', unit: '%', type: 'PERCENTAGE', isActive: true },
  { id: 7, title: 'Downtime', code: 'DOWNTIME', unit: 'h', type: 'ABSOLUTE', isActive: true },
  { id: 8, title: 'Cycle Time', code: 'CYCLE_TIME', unit: 'min', type: 'RATE', isActive: true },
  { id: 9, title: 'Yield', code: 'YIELD', unit: '%', type: 'PERCENTAGE', isActive: true },
]

export async function getKpiMasterCatalog(): Promise<KpiMaster[]> {
  return Promise.resolve(kpiMasterMock)
}

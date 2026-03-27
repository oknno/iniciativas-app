import type { ComponentMaster } from '../types/component'

const componentMasterMock: ComponentMaster[] = [
  { id: 1, title: 'FTE Saving', componentType: 'FTE_SAVING', direction: 1, calculationType: 'KPI_BASED', isActive: true },
  { id: 2, title: 'Energy Saving', componentType: 'ENERGY_SAVING', direction: 1, calculationType: 'KPI_BASED', isActive: true },
  { id: 3, title: 'Material Saving', componentType: 'MATERIAL_SAVING', direction: 1, calculationType: 'KPI_BASED', isActive: true },
  { id: 4, title: 'Productivity Gain', componentType: 'PRODUCTIVITY_GAIN', direction: 1, calculationType: 'KPI_BASED', isActive: true },
  { id: 5, title: 'Revenue Gain', componentType: 'REVENUE_GAIN', direction: 1, calculationType: 'KPI_BASED', isActive: true },
  { id: 6, title: 'Software Cost', componentType: 'SOFTWARE_COST', direction: -1, calculationType: 'FIXED', isActive: true },
  { id: 7, title: 'Service Cost', componentType: 'SERVICE_COST', direction: -1, calculationType: 'FIXED', isActive: true },
  { id: 8, title: 'Additional OPEX', componentType: 'ADDITIONAL_OPEX', direction: -1, calculationType: 'FIXED', isActive: true },
  { id: 9, title: 'Capex Impact', componentType: 'CAPEX_IMPACT', direction: -1, calculationType: 'FIXED', isActive: true },
]

export async function getComponentMasterCatalog(): Promise<ComponentMaster[]> {
  return Promise.resolve(componentMasterMock)
}

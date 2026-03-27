import type { ComponentMaster } from '../types/component'

const componentMasterMock: ComponentMaster[] = [
  {
    id: 1,
    title: 'Componente por KPI',
    code: 'KPI_BASED',
    type: 'BASE',
    direction: 1,
    calculationType: 'KPI_BASED',
    isActive: true,
  },
  {
    id: 2,
    title: 'Componente de valor fixo',
    code: 'FIXED',
    type: 'BASE',
    direction: 1,
    calculationType: 'FIXED',
    isActive: true,
  },
]

export async function getComponentMasterCatalog(): Promise<ComponentMaster[]> {
  return Promise.resolve(componentMasterMock)
}

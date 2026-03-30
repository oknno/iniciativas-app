import type { FormulaMaster } from '../types/formula'

const formulaMasterMock: FormulaMaster[] = [
  { id: 1, title: 'Multiplier', code: 'MULTIPLIER', type: 'MULTIPLIER', isActive: true },
  { id: 2, title: 'Delta', code: 'DELTA', type: 'DELTA', isActive: true },
  { id: 3, title: 'Direct Value', code: 'DIRECT_VALUE', type: 'DIRECT', isActive: true },
  { id: 4, title: 'Component Sum', code: 'COMPONENT_SUM', type: 'AGGREGATION', isActive: true },
  { id: 5, title: 'Incremental Revenue', code: 'INCREMENTAL_REVENUE', type: 'INCREMENTAL', isActive: true },
]

export async function getFormulaMasterCatalog(): Promise<FormulaMaster[]> {
  return Promise.resolve(formulaMasterMock)
}

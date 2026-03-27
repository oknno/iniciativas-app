import type { KpiMaster } from '../types/kpi'

const kpiMasterMock: KpiMaster[] = [
  {
    id: 1,
    title: 'Receita Incremental',
    code: 'REVENUE_INCREMENTAL',
    type: 'MONETARIO',
    unit: 'BRL',
    source: 'PoC',
    isActive: true,
  },
  {
    id: 2,
    title: 'Clientes Ativados',
    code: 'CUSTOMERS_ACTIVATED',
    type: 'VOLUME',
    unit: 'un',
    source: 'PoC',
    isActive: true,
  },
]

export async function getKpiMasterCatalog(): Promise<KpiMaster[]> {
  return Promise.resolve(kpiMasterMock)
}

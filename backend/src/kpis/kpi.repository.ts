import type { Kpi } from '../common/types.js';

export class KpiRepository {
  private readonly kpis = new Map<string, Kpi>([
    ['kpi-co2', { id: 'kpi-co2', code: 'CO2', name: 'CO2 evitado', formulaId: 'formula-co2' }],
  ]);

  findById(id: string): Kpi | undefined {
    return this.kpis.get(id);
  }
}

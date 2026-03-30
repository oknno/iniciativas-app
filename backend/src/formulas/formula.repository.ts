import type { Formula } from '../common/types.js';

export class FormulaRepository {
  private readonly formulas = new Map<string, Formula>([
    ['formula-co2', { id: 'formula-co2', code: 'CO2_FACTOR', expression: 'sum(energy) * 0.2' }],
  ]);

  findById(id: string): Formula | undefined {
    return this.formulas.get(id);
  }
}

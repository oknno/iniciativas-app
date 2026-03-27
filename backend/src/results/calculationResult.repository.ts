import type { CalculationResult } from '../common/types.js';

export class CalculationResultRepository {
  private readonly results = new Map<string, CalculationResult>();

  save(result: CalculationResult): CalculationResult {
    this.results.set(result.id, result);
    return result;
  }

  findByInitiativeId(initiativeId: string): CalculationResult[] {
    return [...this.results.values()].filter((result) => result.initiativeId === initiativeId);
  }
}

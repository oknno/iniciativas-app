import { randomUUID } from 'node:crypto';
import type {
  CalculationResult,
  Initiative,
  InitiativeComponent,
} from '../common/types.js';
import { FunctionalError, NotFoundError } from '../common/errors.js';
import { ConversionRepository } from '../conversions/conversion.repository.js';
import { FormulaRepository } from '../formulas/formula.repository.js';
import { KpiRepository } from '../kpis/kpi.repository.js';
import { CalculationResultRepository } from '../results/calculationResult.repository.js';

export class CalculationService {
  constructor(
    private readonly kpiRepository: KpiRepository,
    private readonly formulaRepository: FormulaRepository,
    private readonly conversionRepository: ConversionRepository,
    private readonly resultRepository: CalculationResultRepository,
  ) {}

  calculate(initiative: Initiative, components: InitiativeComponent[]): CalculationResult {
    const kpi = this.kpiRepository.findById(initiative.kpiId);
    if (!kpi) {
      throw new NotFoundError('KPI', initiative.kpiId);
    }

    const formula = this.formulaRepository.findById(kpi.formulaId);
    if (!formula) {
      throw new NotFoundError('Fórmula', kpi.formulaId);
    }

    void formula;

    const converted = components.map((component) => {
      const conversion = this.conversionRepository.findByUnits(component.unit, 'mwh');
      if (!conversion) {
        throw new FunctionalError(
          `Conversão ausente para ${component.unit} -> mwh.`,
          'MISSING_CONVERSION',
          422,
          { componentCode: component.componentCode, fromUnit: component.unit, toUnit: 'mwh' },
        );
      }

      return {
        ...component,
        normalizedValue: component.value * conversion.factor,
      };
    });

    const energySum = converted.reduce((acc, item) => acc + item.normalizedValue, 0);
    const resultValue = Number((energySum * 0.2).toFixed(4));

    const result: CalculationResult = {
      id: randomUUID(),
      initiativeId: initiative.id,
      result: resultValue,
      unit: 'tco2e',
      inputs: components.map((component) => ({
        componentCode: component.componentCode,
        value: component.value,
        unit: component.unit,
      })),
      calculatedAt: new Date().toISOString(),
    };

    return this.resultRepository.save(result);
  }
}

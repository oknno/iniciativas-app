import type { CalculationResult } from '../../common/types.js';
import type { SharePointListMapper } from './sharepointClient.js';

type CalculationResultListItem = {
  ID: string;
  InitiativeId: string;
  Result: number;
  Unit: string;
  CalculatedAt: string;
  InputsJson: string;
};

export class CalculationResultMapper
  implements SharePointListMapper<CalculationResult, CalculationResultListItem>
{
  readonly listName = 'Calculation_Result';

  toDomain(item: CalculationResultListItem): CalculationResult {
    return {
      id: item.ID,
      initiativeId: item.InitiativeId,
      result: item.Result,
      unit: item.Unit,
      calculatedAt: item.CalculatedAt,
      inputs: JSON.parse(item.InputsJson) as CalculationResult['inputs'],
    };
  }

  toListItem(domain: CalculationResult): CalculationResultListItem {
    return {
      ID: domain.id,
      InitiativeId: domain.initiativeId,
      Result: domain.result,
      Unit: domain.unit,
      CalculatedAt: domain.calculatedAt,
      InputsJson: JSON.stringify(domain.inputs),
    };
  }
}

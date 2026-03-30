import type { CalculateInitiativeResultDto } from '../../../../application/dto/calculation/CalculateInitiativeResultDto'
import { asConversionCode } from '../../../../domain/catalogs/value-objects/ConversionCode'
import { asFormulaCode } from '../../../../domain/catalogs/value-objects/FormulaCode'
import { asKpiCode } from '../../../../domain/catalogs/value-objects/KpiCode'
import { asInitiativeId } from '../../../../domain/initiatives/value-objects/InitiativeId'

export const mockCalculationResult: CalculateInitiativeResultDto = {
  initiativeId: asInitiativeId('INIT-001'),
  year: 2026,
  calculatedAt: '2026-01-31T00:00:00.000Z',
  issues: [],
  results: [
    { initiativeId: asInitiativeId('INIT-001'), year: 2026, month: 1, gainValue: -200600 },
    { initiativeId: asInitiativeId('INIT-001'), year: 2026, month: 2, gainValue: -173850 },
    { initiativeId: asInitiativeId('INIT-001'), year: 2026, month: 3, gainValue: -157800 },
  ],
  details: [
    {
      initiativeId: asInitiativeId('INIT-001'),
      componentType: 'ENERGY',
      year: 2026,
      month: 1,
      formulaCode: asFormulaCode('FORMULA-MULTIPLIER'),
      direction: 1,
      rawValue: 64400,
      signedValue: 64400,
      kpiCode: asKpiCode('KPI-KWH-SAVED'),
      conversionCode: asConversionCode('CONV-KWH-USD'),
      sourceType: 'KPI_BASED',
      explanation: 'KPI-KWH-SAVED × CONV-KWH-USD',
    },
  ],
}

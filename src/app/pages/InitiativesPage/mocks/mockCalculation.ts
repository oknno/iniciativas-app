import type { CalculateInitiativeResultDto } from '../../../../application/dto/calculation/CalculateInitiativeResultDto'
import { asInitiativeId } from '../../../../domain/initiatives/value-objects/InitiativeId'

export const mockCalculationResult: CalculateInitiativeResultDto = {
  initiativeId: asInitiativeId('INIT-001'),
  monthRef: '2026-01',
  scenario: 'BASE',
  finalGain: -200600,
  calculatedAt: '2026-01-31T00:00:00.000Z',
  detail: [
    {
      componentId: 'COMP-001',
      componentName: 'Electricity savings',
      direction: 1,
      baseValue: 64400,
      signedValue: 64400,
      explanation: 'KPI based = 460000 * 0.14',
    },
    {
      componentId: 'COMP-002',
      componentName: 'One-time implementation',
      direction: -1,
      baseValue: 265000,
      signedValue: -265000,
      explanation: 'Fixed value applied directly',
    },
  ],
}

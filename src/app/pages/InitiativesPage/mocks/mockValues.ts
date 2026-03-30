import type { SaveComponentValueDto } from '../../../../application/dto/initiatives/SaveComponentValueDto'
import type { SaveKpiValueDto } from '../../../../application/dto/initiatives/SaveKpiValueDto'
import { asKpiCode } from '../../../../domain/catalogs/value-objects/KpiCode'
import { asInitiativeId } from '../../../../domain/initiatives/value-objects/InitiativeId'

export const mockKpiValues: readonly SaveKpiValueDto[] = [
  {
    initiativeId: asInitiativeId('INIT-001'),
    componentId: 'COMP-001',
    kpiCode: asKpiCode('KPI-KWH-SAVED'),
    monthRef: '2026-01',
    scenario: 'BASE',
    value: 460000,
  },
  {
    initiativeId: asInitiativeId('INIT-001'),
    componentId: 'COMP-001',
    kpiCode: asKpiCode('KPI-KWH-SAVED'),
    monthRef: '2026-02',
    scenario: 'BASE',
    value: 472500,
  },
  {
    initiativeId: asInitiativeId('INIT-001'),
    componentId: 'COMP-001',
    kpiCode: asKpiCode('KPI-KWH-SAVED'),
    monthRef: '2026-03',
    scenario: 'BASE',
    value: 480000,
  },
]

export const mockComponentValues: readonly SaveComponentValueDto[] = [
  {
    initiativeId: asInitiativeId('INIT-001'),
    componentId: 'COMP-001',
    monthRef: '2026-01',
    scenario: 'BASE',
    baseValue: 64400,
    direction: 1,
  },
  {
    initiativeId: asInitiativeId('INIT-001'),
    componentId: 'COMP-001',
    monthRef: '2026-02',
    scenario: 'BASE',
    baseValue: 65000,
    direction: 1,
  },
  {
    initiativeId: asInitiativeId('INIT-001'),
    componentId: 'COMP-001',
    monthRef: '2026-03',
    scenario: 'BASE',
    baseValue: 66120,
    direction: 1,
  },
  {
    initiativeId: asInitiativeId('INIT-001'),
    componentId: 'COMP-002',
    monthRef: '2026-01',
    scenario: 'BASE',
    baseValue: 265000,
    direction: -1,
  },
  {
    initiativeId: asInitiativeId('INIT-001'),
    componentId: 'COMP-002',
    monthRef: '2026-02',
    scenario: 'BASE',
    baseValue: 240000,
    direction: -1,
  },
]

import { describe, expect, it } from 'vitest'
import {
  createInitiativeComponentPayloadFixture,
  expectedInitiativeComponentCreatePayload,
  initiativeComponentLookupFixture,
} from './fixtures/sharepointListFixtures'
import {
  fromSharePointInitiativeComponent,
  toCreateInitiativeComponentPayload,
} from '../src/services/sharepoint/adapters/sharePointInitiativeAdapter'

describe('sharePointInitiativeAdapter', () => {
  it('preserva calculationType e direction ao ler Initiative_Component', () => {
    const component = fromSharePointInitiativeComponent(initiativeComponentLookupFixture)

    expect(component.calculationType).toBe('KPI_BASED')
    expect(component.direction).toBe(-1)
    expect(component.componentType).toBe('REVENUE')
  })

  it('preserva calculationType e direction ao salvar Initiative_Component', () => {
    const payload = toCreateInitiativeComponentPayload(
      {
        id: 'REVENUE_DELTA',
        initiativeId: '100',
        name: 'Aumento de receita',
        componentType: 'REVENUE',
        calculationType: 'KPI_BASED',
        direction: -1,
        kpiCode: 'KPI_REV',
        conversionCode: 'CONV_REV',
        formulaCode: 'F_REV',
        sortOrder: 1,
      },
      createInitiativeComponentPayloadFixture,
    )

    expect(payload).toEqual(expectedInitiativeComponentCreatePayload)
  })
})

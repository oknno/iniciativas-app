import { describe, expect, it } from 'vitest'
import { CalculationEngine } from '../src/domain/calculation/engine/CalculationEngine'
import { resolveCalculationMonths } from '../src/domain/calculation/rules/monthPolicy'
import { fromSharePointCalculationDetail } from '../src/services/sharepoint/adapters/sharePointCalculationAdapter'
import { calculationDetailFixture } from './fixtures/sharepointListFixtures'

describe('calculation month policy', () => {
  it('usa 12 meses fixos por padrão', () => {
    const months = resolveCalculationMonths({
      year: 2026,
      policy: 'FIXED_12_MONTHS',
      kpiValues: [],
      fixedValues: [],
      conversionValues: [],
    })

    expect(months).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('usa janela com dados quando política WINDOW_WITH_DATA está ativa', () => {
    const months = resolveCalculationMonths({
      year: 2026,
      policy: 'WINDOW_WITH_DATA',
      kpiValues: [
        { initiativeId: '100', componentId: 'REVENUE', kpiCode: 'KPI_REV', monthRef: '2026-03', scenario: 'BASE', value: 10 },
        { initiativeId: '100', componentId: 'REVENUE', kpiCode: 'KPI_REV', monthRef: '2026-05', scenario: 'BASE', value: 30 },
      ],
      fixedValues: [],
      conversionValues: [],
    })

    expect(months).toEqual([3, 4, 5])
  })
})

describe('calculation engine cenário ouro', () => {
  it('produz resultado reprodutível para fixture realista de lista', () => {
    const snapshot = CalculationEngine.run({
      initiativeId: '100',
      year: 2026,
      scenario: 'BASE',
      components: [
        {
          id: 'REVENUE_DELTA',
          initiativeId: '100',
          name: 'Aumento de receita',
          componentType: 'REVENUE',
          direction: -1,
          calculationType: 'KPI_BASED',
          kpiCode: 'KPI_REV',
          conversionCode: 'CONV_REV',
          formulaCode: 'F_REV',
          sortOrder: 1,
        },
      ],
      formulaTerms: [
        {
          formulaCode: 'F_REV',
          order: 1,
          operation: 'ADD',
          signal: 1,
          calculationType: 'KPI_BASED',
          kpiCode: 'KPI_REV',
          conversionCode: 'CONV_REV',
          componentType: 'REVENUE',
        },
      ],
      kpiValues: [
        { initiativeId: '100', componentId: 'REVENUE_DELTA', kpiCode: 'KPI_REV', monthRef: '2026-01', scenario: 'BASE', value: 50 },
        { initiativeId: '100', componentId: 'REVENUE_DELTA', kpiCode: 'KPI_REV', monthRef: '2026-02', scenario: 'BASE', value: 40 },
      ],
      fixedValues: [],
      conversionValues: [
        { conversionCode: 'CONV_REV', monthRef: '2026-01', scenario: 'BASE', value: 2 },
        { conversionCode: 'CONV_REV', monthRef: '2026-02', scenario: 'BASE', value: 3 },
      ],
      monthPolicy: 'FIXED_12_MONTHS',
    })

    expect(snapshot.monthPolicy).toBe('FIXED_12_MONTHS')
    expect(snapshot.results).toHaveLength(12)
    expect(snapshot.results[0]?.gainValue).toBe(-100)
    expect(snapshot.results[1]?.gainValue).toBe(-120)
    expect(snapshot.results[11]?.gainValue).toBe(0)
    expect(snapshot.results[11]?.annualValue).toBe(-220)

    expect(snapshot.details[0]?.calculationType).toBe('KPI_BASED')
    expect(snapshot.details[0]?.direction).toBe(-1)
  })

  it('mapeia Calculation_Detail oficial incluindo calculationType e direction', () => {
    const mapped = fromSharePointCalculationDetail(calculationDetailFixture)

    expect(mapped.calculationType).toBe('KPI_BASED')
    expect(mapped.direction).toBe(-1)
    expect(mapped.resultValue).toBe(20)
  })
})

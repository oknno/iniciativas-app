import type { SaveComponentValueDto } from '../../../application/dto/initiatives/SaveComponentValueDto'
import type { SaveKpiValueDto } from '../../../application/dto/initiatives/SaveKpiValueDto'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { Scenario } from '../../../domain/initiatives/value-objects/Scenario'
import { mockComponentValues, mockKpiValues } from '../../../app/pages/InitiativesPage/mocks/mockValues'

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

const kpiValuesState: SaveKpiValueDto[] = [...mockKpiValues]
const componentValuesState: SaveComponentValueDto[] = [...mockComponentValues]

const getYear = (monthRef: string): number => Number(monthRef.split('-')[0])

const clone = <T>(items: readonly T[]): readonly T[] => structuredClone(items)

export const initiativeValuesRepository = {
  async listByInitiativeYearScenario(
    initiativeId: InitiativeId,
    year: number,
    scenario: Scenario,
  ): Promise<{ readonly kpiValues: readonly SaveKpiValueDto[]; readonly componentValues: readonly SaveComponentValueDto[] }> {
    await wait(80)

    return {
      kpiValues: clone(
        kpiValuesState.filter(
          (item) => item.initiativeId === initiativeId && item.scenario === scenario && getYear(item.monthRef) === year,
        ),
      ),
      componentValues: clone(
        componentValuesState.filter(
          (item) => item.initiativeId === initiativeId && item.scenario === scenario && getYear(item.monthRef) === year,
        ),
      ),
    }
  },

  async saveKpiValues(values: readonly SaveKpiValueDto[]): Promise<void> {
    await wait(120)

    values.forEach((value) => {
      const existingIndex = kpiValuesState.findIndex(
        (item) =>
          item.initiativeId === value.initiativeId &&
          item.componentId === value.componentId &&
          item.kpiCode === value.kpiCode &&
          item.monthRef === value.monthRef &&
          item.scenario === value.scenario,
      )

      if (existingIndex >= 0) {
        kpiValuesState[existingIndex] = value
      } else {
        kpiValuesState.push(value)
      }
    })
  },

  async saveComponentValues(values: readonly SaveComponentValueDto[]): Promise<void> {
    await wait(120)

    values.forEach((value) => {
      const existingIndex = componentValuesState.findIndex(
        (item) =>
          item.initiativeId === value.initiativeId &&
          item.componentId === value.componentId &&
          item.monthRef === value.monthRef &&
          item.scenario === value.scenario,
      )

      if (existingIndex >= 0) {
        componentValuesState[existingIndex] = value
      } else {
        componentValuesState.push(value)
      }
    })
  },
}

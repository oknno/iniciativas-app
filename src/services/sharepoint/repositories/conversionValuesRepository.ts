import type { SaveConversionValueDto } from '../../../application/dto/initiatives/SaveConversionValueDto'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { Scenario } from '../../../domain/initiatives/value-objects/Scenario'
import { fromSharePointConversionValue } from '../adapters/sharePointCatalogAdapter'
import {
  createManyForInitiative,
  deleteByInitiativeId,
  listByInitiativeId,
} from '../lists/conversionValuesListApi'
import { listAll as listConversionCatalog } from '../lists/conversionMasterListApi'

const toSharePointInitiativeId = (initiativeId: InitiativeId): number => {
  const parsed = Number(initiativeId)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Initiative id inválido para persistir conversões: ${initiativeId}`)
  }

  return parsed
}

const toConversionMaps = async (): Promise<{
  readonly conversionIdByCode: Readonly<Record<string, number>>
  readonly conversionCodeById: Readonly<Record<number, string>>
}> => {
  const conversions = await listConversionCatalog()

  return {
    conversionIdByCode: conversions.reduce<Record<string, number>>((acc, item) => {
      acc[item.ConversionCode] = item.Id
      return acc
    }, {}),
    conversionCodeById: conversions.reduce<Record<number, string>>((acc, item) => {
      acc[item.Id] = item.ConversionCode
      return acc
    }, {}),
  }
}

const toYearMonth = (monthRef: string): { readonly year: number; readonly month: number } => {
  const [yearToken, monthToken] = monthRef.split('-')
  const year = Number(yearToken)
  const month = Number(monthToken)

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`MonthRef inválido para conversão: ${monthRef}`)
  }

  return { year, month }
}

const requireConversionId = (map: Readonly<Record<string, number>>, code: string): number => {
  const resolved = map[code]
  if (!Number.isInteger(resolved)) {
    throw new Error(`Código de conversão não encontrado no catálogo: ${code}`)
  }

  return resolved
}

export const conversionValuesRepository = {
  async getByInitiativeYearScenario(
    initiativeId: InitiativeId,
    year: number,
    scenario: Scenario,
  ): Promise<readonly SaveConversionValueDto[]> {
    const sharePointInitiativeId = toSharePointInitiativeId(initiativeId)
    const [items, maps] = await Promise.all([listByInitiativeId(sharePointInitiativeId, { year, scenario }), toConversionMaps()])

    return items.map((item) => {
      const mapped = fromSharePointConversionValue(item, { conversionCodeById: maps.conversionCodeById })
      return {
        ...mapped,
        initiativeId: mapped.initiativeId ?? initiativeId,
      }
    })
  },

  async replaceByInitiativeYearScenario(
    initiativeId: InitiativeId,
    year: number,
    scenario: Scenario,
    values: readonly SaveConversionValueDto[],
  ): Promise<void> {
    const sharePointInitiativeId = toSharePointInitiativeId(initiativeId)
    await deleteByInitiativeId(sharePointInitiativeId, { year, scenario })

    if (values.length === 0) {
      return
    }

    const maps = await toConversionMaps()
    await createManyForInitiative(
      sharePointInitiativeId,
      values.map((value) => {
        const { year: payloadYear, month: payloadMonth } = toYearMonth(value.monthRef)
        return {
          Title: `${value.conversionCode}-${value.monthRef}`,
          ConversionCodeId: requireConversionId(maps.conversionIdByCode, value.conversionCode),
          Year: payloadYear,
          Month: payloadMonth,
          Value: value.value,
          Scenario: value.scenario,
        }
      }),
    )
  },
}

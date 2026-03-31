import type { SaveInitiativeDto } from '../../../application/dto/initiatives/SaveInitiativeDto'
import type { InitiativeWithAnnualGain } from '../../../application/mappers/initiatives/initiativeMappers'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import {
  fromSharePointInitiative,
  initiativeIdFromSharePoint,
  initiativeIdToSharePoint,
  toCreateInitiativePayload,
  toUpdateInitiativePayload,
} from '../adapters/sharePointInitiativeAdapter'
import {
  createInitiative,
  deleteInitiative,
  getInitiativeById,
  listInitiatives,
  updateInitiative,
} from '../lists/initiativesListApi'
import { initiativeComponentsRepository } from './initiativeComponentsRepository'
import { initiativeValuesRepository } from './initiativeValuesRepository'
import { calculationRepository } from './calculationRepository'

const toDuplicatedTitle = (title: string): string => `${title} (Copy)`

const sumAnnualGain = (items: readonly { readonly gainValue: number }[]): number =>
  items.reduce((total, item) => total + item.gainValue, 0)

export const initiativesRepository = {
  async list(): Promise<readonly InitiativeWithAnnualGain[]> {
    const initiatives = await listInitiatives()

    return await Promise.all(
      initiatives.map(async (item) => {
        const initiativeId = initiativeIdFromSharePoint(item.Id)
        const annualGain = sumAnnualGain(await calculationRepository.getCalculationResultByInitiativeId(initiativeId))

        return fromSharePointInitiative(item, [], annualGain)
      }),
    )
  },

  async getById(id: InitiativeId): Promise<InitiativeWithAnnualGain | undefined> {
    const sharePointInitiativeId = initiativeIdToSharePoint(id)

    try {
      const [initiative, components, calculationResult] = await Promise.all([
        getInitiativeById(sharePointInitiativeId),
        initiativeComponentsRepository.listByInitiativeId(id),
        calculationRepository.getCalculationResultByInitiativeId(id),
      ])

      return fromSharePointInitiative(initiative, components, sumAnnualGain(calculationResult))
    } catch {
      return undefined
    }
  },

  async create(input: SaveInitiativeDto): Promise<InitiativeWithAnnualGain> {
    const created = await createInitiative(toCreateInitiativePayload(input))
    return fromSharePointInitiative(created, [], 0)
  },

  async update(input: SaveInitiativeDto): Promise<InitiativeWithAnnualGain> {
    if (!input.id) {
      throw new Error('Initiative id is required for update.')
    }

    const sharePointInitiativeId = initiativeIdToSharePoint(input.id)
    const updated = await updateInitiative(sharePointInitiativeId, toUpdateInitiativePayload(input))
    const [components, calculationResult] = await Promise.all([
      initiativeComponentsRepository.listByInitiativeId(input.id),
      calculationRepository.getCalculationResultByInitiativeId(input.id),
    ])

    return fromSharePointInitiative(updated, components, sumAnnualGain(calculationResult))
  },

  async delete(id: InitiativeId): Promise<void> {
    const sharePointInitiativeId = initiativeIdToSharePoint(id)

    await Promise.all([
      deleteInitiative(sharePointInitiativeId),
      initiativeComponentsRepository.replaceByInitiativeId(id, []),
      initiativeValuesRepository.replaceKpiValuesByInitiativeId(id, []),
      initiativeValuesRepository.replaceComponentFixedValuesByInitiativeId(id, []),
      calculationRepository.replaceCalculationResultForInitiativeId(id, []),
      calculationRepository.replaceCalculationDetailsForInitiativeId(id, []),
    ])
  },

  async duplicate(id: InitiativeId): Promise<InitiativeWithAnnualGain> {
    const source = await this.getById(id)

    if (!source) {
      throw new Error(`Initiative not found: ${id}`)
    }

    const duplicated = await createInitiative(
      toCreateInitiativePayload({
        title: toDuplicatedTitle(source.title),
        unidade: source.unidade,
        responsavel: source.responsavel,
        stage: source.stage,
        status: source.status,
      }),
    )

    const duplicatedId = initiativeIdFromSharePoint(duplicated.Id)

    await initiativeComponentsRepository.replaceByInitiativeId(
      duplicatedId,
      source.components.map((component, index) => ({
        initiativeId: duplicatedId,
        name: component.name,
        componentType: component.componentType,
        direction: component.direction,
        calculationType: component.calculationType,
        kpiCode: component.kpiCode,
        conversionCode: component.conversionCode,
        formulaCode: component.formulaCode,
        fixedValue: component.fixedValue,
        sortOrder: index + 1,
      })),
    )

    return fromSharePointInitiative(duplicated, await initiativeComponentsRepository.listByInitiativeId(duplicatedId), 0)
  },
}

import type { SaveInitiativeComponentDto } from '../../../application/dto/initiatives/SaveInitiativeComponentDto'
import type { InitiativeComponent } from '../../../domain/initiatives/entities/InitiativeComponent'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import {
  fromSharePointInitiativeComponent,
  initiativeIdToSharePoint,
  toCreateInitiativeComponentPayload,
} from '../adapters/sharePointInitiativeAdapter'
import {
  createManyForInitiative,
  deleteByInitiativeId,
  listByInitiativeId,
} from '../lists/initiativeComponentsListApi'

export const initiativeComponentsRepository = {
  async listByInitiativeId(initiativeId: InitiativeId): Promise<readonly InitiativeComponent[]> {
    const sharePointInitiativeId = initiativeIdToSharePoint(initiativeId)
    const items = await listByInitiativeId(sharePointInitiativeId)

    return items.map(fromSharePointInitiativeComponent)
  },

  async replaceByInitiativeId(
    initiativeId: InitiativeId,
    components: readonly SaveInitiativeComponentDto[],
  ): Promise<readonly InitiativeComponent[]> {
    const sharePointInitiativeId = initiativeIdToSharePoint(initiativeId)
    await deleteByInitiativeId(sharePointInitiativeId)

    if (components.length === 0) {
      return []
    }

    const payload = components
      .slice()
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((component) => toCreateInitiativeComponentPayload(component))

    const created = await createManyForInitiative(sharePointInitiativeId, payload)
    return created.map(fromSharePointInitiativeComponent)
  },

  async saveByInitiativeId(
    initiativeId: InitiativeId,
    components: readonly SaveInitiativeComponentDto[],
  ): Promise<readonly InitiativeComponent[]> {
    return this.replaceByInitiativeId(initiativeId, components)
  },
}

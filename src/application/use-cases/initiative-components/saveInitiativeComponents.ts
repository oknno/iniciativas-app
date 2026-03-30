import type { ComponentMasterDto } from '../../dto/catalogs/ComponentMasterDto'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { InitiativeComponentDraftDto } from '../../mappers/initiatives/initiativeComponentMappers'
import { getInitiativeComponentDraftErrors, toSaveInitiativeComponentDto } from '../../mappers/initiatives/initiativeComponentMappers'
import { initiativeComponentsRepository } from '../../../services/sharepoint/repositories/initiativeComponentsRepository'

export async function saveInitiativeComponents(
  initiativeId: InitiativeId,
  drafts: readonly InitiativeComponentDraftDto[],
  componentCatalog: readonly ComponentMasterDto[],
): Promise<void> {
  const invalidDraft = drafts.find((draft) => getInitiativeComponentDraftErrors(draft, componentCatalog).length > 0)

  if (invalidDraft) {
    throw new Error('Initiative components contain invalid configuration.')
  }

  const components = drafts.map((draft, index) => toSaveInitiativeComponentDto(draft, initiativeId, componentCatalog, index + 1))

  await initiativeComponentsRepository.saveByInitiativeId(initiativeId, components)
}

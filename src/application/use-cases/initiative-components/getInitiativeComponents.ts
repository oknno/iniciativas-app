import type { ComponentMasterDto } from '../../dto/catalogs/ComponentMasterDto'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { InitiativeComponentDraftDto } from '../../mappers/initiatives/initiativeComponentMappers'
import { toInitiativeComponentDraftDto } from '../../mappers/initiatives/initiativeComponentMappers'
import { initiativeComponentsRepository } from '../../../services/sharepoint/repositories/initiativeComponentsRepository'

export async function getInitiativeComponents(
  initiativeId: InitiativeId,
  componentCatalog: readonly ComponentMasterDto[],
): Promise<readonly InitiativeComponentDraftDto[]> {
  const components = await initiativeComponentsRepository.listByInitiativeId(initiativeId)
  return components
    .slice()
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((component) => toInitiativeComponentDraftDto(component, componentCatalog))
}

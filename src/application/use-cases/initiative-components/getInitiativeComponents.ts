import type { ComponentMasterDto } from '../../dto/catalogs/ComponentMasterDto'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { InitiativeComponentDraftDto } from '../../mappers/initiatives/initiativeComponentMappers'
import { toInitiativeComponentDraftDto } from '../../mappers/initiatives/initiativeComponentMappers'
import { initiativeComponentsRepository } from '../../../services/sharepoint/repositories/initiativeComponentsRepository'

export async function getInitiativeComponents(
  initiativeId: InitiativeId,
  componentCatalog: readonly ComponentMasterDto[],
): Promise<readonly InitiativeComponentDraftDto[]> {
  console.log('[GetInitiativeComponents] Selected initiative id:', initiativeId)
  const components = await initiativeComponentsRepository.listByInitiativeId(initiativeId)
  const drafts = components
    .slice()
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((component) => toInitiativeComponentDraftDto(component, componentCatalog))

  console.log('[GetInitiativeComponents] Resolved draft component types:', drafts.map((item) => item.componentType))
  console.log('[GetInitiativeComponents] Resolved draft KPI codes:', drafts.map((item) => item.kpiCode).filter(Boolean))
  console.log('[GetInitiativeComponents] Resolved draft conversion codes:', drafts.map((item) => item.conversionCode).filter(Boolean))
  console.log('[GetInitiativeComponents] Resolved draft formula codes:', drafts.map((item) => item.formulaCode).filter(Boolean))

  return drafts
}

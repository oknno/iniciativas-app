import type { ComponentMasterDto } from '../../dto/catalogs/ComponentMasterDto'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { InitiativeComponentDraftDto } from '../../mappers/initiatives/initiativeComponentMappers'
import { getInitiativeComponentDraftErrors, toSaveInitiativeComponentDto } from '../../mappers/initiatives/initiativeComponentMappers'
import { InitiativePolicy, type RuleActor } from '../../../domain/initiatives/services/initiativePolicy'
import { BusinessRuleError } from '../../../domain/shared/errors/BusinessRuleError'
import { initiativeComponentsRepository } from '../../../services/sharepoint/repositories/initiativeComponentsRepository'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'
import { catalogsRepository } from '../../../services/sharepoint/repositories/catalogsRepository'
import { governanceRepository } from '../../../services/sharepoint/repositories/governanceRepository'
import { ensureComponentStructure, resolveActor } from '../../services/businessRuleGuards'

export async function saveInitiativeComponents(
  initiativeId: InitiativeId,
  drafts: readonly InitiativeComponentDraftDto[],
  componentCatalog: readonly ComponentMasterDto[],
  actor?: RuleActor,
): Promise<void> {
  const resolvedActor = resolveActor(actor)
  const initiative = await initiativesRepository.getById(initiativeId)

  if (!initiative) {
    throw new BusinessRuleError('Iniciativa não encontrada')
  }

  InitiativePolicy.ensureCanEditStructure(resolvedActor.role, initiative.status)

  const invalidDraft = drafts.find((draft) => getInitiativeComponentDraftErrors(draft, componentCatalog).length > 0)

  if (invalidDraft) {
    throw new BusinessRuleError('Estrutura de componentes inválida')
  }

  const components = drafts.map((draft, index) => toSaveInitiativeComponentDto(draft, initiativeId, componentCatalog, index + 1))
  const [kpiCatalog, formulaCatalog] = await Promise.all([
    catalogsRepository.listKpiCatalog(),
    catalogsRepository.listFormulaCatalog(),
  ])

  ensureComponentStructure(components, kpiCatalog, formulaCatalog)

  await initiativeComponentsRepository.saveByInitiativeId(initiativeId, components)
  await governanceRepository.logAudit({
    initiativeId,
    eventType: 'COMPONENT_STRUCTURE_UPDATED',
    changedBy: resolvedActor.user,
    payload: { componentCount: components.length },
  })
}

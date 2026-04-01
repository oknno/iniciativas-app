import type { InitiativeDetailDto } from '../../dto/initiatives/InitiativeDetailDto'
import type { SaveInitiativeDto } from '../../dto/initiatives/SaveInitiativeDto'
import { toInitiativeDetailDto } from '../../mappers/initiatives/initiativeMappers'
import { InitiativePolicy, type RuleActor } from '../../../domain/initiatives/services/initiativePolicy'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'
import { governanceRepository } from '../../../services/sharepoint/repositories/governanceRepository'
import { ensureRequiredInitiativeFields, resolveActor } from '../../services/businessRuleGuards'

export async function createInitiative(input: SaveInitiativeDto, actor?: RuleActor): Promise<InitiativeDetailDto> {
  const resolvedActor = resolveActor(actor)
  InitiativePolicy.ensureCanCreateInitiative(resolvedActor.role)
  ensureRequiredInitiativeFields(input)

  const created = await initiativesRepository.create(input)

  await governanceRepository.logAudit({
    initiativeId: created.id,
    eventType: 'INITIATIVE_CREATED',
    changedBy: resolvedActor.user,
    payload: { status: created.status },
  })

  return toInitiativeDetailDto(created)
}

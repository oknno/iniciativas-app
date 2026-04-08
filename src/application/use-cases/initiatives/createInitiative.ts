import type { InitiativeDetailDto } from '../../dto/initiatives/InitiativeDetailDto'
import type { SaveInitiativeDto } from '../../dto/initiatives/SaveInitiativeDto'
import { toInitiativeDetailDto } from '../../mappers/initiatives/initiativeMappers'
import { InitiativePolicy, type RuleActor } from '../../../domain/initiatives/services/initiativePolicy'
import { BusinessRuleError } from '../../../domain/shared/errors/BusinessRuleError'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'
import { governanceRepository } from '../../../services/sharepoint/repositories/governanceRepository'
import { ensureRequiredInitiativeFields, resolveActor } from '../../services/businessRuleGuards'

export async function createInitiative(input: SaveInitiativeDto, actor: RuleActor): Promise<InitiativeDetailDto> {
  const resolvedActor = resolveActor(actor)

  try {
    InitiativePolicy.ensureCanCreateInitiative(resolvedActor.role)
  } catch (error) {
    if (error instanceof BusinessRuleError) {
      await governanceRepository.logAccessDenied({
        changedBy: resolvedActor.user,
        action: 'CREATE_INITIATIVE',
        role: resolvedActor.role,
        reason: error.message,
      })
    }

    throw error
  }

  const normalizedInput: SaveInitiativeDto = {
    ...input,
    status: InitiativePolicy.getInitialStatus(),
  }
  console.info('[Initiative Save] create with status:', normalizedInput.status)
  ensureRequiredInitiativeFields(normalizedInput)

  const created = await initiativesRepository.create(normalizedInput)

  await governanceRepository.logAudit({
    title: 'INITIATIVE_CREATED',
    initiativeId: created.id,
    entityType: 'Initiative',
    entityId: String(created.id),
    changedBy: resolvedActor.user,
    changes: [{ fieldName: 'Status', newValue: created.status }],
  })

  return toInitiativeDetailDto(created)
}

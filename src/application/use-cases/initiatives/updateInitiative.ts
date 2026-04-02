import type { InitiativeDetailDto } from '../../dto/initiatives/InitiativeDetailDto'
import type { SaveInitiativeDto } from '../../dto/initiatives/SaveInitiativeDto'
import { toInitiativeDetailDto } from '../../mappers/initiatives/initiativeMappers'
import { InitiativePolicy, type RuleActor } from '../../../domain/initiatives/services/initiativePolicy'
import { BusinessRuleError } from '../../../domain/shared/errors/BusinessRuleError'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'
import { governanceRepository } from '../../../services/sharepoint/repositories/governanceRepository'
import { ensureRequiredInitiativeFields, resolveActor } from '../../services/businessRuleGuards'

export async function updateInitiative(input: SaveInitiativeDto, actor?: RuleActor): Promise<InitiativeDetailDto> {
  if (!input.id) {
    throw new BusinessRuleError('Iniciativa não encontrada')
  }

  const resolvedActor = resolveActor(actor)
  const current = await initiativesRepository.getById(input.id)

  if (!current) {
    throw new BusinessRuleError('Iniciativa não encontrada')
  }

  const normalizedInput: SaveInitiativeDto = {
    ...input,
    status: input.status.trim() || current.status,
  }

  console.info('[Initiative Save] update with status:', {
    from: current.status,
    requested: input.status,
    used: normalizedInput.status,
  })

  ensureRequiredInitiativeFields(normalizedInput)
  InitiativePolicy.ensureStatusTransition(current.status, normalizedInput.status)

  if (normalizedInput.status === 'Aprovada') {
    InitiativePolicy.ensureCanApprove(resolvedActor.role)
  }

  if (normalizedInput.status === 'Reprovada') {
    InitiativePolicy.ensureCanReject(resolvedActor.role)
  }

  const updated = await initiativesRepository.update(normalizedInput)

  if (current.status !== updated.status) {
    await governanceRepository.addStatusHistory({
      initiativeId: updated.id,
      from: current.status,
      to: updated.status,
      changedBy: resolvedActor.user,
    })
  }

  await governanceRepository.logAudit({
    initiativeId: updated.id,
    eventType: 'INITIATIVE_UPDATED',
    changedBy: resolvedActor.user,
    payload: { fromStatus: current.status, toStatus: updated.status },
  })

  return toInitiativeDetailDto(updated)
}

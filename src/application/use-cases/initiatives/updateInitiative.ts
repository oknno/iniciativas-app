import type { InitiativeDetailDto } from '../../dto/initiatives/InitiativeDetailDto'
import type { SaveInitiativeDto } from '../../dto/initiatives/SaveInitiativeDto'
import { toInitiativeDetailDto } from '../../mappers/initiatives/initiativeMappers'
import { InitiativePolicy, type RuleActor } from '../../../domain/initiatives/services/initiativePolicy'
import { BusinessRuleError } from '../../../domain/shared/errors/BusinessRuleError'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'
import { governanceRepository } from '../../../services/sharepoint/repositories/governanceRepository'
import { ensureRequiredInitiativeFields, resolveActor } from '../../services/businessRuleGuards'

export async function updateInitiative(input: SaveInitiativeDto, actor: RuleActor): Promise<InitiativeDetailDto> {
  if (!input.id) {
    throw new BusinessRuleError('Iniciativa não encontrada')
  }

  const resolvedActor = resolveActor(actor)
  const current = await initiativesRepository.getById(input.id)

  if (!current) {
    throw new BusinessRuleError('Iniciativa não encontrada')
  }

  const requestedStatus = input.status.trim()
  const normalizedInput: SaveInitiativeDto = {
    ...input,
    status: requestedStatus || current.status,
    decisionComment: input.decisionComment?.trim(),
  }

  console.info('[Initiative Save] update with status:', {
    from: current.status,
    requested: input.status,
    used: normalizedInput.status,
  })

  ensureRequiredInitiativeFields(normalizedInput)

  let transitionDecision: ReturnType<typeof InitiativePolicy.ensureCanTransition> | undefined

  try {
    if (current.status !== normalizedInput.status) {
      transitionDecision = InitiativePolicy.ensureCanTransition(resolvedActor.role, current.status, normalizedInput.status)

      if (transitionDecision.action === 'RETURN_TO_OWNER' && !normalizedInput.decisionComment) {
        throw new BusinessRuleError('Comentário obrigatório para devoluções e reprovações')
      }
    }
  } catch (error) {
    if (error instanceof BusinessRuleError) {
      await governanceRepository.logAccessDenied({
        initiativeId: current.id,
        changedBy: resolvedActor.user,
        action: 'UPDATE_INITIATIVE',
        role: resolvedActor.role,
        reason: error.message,
      })
    }

    throw error
  }

  const updated = await initiativesRepository.update(normalizedInput)

  if (current.status !== updated.status) {
    await governanceRepository.addStatusHistory({
      initiativeId: updated.id,
      from: current.status,
      to: updated.status,
      initiativeStatus: updated.status,
      changedBy: resolvedActor.user,
      targetRole: transitionDecision?.targetRole,
      comment: normalizedInput.decisionComment,
    })
  }

  await governanceRepository.logAudit({
    title: transitionDecision?.action ?? 'INITIATIVE_UPDATED',
    initiativeId: updated.id,
    entityType: 'Initiative',
    entityId: String(updated.id),
    changedBy: resolvedActor.user,
    changes: [
      { fieldName: 'Status', oldValue: current.status, newValue: updated.status },
      { fieldName: 'Action', newValue: transitionDecision?.action },
      { fieldName: 'TargetRole', newValue: transitionDecision?.targetRole },
      { fieldName: 'Comment', newValue: normalizedInput.decisionComment },
    ],
  })

  return toInitiativeDetailDto(updated)
}

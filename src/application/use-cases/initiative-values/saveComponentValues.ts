import type { SaveComponentValueDto } from '../../dto/initiatives/SaveComponentValueDto'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { RuleActor } from '../../../domain/initiatives/services/initiativePolicy'
import { InitiativePolicy } from '../../../domain/initiatives/services/initiativePolicy'
import { BusinessRuleError } from '../../../domain/shared/errors/BusinessRuleError'
import { initiativeValuesRepository } from '../../../services/sharepoint/repositories/initiativeValuesRepository'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'
import { governanceRepository } from '../../../services/sharepoint/repositories/governanceRepository'
import { resolveActor } from '../../services/businessRuleGuards'

export async function saveComponentValues(
  values: readonly SaveComponentValueDto[],
  actor: RuleActor,
  initiativeIdOverride?: InitiativeId,
): Promise<void> {
  const resolvedActor = resolveActor(actor)

  const initiativeId = initiativeIdOverride ?? values[0]?.initiativeId
  if (!initiativeId) {
    throw new BusinessRuleError('Iniciativa não encontrada')
  }

  const initiative = await initiativesRepository.getById(initiativeId)
  if (!initiative) {
    throw new BusinessRuleError('Iniciativa não encontrada')
  }

  try {
    InitiativePolicy.ensureCanEditComponentValues(resolvedActor.role, initiative.status)
  } catch (error) {
    if (error instanceof BusinessRuleError) {
      await governanceRepository.logAccessDenied({
        initiativeId,
        changedBy: resolvedActor.user,
        action: 'SAVE_COMPONENT_VALUES',
        role: resolvedActor.role,
        reason: error.message,
      })
    }
    throw error
  }

  await initiativeValuesRepository.saveComponentValues(values)
  await governanceRepository.logAudit({
    title: 'COMPONENT_VALUES_UPDATED',
    initiativeId,
    entityType: 'ComponentValues',
    entityId: String(initiativeId),
    changedBy: resolvedActor.user,
    changes: [{ fieldName: 'RowsAffected', newValue: String(values.length) }],
  })
}

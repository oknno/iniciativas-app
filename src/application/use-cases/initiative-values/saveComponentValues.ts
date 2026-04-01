import type { SaveComponentValueDto } from '../../dto/initiatives/SaveComponentValueDto'
import type { RuleActor } from '../../../domain/initiatives/services/initiativePolicy'
import { InitiativePolicy } from '../../../domain/initiatives/services/initiativePolicy'
import { BusinessRuleError } from '../../../domain/shared/errors/BusinessRuleError'
import { initiativeValuesRepository } from '../../../services/sharepoint/repositories/initiativeValuesRepository'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'
import { governanceRepository } from '../../../services/sharepoint/repositories/governanceRepository'
import { resolveActor } from '../../services/businessRuleGuards'

export async function saveComponentValues(values: readonly SaveComponentValueDto[], actor?: RuleActor): Promise<void> {
  if (values.length === 0) {
    return
  }

  const resolvedActor = resolveActor(actor)
  InitiativePolicy.ensureCanEditComponentValues(resolvedActor.role)

  const initiativeId = values[0]?.initiativeId
  if (!initiativeId) {
    throw new BusinessRuleError('Iniciativa não encontrada')
  }

  const initiative = await initiativesRepository.getById(initiativeId)
  if (!initiative) {
    throw new BusinessRuleError('Iniciativa não encontrada')
  }

  await initiativeValuesRepository.saveComponentValues(values)
  await governanceRepository.logAudit({
    initiativeId,
    eventType: 'COMPONENT_VALUES_UPDATED',
    changedBy: resolvedActor.user,
    payload: { rows: values.length },
  })
}

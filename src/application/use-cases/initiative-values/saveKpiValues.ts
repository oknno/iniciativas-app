import type { SaveKpiValueDto } from '../../dto/initiatives/SaveKpiValueDto'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { RuleActor } from '../../../domain/initiatives/services/initiativePolicy'
import { InitiativePolicy } from '../../../domain/initiatives/services/initiativePolicy'
import { BusinessRuleError } from '../../../domain/shared/errors/BusinessRuleError'
import { initiativeValuesRepository } from '../../../services/sharepoint/repositories/initiativeValuesRepository'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'
import { catalogsRepository } from '../../../services/sharepoint/repositories/catalogsRepository'
import { governanceRepository } from '../../../services/sharepoint/repositories/governanceRepository'
import { ensureKpiExists, resolveActor } from '../../services/businessRuleGuards'

export async function saveKpiValues(
  values: readonly SaveKpiValueDto[],
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
    InitiativePolicy.ensureCanEditKpiValues(resolvedActor.role, initiative.status)
  } catch (error) {
    if (error instanceof BusinessRuleError) {
      await governanceRepository.logAccessDenied({
        initiativeId,
        changedBy: resolvedActor.user,
        action: 'SAVE_KPI_VALUES',
        role: resolvedActor.role,
        reason: error.message,
      })
    }
    throw error
  }

  if (values.length > 0) {
    const kpiCatalog = await catalogsRepository.listKpiCatalog()
    values.forEach((value) => ensureKpiExists(value.kpiCode, kpiCatalog))
  }

  await initiativeValuesRepository.saveKpiValues(values)
  await governanceRepository.logAudit({
    initiativeId,
    eventType: 'KPI_VALUES_UPDATED',
    changedBy: resolvedActor.user,
    payload: { rows: values.length },
  })
}

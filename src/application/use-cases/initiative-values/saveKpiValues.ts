import type { SaveKpiValueDto } from '../../dto/initiatives/SaveKpiValueDto'
import type { RuleActor } from '../../../domain/initiatives/services/initiativePolicy'
import { InitiativePolicy } from '../../../domain/initiatives/services/initiativePolicy'
import { BusinessRuleError } from '../../../domain/shared/errors/BusinessRuleError'
import { initiativeValuesRepository } from '../../../services/sharepoint/repositories/initiativeValuesRepository'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'
import { catalogsRepository } from '../../../services/sharepoint/repositories/catalogsRepository'
import { governanceRepository } from '../../../services/sharepoint/repositories/governanceRepository'
import { ensureKpiExists, resolveActor } from '../../services/businessRuleGuards'

export async function saveKpiValues(values: readonly SaveKpiValueDto[], actor?: RuleActor): Promise<void> {
  if (values.length === 0) {
    return
  }

  const resolvedActor = resolveActor(actor)
  InitiativePolicy.ensureCanEditKpiValues(resolvedActor.role)

  const initiativeId = values[0]?.initiativeId
  if (!initiativeId) {
    throw new BusinessRuleError('Iniciativa não encontrada')
  }

  const initiative = await initiativesRepository.getById(initiativeId)
  if (!initiative) {
    throw new BusinessRuleError('Iniciativa não encontrada')
  }

  const kpiCatalog = await catalogsRepository.listKpiCatalog()
  values.forEach((value) => ensureKpiExists(value.kpiCode, kpiCatalog))

  await initiativeValuesRepository.saveKpiValues(values)
  await governanceRepository.logAudit({
    initiativeId,
    eventType: 'KPI_VALUES_UPDATED',
    changedBy: resolvedActor.user,
    payload: { rows: values.length },
  })
}

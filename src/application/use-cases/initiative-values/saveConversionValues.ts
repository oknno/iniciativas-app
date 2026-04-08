import type { SaveConversionValueDto } from '../../dto/initiatives/SaveConversionValueDto'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { RuleActor } from '../../../domain/initiatives/services/initiativePolicy'
import { InitiativePolicy } from '../../../domain/initiatives/services/initiativePolicy'
import { BusinessRuleError } from '../../../domain/shared/errors/BusinessRuleError'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'
import { governanceRepository } from '../../../services/sharepoint/repositories/governanceRepository'
import { conversionValuesRepository } from '../../../services/sharepoint/repositories/conversionValuesRepository'
import { resolveActor } from '../../services/businessRuleGuards'

export async function saveConversionValues(
  values: readonly SaveConversionValueDto[],
  actor: RuleActor,
  initiativeIdOverride?: InitiativeId,
  context?: {
    readonly year: number
    readonly scenario: SaveConversionValueDto['scenario']
  },
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
    InitiativePolicy.ensureCanEditConversionValues(resolvedActor.role, initiative.status)
  } catch (error) {
    if (error instanceof BusinessRuleError) {
      await governanceRepository.logAccessDenied({
        initiativeId,
        changedBy: resolvedActor.user,
        action: 'SAVE_CONVERSION_VALUES',
        role: resolvedActor.role,
        reason: error.message,
      })
    }
    throw error
  }

  const yearScenario = values[0]
  if (!yearScenario && !context) {
    return
  }

  const [yearToken] = (yearScenario?.monthRef ?? `${context?.year ?? ''}-01`).split('-')
  const parsedYear = Number(yearToken)
  if (!Number.isInteger(parsedYear)) {
    throw new BusinessRuleError('Ano inválido para salvar conversões')
  }

  const scenario = yearScenario?.scenario ?? context?.scenario
  if (!scenario) {
    throw new BusinessRuleError('Cenário inválido para salvar conversões')
  }

  await conversionValuesRepository.replaceByInitiativeYearScenario(initiativeId, parsedYear, scenario, values)
  await governanceRepository.logConversionValuesChanged({
    initiativeId,
    changedBy: resolvedActor.user,
    rowsAffected: values.length,
    scenario,
    year: parsedYear,
  })
}

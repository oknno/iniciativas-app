import type { SaveInitiativeComponentDto } from '../dto/initiatives/SaveInitiativeComponentDto'
import { BusinessRuleError } from '../../domain/shared/errors/BusinessRuleError'
import { InitiativePolicy, type RuleActor } from '../../domain/initiatives/services/initiativePolicy'
import type { KpiMasterDto } from '../dto/catalogs/KpiMasterDto'
import type { FormulaMasterDto } from '../dto/catalogs/FormulaMasterDto'
import type { FormulaTerm } from '../../domain/catalogs/entities/FormulaTerm'

export const resolveActor = (actor?: RuleActor): RuleActor => {
  if (!actor) {
    throw new BusinessRuleError('Ator é obrigatório para esta operação')
  }

  return actor
}

export const ensureRequiredInitiativeFields = (input: {
  readonly title: string
  readonly unidade: string
  readonly responsavel: string
  readonly stage: string
  readonly status: string
}): void => {
  if (!input.title.trim() || !input.unidade.trim() || !input.responsavel.trim() || !input.stage.trim()) {
    throw new BusinessRuleError('Campos obrigatórios não preenchidos')
  }

  InitiativePolicy.ensureValidStatus(input.status)
}

export const ensureKpiExists = (kpiCode: string | undefined, kpis: readonly KpiMasterDto[]): void => {
  if (!kpiCode) {
    throw new BusinessRuleError('KPI inválido')
  }

  if (!kpis.some((kpi) => kpi.code === kpiCode)) {
    throw new BusinessRuleError('KPI inválido')
  }
}

export const ensureFormulaExists = (formulaCode: string | undefined, formulas: readonly FormulaMasterDto[]): void => {
  if (!formulaCode || !formulas.some((formula) => formula.code === formulaCode)) {
    throw new BusinessRuleError('Fórmula inválida')
  }
}

export const ensureComponentStructure = (
  components: readonly SaveInitiativeComponentDto[],
  kpis: readonly KpiMasterDto[],
  formulas: readonly FormulaMasterDto[],
): void => {
  components.forEach((component) => {
    ensureFormulaExists(component.formulaCode, formulas)
    if (component.calculationType === 'KPI_BASED') {
      ensureKpiExists(component.kpiCode, kpis)
    }
  })
}

export const ensureFormulaTermsOrFallback = (formulaTerms: readonly FormulaTerm[]): void => {
  if (formulaTerms.length === 0) {
    return
  }

  if (formulaTerms.length < 1) {
    throw new BusinessRuleError('Fórmula inválida')
  }
}

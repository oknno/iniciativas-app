import type { InitiativeStatus } from '../entities/InitiativeStatus'
import { isInitiativeStatus, isStatusTransitionAllowed } from '../entities/InitiativeStatus'
import { BusinessRuleError } from '../../shared/errors/BusinessRuleError'

export const USER_ROLES = ['OWNER', 'CTRL_LOCAL', 'CTRL_ESTRATEGICA', 'DEV', 'ADMIN'] as const
export type UserRole = (typeof USER_ROLES)[number]

export interface RuleActor {
  readonly user: string
  readonly role: UserRole
}

export const SYSTEM_ACTOR: RuleActor = {
  user: 'system',
  role: 'ADMIN',
}

const ensureRole = (role: UserRole, allowed: readonly UserRole[], message: string): void => {
  if (!allowed.includes(role)) {
    throw new BusinessRuleError(message)
  }
}

const isFullAccessRole = (role: UserRole): boolean => role === 'DEV' || role === 'ADMIN'

const ensureValidStatus = (status: string): InitiativeStatus => {
  if (!isInitiativeStatus(status)) {
    throw new BusinessRuleError('Transição de status inválida')
  }

  return status
}

export const InitiativePolicy = {
  ensureValidStatus,

  ensureStatusTransition(from: string, to: string): void {
    const source = ensureValidStatus(from)
    const target = ensureValidStatus(to)

    if (source === target) {
      return
    }

    if (!isStatusTransitionAllowed(source, target)) {
      throw new BusinessRuleError('Transição de status inválida')
    }
  },

  ensureStructureEditable(status: string): void {
    const initiativeStatus = ensureValidStatus(status)
    if (initiativeStatus === 'Aprovada') {
      throw new BusinessRuleError('Estrutura não pode ser alterada após aprovação')
    }
  },

  ensureCanCreateInitiative(role: UserRole): void {
    ensureRole(role, ['OWNER', 'DEV', 'ADMIN'], 'Permissão insuficiente para criar iniciativa')
  },

  ensureCanEditStructure(role: UserRole, status: string): void {
    if (isFullAccessRole(role)) {
      this.ensureStructureEditable(status)
      return
    }

    const initiativeStatus = ensureValidStatus(status)
    if (role === 'OWNER' && initiativeStatus === 'Em preenchimento') {
      return
    }

    if (role === 'CTRL_LOCAL' && initiativeStatus === 'Em revisão') {
      return
    }

    throw new BusinessRuleError('Papel atual não pode editar a estrutura nesta fase')
  },

  ensureCanEditKpiValues(role: UserRole, status: string): void {
    if (isFullAccessRole(role)) {
      return
    }

    const initiativeStatus = ensureValidStatus(status)
    if (role === 'OWNER' && initiativeStatus === 'Em preenchimento') {
      return
    }

    throw new BusinessRuleError('Papel atual não pode editar KPI nesta fase')
  },

  ensureCanEditComponentValues(role: UserRole, status: string): void {
    if (isFullAccessRole(role)) {
      return
    }

    const initiativeStatus = ensureValidStatus(status)
    if (role === 'OWNER' && initiativeStatus === 'Em preenchimento') {
      return
    }

    throw new BusinessRuleError('Papel atual não pode editar custos nesta fase')
  },

  ensureCanValidateLocal(role: UserRole, from: string, to: string): void {
    if (isFullAccessRole(role)) {
      this.ensureStatusTransition(from, to)
      return
    }

    if (role !== 'CTRL_LOCAL') {
      throw new BusinessRuleError('Permissão insuficiente para validação local')
    }

    const source = ensureValidStatus(from)
    const target = ensureValidStatus(to)
    if (source !== 'Em revisão' || target !== 'Em validação') {
      throw new BusinessRuleError('Validação local só pode avançar de Em revisão para Em validação')
    }
  },

  ensureCanApprove(role: UserRole, from: string, to: string): void {
    if (isFullAccessRole(role)) {
      this.ensureStatusTransition(from, to)
      return
    }

    if (role !== 'CTRL_ESTRATEGICA') {
      throw new BusinessRuleError('Permissão insuficiente para aprovar iniciativa')
    }

    const source = ensureValidStatus(from)
    const target = ensureValidStatus(to)
    if (source !== 'Em validação' || target !== 'Aprovada') {
      throw new BusinessRuleError('Aprovação final só pode avançar de Em validação para Aprovada')
    }
  },

  ensureCanReject(role: UserRole, from: string, to: string): void {
    if (isFullAccessRole(role)) {
      this.ensureStatusTransition(from, to)
      return
    }

    if (role !== 'CTRL_ESTRATEGICA') {
      throw new BusinessRuleError('Permissão insuficiente para reprovar iniciativa')
    }

    const source = ensureValidStatus(from)
    const target = ensureValidStatus(to)
    if (source !== 'Em validação' || target !== 'Reprovada') {
      throw new BusinessRuleError('Reprovação final só pode avançar de Em validação para Reprovada')
    }
  },
}

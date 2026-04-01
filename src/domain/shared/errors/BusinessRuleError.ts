import { DomainError } from './DomainError'

export class BusinessRuleError extends DomainError {
  public constructor(message: string, code = 'BUSINESS_RULE_ERROR') {
    super(message, code)
    this.name = 'BusinessRuleError'
  }
}

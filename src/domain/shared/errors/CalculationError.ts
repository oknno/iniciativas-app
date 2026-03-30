import { DomainError } from './DomainError'

export class CalculationError extends DomainError {
  public constructor(message: string) {
    super(message, 'CALCULATION_ERROR')
    this.name = 'CalculationError'
  }
}

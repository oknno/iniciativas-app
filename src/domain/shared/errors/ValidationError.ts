import { DomainError } from './DomainError'

export class ValidationError extends DomainError {
  public constructor(message: string) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

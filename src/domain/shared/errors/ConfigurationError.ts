import { DomainError } from './DomainError'

export class ConfigurationError extends DomainError {
  public constructor(message: string) {
    super(message, 'CONFIGURATION_ERROR')
    this.name = 'ConfigurationError'
  }
}

import type { InitiativeRepository } from './contracts/InitiativeRepository'
import { ApiInitiativeRepository } from './api/ApiInitiativeRepository'
import { MockInitiativeRepository } from './mock/MockInitiativeRepository'

const DATA_PROVIDER = import.meta.env.VITE_DATA_PROVIDER

function createInitiativeRepository(): InitiativeRepository {
  switch (DATA_PROVIDER) {
    case 'api':
      return new ApiInitiativeRepository()
    case 'mock':
    default:
      return new MockInitiativeRepository()
  }
}

export const initiativeRepository = createInitiativeRepository()

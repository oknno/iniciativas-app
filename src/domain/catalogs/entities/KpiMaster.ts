import type { KpiCode } from '../value-objects/KpiCode'

export interface KpiMaster {
  readonly code: KpiCode
  readonly name: string
  readonly unit: string
  readonly description?: string
  readonly active: boolean
}

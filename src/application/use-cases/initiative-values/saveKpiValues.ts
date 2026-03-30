import type { SaveKpiValueDto } from '../../dto/initiatives/SaveKpiValueDto'
import { initiativeValuesRepository } from '../../../services/sharepoint/repositories/initiativeValuesRepository'

export async function saveKpiValues(values: readonly SaveKpiValueDto[]): Promise<void> {
  await initiativeValuesRepository.saveKpiValues(values)
}

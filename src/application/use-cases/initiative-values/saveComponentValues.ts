import type { SaveComponentValueDto } from '../../dto/initiatives/SaveComponentValueDto'
import { initiativeValuesRepository } from '../../../services/sharepoint/repositories/initiativeValuesRepository'

export async function saveComponentValues(values: readonly SaveComponentValueDto[]): Promise<void> {
  await initiativeValuesRepository.saveComponentValues(values)
}

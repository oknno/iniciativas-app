import type { CatalogsDtoBundle } from '../../mappers/catalogs/catalogMappers'
import { buildCatalogsDtoBundle } from '../../mappers/catalogs/catalogMappers'
import { catalogsRepository } from '../../../services/sharepoint/repositories/catalogsRepository'

export async function getCatalogs(): Promise<CatalogsDtoBundle> {
  const catalogs = await catalogsRepository.listAllCatalogs()
  return buildCatalogsDtoBundle(catalogs)
}

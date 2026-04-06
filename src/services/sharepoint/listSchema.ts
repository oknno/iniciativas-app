import { get } from './spHttp'
import { listEndpoint } from './spUrls'

interface SharePointFieldDefinition {
  readonly InternalName: string
  readonly TypeAsString?: string
  readonly TypeDisplayName?: string
}

interface SharePointListFieldsResponse {
  readonly value: readonly SharePointFieldDefinition[]
}

const fieldsCache = new Map<string, Promise<Readonly<Record<string, string>>>>()

const loadFieldTypes = async (listTitle: string): Promise<Readonly<Record<string, string>>> => {
  const response = await get<SharePointListFieldsResponse>(
    `${listEndpoint(listTitle)}/fields?$select=InternalName,TypeAsString,TypeDisplayName`,
  )

  return response.value.reduce<Record<string, string>>((acc, field) => {
    const type = field.TypeAsString ?? field.TypeDisplayName
    if (type) {
      acc[field.InternalName] = type
    }
    return acc
  }, {})
}

const getFieldTypes = async (listTitle: string): Promise<Readonly<Record<string, string>>> => {
  const cached = fieldsCache.get(listTitle)
  if (cached) {
    return cached
  }

  const loading = loadFieldTypes(listTitle)
  fieldsCache.set(listTitle, loading)
  return loading
}

export const assertListFieldType = async (
  listTitle: string,
  fieldName: string,
  expectedType: 'Lookup' | 'Text',
): Promise<void> => {
  const typesByField = await getFieldTypes(listTitle)
  const actual = typesByField[fieldName]

  if (!actual) {
    throw new Error(`Field '${fieldName}' not found in list '${listTitle}'.`)
  }

  if (actual !== expectedType) {
    throw new Error(
      `Invalid SharePoint schema for '${listTitle}.${fieldName}'. Expected '${expectedType}', received '${actual}'.`,
    )
  }
}

import { sharePointContext } from './spContext'

interface SharePointErrorPayload {
  readonly error?: {
    readonly message?: string | { readonly value?: string }
  }
}

const jsonHeaders = {
  Accept: 'application/json;odata=nometadata',
  'Content-Type': 'application/json;odata=nometadata',
} as const

const buildHeaders = (headers: HeadersInit = {}): Headers => {
  const combined = new Headers(sharePointContext.defaultHeaders)
  const custom = new Headers(headers)

  custom.forEach((value, key) => {
    combined.set(key, value)
  })

  return combined
}

const parseJson = async <T>(response: Response): Promise<T | undefined> => {
  const contentType = response.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return undefined
  }

  return (await response.json()) as T
}

const unwrapErrorMessage = (payload: SharePointErrorPayload | undefined): string | undefined => {
  const message = payload?.error?.message
  if (typeof message === 'string') {
    return message
  }

  if (message && typeof message.value === 'string') {
    return message.value
  }

  return undefined
}

const throwIfNotOk = async (response: Response, method: string, url: string): Promise<void> => {
  if (response.ok) {
    return
  }

  const payload = await parseJson<SharePointErrorPayload>(response)
  const detail = unwrapErrorMessage(payload) ?? response.statusText ?? 'Unknown SharePoint error'
  throw new Error(`[SharePoint ${method}] ${response.status} ${response.statusText} for ${url}. ${detail}`)
}

const getDigestEndpoint = (): string => `${sharePointContext.apiBasePath}/contextinfo`

export const getRequestDigest = async (): Promise<string> => {
  const response = await fetch(getDigestEndpoint(), {
    method: 'POST',
    headers: buildHeaders(jsonHeaders),
  })

  await throwIfNotOk(response, 'POST', getDigestEndpoint())

  const payload = await parseJson<{
    readonly FormDigestValue?: string
    readonly d?: { readonly GetContextWebInformation?: { readonly FormDigestValue?: string } }
  }>(response)

  const digest = payload?.FormDigestValue ?? payload?.d?.GetContextWebInformation?.FormDigestValue

  if (!digest) {
    throw new Error('SharePoint request digest not found in contextinfo response.')
  }

  return digest
}

const resolveJsonPayload = async <T>(response: Response): Promise<T> => {
  const payload = await parseJson<T>(response)
  if (payload === undefined) {
    throw new Error('SharePoint response did not contain a JSON payload.')
  }

  return payload
}

export const get = async <T>(url: string, headers?: HeadersInit): Promise<T> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(headers),
  })

  await throwIfNotOk(response, 'GET', url)
  return resolveJsonPayload<T>(response)
}

export const post = async <T, TBody extends object>(url: string, body: TBody): Promise<T> => {
  const digest = await getRequestDigest()

  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders({
      ...jsonHeaders,
      'X-RequestDigest': digest,
    }),
    body: JSON.stringify(body),
  })

  await throwIfNotOk(response, 'POST', url)
  return resolveJsonPayload<T>(response)
}

export const merge = async <T, TBody extends object>(url: string, body: TBody): Promise<T> => {
  const digest = await getRequestDigest()

  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders({
      ...jsonHeaders,
      'X-RequestDigest': digest,
      'X-HTTP-Method': 'MERGE',
      'IF-MATCH': '*',
    }),
    body: JSON.stringify(body),
  })

  await throwIfNotOk(response, 'MERGE', url)
  return resolveJsonPayload<T>(response)
}

export const deleteItem = async (url: string): Promise<void> => {
  const digest = await getRequestDigest()

  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders({
      ...jsonHeaders,
      'X-RequestDigest': digest,
      'X-HTTP-Method': 'DELETE',
      'IF-MATCH': '*',
    }),
  })

  await throwIfNotOk(response, 'DELETE', url)
}

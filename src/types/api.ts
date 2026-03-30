export interface ApiErrorPayload {
  readonly code: string
  readonly message: string
  readonly details?: Record<string, string>
}

export interface ApiResponse<TData> {
  readonly success: boolean
  readonly data?: TData
  readonly error?: ApiErrorPayload
}

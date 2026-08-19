/**
 * FE-009 — API error normalization.
 * Menangani kedua bentuk envelope error (docs/API.md dan Architecture.md),
 * timeout, dan network error.
 */

const STATUS_TO_CODE: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'VALIDATION_ERROR',
  429: 'TOO_MANY_REQUESTS',
  500: 'INTERNAL_ERROR',
}

export type ErrorDetails = Record<string, string | string[]>

export class ApiError extends Error {
  readonly status: number | null
  readonly code: string
  readonly details: ErrorDetails | null

  constructor(
    status: number | null,
    code: string,
    message: string,
    details: ErrorDetails | null = null,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }

  get isValidationError(): boolean {
    return this.status === 422 || this.code === 'VALIDATION_ERROR'
  }

  get isUnauthorized(): boolean {
    return this.status === 401
  }

  get isForbidden(): boolean {
    return this.status === 403
  }

  get isNotFound(): boolean {
    return this.status === 404
  }

  get isConflict(): boolean {
    return this.status === 409
  }

  get isNetworkError(): boolean {
    return this.code === 'NETWORK_ERROR'
  }

  get isTimeout(): boolean {
    return this.code === 'TIMEOUT'
  }

  fieldMessage(field: string): string | undefined {
    const detail = this.details?.[field]
    if (Array.isArray(detail)) return detail[0]
    return detail
  }

  static network(): ApiError {
    return new ApiError(
      null,
      'NETWORK_ERROR',
      'Tidak dapat terhubung ke server. Periksa koneksi Anda.',
    )
  }

  static timeout(): ApiError {
    return new ApiError(null, 'TIMEOUT', 'Permintaan tidak dijawab server. Silakan coba lagi.')
  }

  static fromResponse(status: number, body: unknown): ApiError {
    const fallbackCode = STATUS_TO_CODE[status] ?? 'INTERNAL_ERROR'
    const fallbackMessage = `Permintaan gagal (${status}).`

    if (!body || typeof body !== 'object') {
      return new ApiError(status, fallbackCode, fallbackMessage)
    }

    const record = body as Record<string, unknown>

    if (record.success === false) {
      const error = record.error
      if (error && typeof error === 'object') {
        const e = error as Record<string, unknown>
        return new ApiError(
          status,
          typeof e.code === 'string' ? e.code : fallbackCode,
          typeof e.message === 'string' ? e.message : fallbackMessage,
          normalizeDetails(e.details),
        )
      }
      if (typeof record.message === 'string') {
        return new ApiError(status, fallbackCode, record.message, normalizeDetails(record.errors))
      }
    }

    return new ApiError(status, fallbackCode, fallbackMessage)
  }
}

function normalizeDetails(value: unknown): ErrorDetails | null {
  if (!value || typeof value !== 'object') return null
  const details: ErrorDetails = {}
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry === 'string') {
      details[key] = entry
    } else if (Array.isArray(entry)) {
      details[key] = entry.filter((item): item is string => typeof item === 'string')
    }
  }
  return Object.keys(details).length > 0 ? details : null
}

export type FieldErrorSetter = (field: string, message: string) => void

/**
 * FE-063 — Petakan error validasi API (422) ke field form terkait.
 * Mengembalikan pesan umum bila tidak ada detail field yang cocok.
 */
export function mapFieldErrors(
  error: unknown,
  setFieldError: FieldErrorSetter,
  fields?: string[],
): string | null {
  if (!(error instanceof ApiError)) {
    return 'Terjadi kesalahan. Silakan coba lagi.'
  }
  if (error.isValidationError && error.details) {
    const candidates = fields ?? Object.keys(error.details)
    let applied = false
    for (const field of candidates) {
      const message = error.fieldMessage(field)
      if (message) {
        setFieldError(field, message)
        applied = true
      }
    }
    if (applied) return null
  }
  return error.message
}

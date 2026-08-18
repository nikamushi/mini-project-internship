/**
 * FE-009 — Centralized API client.
 * Semua request API melewati client ini; page/component tidak melakukan
 * fetch langsung. Session-based auth (cookie HttpOnly, credentials: include).
 */

import { ApiError } from '@/api/errors'
import { API_BASE_URL, API_TIMEOUT_MS } from '@/config/env'
import type { ApiListResponse, ApiResponse, PaginationMeta } from '@/api/types'

type QueryValue = string | number | boolean | null | undefined

export type QueryParams = Record<string, QueryValue>

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  formData?: FormData
  params?: QueryParams
  timeoutMs?: number
}

export interface ApiListResult<T> {
  data: T[]
  meta: PaginationMeta
}

let unauthorizedHandler: (() => void) | null = null

/**
 * Didaftarkan pada fase authentication (FE-012) untuk redirect saat 401.
 */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler
}

function buildUrl(path: string, params?: QueryParams): string {
  const base = `${API_BASE_URL}${path}`
  if (!params) return base
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    search.set(key, String(value))
  }
  const query = search.toString()
  return query ? `${base}?${query}` : base
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new ApiError(
      response.status,
      'INVALID_RESPONSE',
      'Server mengembalikan data yang tidak valid.',
    )
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), options.timeoutMs ?? API_TIMEOUT_MS)

  try {
    const headers: Record<string, string> = { Accept: 'application/json' }
    let body: BodyInit | undefined
    if (options.formData) {
      body = options.formData
    } else if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(options.body)
    }

    let response: Response
    try {
      response = await fetch(buildUrl(path, options.params), {
        method: options.method ?? 'GET',
        headers,
        body,
        credentials: 'include',
        signal: controller.signal,
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw ApiError.timeout()
      }
      throw ApiError.network()
    }

    if (response.status === 204) {
      return undefined as T
    }

    const payload = await parseBody(response)

    if (!response.ok) {
      const apiError = ApiError.fromResponse(response.status, payload)
      if (apiError.isUnauthorized && unauthorizedHandler && !path.startsWith('/auth/')) {
        unauthorizedHandler()
      }
      throw apiError
    }

    if (payload && typeof payload === 'object' && 'success' in payload) {
      return (payload as ApiResponse<T>).data
    }
    return payload as T
  } finally {
    window.clearTimeout(timer)
  }
}

async function requestList<T>(path: string, params?: QueryParams): Promise<ApiListResult<T>> {
  const envelope = await request<ApiListResponse<T>>(path, { method: 'GET', params })
  return {
    data: envelope.data ?? [],
    meta: {
      page: envelope.meta?.page ?? 1,
      limit: envelope.meta?.limit ?? 20,
      total: envelope.meta?.total ?? 0,
      totalPages: envelope.meta?.totalPages ?? 0,
    },
  }
}

export const apiClient = {
  get<T>(path: string, params?: QueryParams, timeoutMs?: number): Promise<T> {
    return request<T>(path, { method: 'GET', params, timeoutMs })
  },
  getList<T>(path: string, params?: QueryParams): Promise<ApiListResult<T>> {
    return requestList<T>(path, params)
  },
  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, { method: 'POST', body })
  },
  patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, { method: 'PATCH', body })
  },
  delete(path: string, params?: QueryParams): Promise<void> {
    return request<void>(path, { method: 'DELETE', params })
  },
  upload<T>(path: string, formData: FormData): Promise<T> {
    return request<T>(path, { method: 'POST', formData })
  },
}

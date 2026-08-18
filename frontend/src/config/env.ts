export const API_BASE_URL: string = import.meta.env.VITE_API_URL || '/api'

export const API_TIMEOUT_MS: number = 10_000

export const IMAGE_MAX_SIZE_MB: number = 5

export const IMAGE_MAX_COUNT: number = 5

export const ALLOWED_IMAGE_TYPES: readonly string[] = ['image/jpeg', 'image/png', 'image/webp']

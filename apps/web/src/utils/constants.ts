import type { ClaimStatus, ReportStatus } from '@/api/types'

export const REPORT_STATUSES: ReportStatus[] = [
  'PENDING_VERIFICATION',
  'ACTIVE',
  'FOUND',
  'CLAIMED',
  'COMPLETED',
  'REJECTED',
  'CANCELLED',
]

export const CLAIM_STATUSES: ClaimStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']

export function humanizeStatus(value: string): string {
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase())
}

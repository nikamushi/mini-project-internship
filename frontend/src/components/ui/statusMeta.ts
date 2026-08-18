import { Ban, CheckCircle2, Circle, Clock, PackageSearch, UserCheck, XCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { BadgeTone } from '@/components/ui/Badge'
import type { ClaimStatus, ReportStatus } from '@/api/types'

export interface StatusMeta {
  label: string
  tone: BadgeTone
  icon: LucideIcon
}

/**
 * Pemetaan status → label + tone + icon (docs/DesignSystem.md §21.1).
 */
export const reportStatusMeta: Record<ReportStatus, StatusMeta> = {
  PENDING_VERIFICATION: { label: 'Menunggu Verifikasi', tone: 'warning', icon: Clock },
  ACTIVE: { label: 'Aktif', tone: 'info', icon: Circle },
  FOUND: { label: 'Ditemukan', tone: 'success', icon: PackageSearch },
  CLAIMED: { label: 'Klaim', tone: 'warning', icon: UserCheck },
  COMPLETED: { label: 'Selesai', tone: 'success', icon: CheckCircle2 },
  REJECTED: { label: 'Ditolak', tone: 'danger', icon: XCircle },
  CANCELLED: { label: 'Dibatalkan', tone: 'neutral', icon: Ban },
}

export const claimStatusMeta: Record<ClaimStatus, StatusMeta> = {
  PENDING: { label: 'Menunggu Review', tone: 'warning', icon: Clock },
  APPROVED: { label: 'Disetujui', tone: 'success', icon: CheckCircle2 },
  REJECTED: { label: 'Ditolak', tone: 'danger', icon: XCircle },
  CANCELLED: { label: 'Dibatalkan', tone: 'neutral', icon: Ban },
}

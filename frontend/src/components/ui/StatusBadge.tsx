import { Badge, type BadgeProps } from '@/components/ui/Badge'
import { claimStatusMeta, reportStatusMeta } from '@/components/ui/statusMeta'
import type { ClaimStatus, ReportStatus } from '@/api/types'

export interface StatusBadgeProps {
  status: string
  kind: 'report' | 'claim'
  size?: BadgeProps['size']
  className?: string
}

export function StatusBadge({ status, kind, size = 'sm', className }: StatusBadgeProps) {
  const meta =
    kind === 'report'
      ? reportStatusMeta[status as ReportStatus]
      : claimStatusMeta[status as ClaimStatus]
  if (!meta) {
    return (
      <Badge tone="neutral" size={size} className={className}>
        {status}
      </Badge>
    )
  }
  const Icon = meta.icon
  return (
    <Badge
      tone={meta.tone}
      size={size}
      icon={<Icon size={12} aria-hidden="true" />}
      className={className}
    >
      {meta.label}
    </Badge>
  )
}

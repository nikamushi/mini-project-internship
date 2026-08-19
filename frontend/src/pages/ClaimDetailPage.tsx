import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { claimService } from '@/services/claimService'
import { useToast } from '@/components/ui/useToast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Button } from '@/components/ui/Button'
import { formatDateTime } from '@/utils/format'
import './ClaimDetailPage.css'

export function ClaimDetailPage() {
  const { id = '' } = useParams()
  const toast = useToast()
  const queryClient = useQueryClient()
  const [confirmCancel, setConfirmCancel] = useState(false)

  const claimQuery = useQuery({
    queryKey: ['claims', id],
    queryFn: () => claimService.detail(id),
    enabled: id.length > 0,
  })

  const cancelMutation = useMutation({
    mutationFn: () => claimService.cancel(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['claims'] })
      void queryClient.invalidateQueries({ queryKey: ['my-claims'] })
      toast('Klaim berhasil dibatalkan.', { tone: 'success' })
      setConfirmCancel(false)
    },
  })

  if (claimQuery.isPending) {
    return (
      <div className="lc-claim-detail" aria-busy="true">
        <Skeleton height="48px" width="40%" />
        <Skeleton height="300px" />
      </div>
    )
  }

  if (claimQuery.isError || !claimQuery.data) {
    return <ErrorState title="Gagal memuat klaim" onRetry={() => void claimQuery.refetch()} />
  }

  const claim = claimQuery.data
  const report = claim.report

  return (
    <div className="lc-claim-detail">
      <div className="lc-claim-detail__header">
        <h1 className="lc-claim-detail__title">Detail Klaim</h1>
        <StatusBadge status={claim.status} kind="claim" />
      </div>

      {report ? (
        <div className="lc-claim-detail__report">
          <p className="lc-claim-detail__report-label">Laporan terkait</p>
          <Link to={`/reports/${report.id}`} className="lc-claim-detail__report-link">
            {report.itemName}
          </Link>
          <p className="lc-claim-detail__report-meta">
            {report.category.name} &middot; {formatDateTime(report.occurredAt)}
          </p>
        </div>
      ) : null}

      <dl className="lc-claim-detail__list">
        <div className="lc-claim-detail__item">
          <dt>Alasan Klaim</dt>
          <dd>{claim.reason}</dd>
        </div>
        {claim.evidence ? (
          <div className="lc-claim-detail__item">
            <dt>Bukti Pendukung</dt>
            <dd>{claim.evidence}</dd>
          </div>
        ) : null}
        {claim.status === 'APPROVED' || claim.status === 'REJECTED' ? (
          <div className="lc-claim-detail__item">
            <dt>Keputusan Admin</dt>
            <dd>
              <StatusBadge status={claim.status} kind="claim" />
            </dd>
          </div>
        ) : null}
        {claim.reviewReason ? (
          <div className="lc-claim-detail__item">
            <dt>Alasan Keputusan</dt>
            <dd>{claim.reviewReason}</dd>
          </div>
        ) : null}
        <div className="lc-claim-detail__item">
          <dt>Diajukan Pada</dt>
          <dd>{formatDateTime(claim.createdAt)}</dd>
        </div>
        {claim.status === 'APPROVED' || claim.status === 'REJECTED' ? (
          <div className="lc-claim-detail__item">
            <dt>Ditinjau Pada</dt>
            <dd>{formatDateTime(claim.updatedAt)}</dd>
          </div>
        ) : null}
      </dl>

      {claim.status === 'PENDING' ? (
        <div className="lc-claim-detail__actions">
          <Button variant="danger" onClick={() => setConfirmCancel(true)}>
            Batalkan Klaim
          </Button>
        </div>
      ) : null}

      <ConfirmDialog
        open={confirmCancel}
        title="Batalkan klaim?"
        message="Anda tidak dapat mengajukan klaim ulang untuk laporan ini jika klaim dibatalkan."
        confirmLabel="Ya, Batalkan"
        cancelLabel="Tutup"
        tone="danger"
        loading={cancelMutation.isPending}
        onClose={() => setConfirmCancel(false)}
        onConfirm={() => cancelMutation.mutate()}
      />
    </div>
  )
}

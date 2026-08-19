import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { useToast } from '@/components/ui/useToast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Textarea } from '@/components/ui/Textarea'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDateTime } from '@/utils/format'
import './AdminPages.css'

export function AdminClaimDetailPage() {
  const { id = '' } = useParams()
  const toast = useToast()
  const queryClient = useQueryClient()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState<string | null>(null)
  const [approveOpen, setApproveOpen] = useState(false)

  const claimQuery = useQuery({
    queryKey: ['admin', 'claims', id],
    queryFn: () => adminService.claimDetail(id),
    enabled: id.length > 0,
  })

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'claims'] })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
  }

  const approveMutation = useMutation({
    mutationFn: () => adminService.reviewClaim(id, { status: 'APPROVED' }),
    onSuccess: () => {
      invalidate()
      setApproveOpen(false)
      toast('Klaim disetujui. Laporan ditandai sebagai diklaim.', { tone: 'success' })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: () => {
      if (rejectReason.trim().length < 3) {
        throw new Error('Alasan penolakan wajib diisi.')
      }
      return adminService.reviewClaim(id, { status: 'REJECTED', reason: rejectReason.trim() })
    },
    onSuccess: () => {
      invalidate()
      setRejectOpen(false)
      setRejectReason('')
      setRejectError(null)
      toast('Klaim ditolak. Laporan tetap aktif.', { tone: 'success' })
    },
    onError: (error: unknown) => {
      setRejectError(
        error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.',
      )
    },
  })

  if (claimQuery.isPending) {
    return (
      <div className="lc-admin-page" aria-busy="true">
        <Skeleton height="48px" width="40%" />
        <Skeleton height="400px" />
      </div>
    )
  }

  if (claimQuery.isError || !claimQuery.data) {
    return <ErrorState title="Gagal memuat klaim" onRetry={() => void claimQuery.refetch()} />
  }

  const claim = claimQuery.data
  const report = claim.report
  const pending = claim.status === 'PENDING'

  return (
    <div className="lc-admin-page">
      <section className="lc-admin-page__header">
        <div>
          <h1 className="lc-admin-page__title">Detail Klaim</h1>
          <p className="lc-admin-page__subtitle">
            <Link to="/admin/claims" className="lc-admin-page__link">
              Kembali ke daftar
            </Link>
          </p>
        </div>
        <StatusBadge status={claim.status} kind="claim" />
      </section>

      <div className="lc-admin-page__detail-grid">
        <div className="lc-admin-page__detail-main">
          <section className="lc-admin-page__section">
            <h2 className="lc-admin-page__section-title">Informasi Klaim</h2>
            <dl className="lc-admin-page__detail-list">
              <div className="lc-admin-page__detail-item">
                <dt>Pengklaim</dt>
                <dd>
                  {claim.claimant
                    ? `${claim.claimant.name} (${claim.claimant.id})`
                    : 'Tidak tersedia'}
                </dd>
              </div>
              <div className="lc-admin-page__detail-item">
                <dt>Diajukan Pada</dt>
                <dd>{formatDateTime(claim.createdAt)}</dd>
              </div>
              {claim.status === 'APPROVED' || claim.status === 'REJECTED' ? (
                <div className="lc-admin-page__detail-item">
                  <dt>Ditinjau Pada</dt>
                  <dd>{formatDateTime(claim.updatedAt)}</dd>
                </div>
              ) : null}
            </dl>

            <h3 className="lc-admin-page__section-title">Alasan Klaim</h3>
            <p className="lc-admin-page__description">{claim.reason}</p>

            {claim.evidence ? (
              <>
                <h3 className="lc-admin-page__section-title">Bukti Pendukung</h3>
                <p className="lc-admin-page__description">{claim.evidence}</p>
              </>
            ) : null}

            {claim.reviewReason ? (
              <>
                <h3 className="lc-admin-page__section-title">Alasan Keputusan</h3>
                <p className="lc-admin-page__description">{claim.reviewReason}</p>
              </>
            ) : null}
          </section>

          {report ? (
            <section className="lc-admin-page__section">
              <h2 className="lc-admin-page__section-title">Laporan Terkait</h2>
              <dl className="lc-admin-page__detail-list">
                <div className="lc-admin-page__detail-item">
                  <dt>Barang</dt>
                  <dd>
                    <Link to={`/admin/reports/${report.id}`} className="lc-admin-page__link">
                      {report.itemName}
                    </Link>
                  </dd>
                </div>
                <div className="lc-admin-page__detail-item">
                  <dt>Kategori</dt>
                  <dd>{report.category.name}</dd>
                </div>
                <div className="lc-admin-page__detail-item">
                  <dt>Status Laporan</dt>
                  <dd>
                    <StatusBadge status={report.status} kind="report" />
                  </dd>
                </div>
                <div className="lc-admin-page__detail-item">
                  <dt>Lokasi</dt>
                  <dd>{report.location}</dd>
                </div>
              </dl>
            </section>
          ) : null}
        </div>

        <aside className="lc-admin-page__detail-side">
          {pending ? (
            <section className="lc-admin-page__section">
              <h2 className="lc-admin-page__section-title">Keputusan</h2>
              <div className="lc-admin-page__actions">
                <Button onClick={() => setApproveOpen(true)}>Setujui Klaim</Button>
                <Button variant="danger" onClick={() => setRejectOpen(true)}>
                  Tolak Klaim
                </Button>
              </div>
            </section>
          ) : null}
        </aside>
      </div>

      <ConfirmDialog
        open={approveOpen}
        title="Setujui klaim ini?"
        message="Laporan terkait akan ditandai sebagai Diklaim. Klaim lain pada laporan yang sama akan ditolak otomatis."
        confirmLabel="Ya, Setujui"
        cancelLabel="Batal"
        loading={approveMutation.isPending}
        onClose={() => setApproveOpen(false)}
        onConfirm={() => approveMutation.mutate()}
      />

      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Tolak Klaim" size="sm">
        <form
          className="lc-admin-page__reason-form"
          onSubmit={(event) => {
            event.preventDefault()
            rejectMutation.mutate()
          }}
          noValidate
        >
          <FormField
            label="Alasan Penolakan"
            htmlFor="claim-reject-reason"
            required
            helper="Alasan akan dikirim sebagai notifikasi kepada pengklaim."
            error={rejectError ?? undefined}
          >
            <Textarea
              id="claim-reject-reason"
              rows={4}
              placeholder="cth: Bukti kepemilikan tidak mencukupi."
              value={rejectReason}
              onChange={(event) => {
                setRejectReason(event.target.value)
                setRejectError(null)
              }}
              invalid={Boolean(rejectError)}
            />
          </FormField>
          <div className="lc-admin-page__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setRejectOpen(false)}
              disabled={rejectMutation.isPending}
            >
              Batal
            </Button>
            <Button type="submit" variant="danger" loading={rejectMutation.isPending}>
              Tolak Klaim
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

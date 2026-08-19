import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { useToast } from '@/components/ui/useToast'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ImageOff } from 'lucide-react'
import { formatDateTime } from '@/utils/format'
import { humanizeStatus } from '@/utils/constants'
import type { ReportStatus } from '@/api/types'
import './AdminPages.css'

const TRANSITIONS: Partial<Record<ReportStatus, ReportStatus[]>> = {
  PENDING_VERIFICATION: ['ACTIVE', 'REJECTED'],
  ACTIVE: ['FOUND', 'CANCELLED', 'COMPLETED'],
  FOUND: ['COMPLETED'],
  CLAIMED: ['COMPLETED'],
}

export function AdminReportDetailPage() {
  const { id = '' } = useParams()
  const toast = useToast()
  const queryClient = useQueryClient()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState<string | null>(null)
  const [statusOpen, setStatusOpen] = useState(false)
  const [nextStatus, setNextStatus] = useState<ReportStatus | ''>('')
  const [statusNote, setStatusNote] = useState('')
  const [approveOpen, setApproveOpen] = useState(false)

  const reportQuery = useQuery({
    queryKey: ['admin', 'reports', id],
    queryFn: () => adminService.reportDetail(id),
    enabled: id.length > 0,
  })

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
  }

  const approveMutation = useMutation({
    mutationFn: () => adminService.updateReportStatus(id, { status: 'ACTIVE' }),
    onSuccess: () => {
      invalidate()
      toast('Laporan disetujui dan dipublikasikan.', { tone: 'success' })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: () => {
      if (rejectReason.trim().length < 3) {
        throw new Error('Alasan penolakan wajib diisi.')
      }
      return adminService.updateReportStatus(id, {
        status: 'REJECTED',
        adminNote: rejectReason.trim(),
      })
    },
    onSuccess: () => {
      invalidate()
      setRejectOpen(false)
      setRejectReason('')
      setRejectError(null)
      toast('Laporan ditolak.', { tone: 'success' })
    },
    onError: (error: unknown) => {
      setRejectError(
        error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.',
      )
    },
  })

  const changeStatusMutation = useMutation({
    mutationFn: () => {
      if (!nextStatus) {
        throw new Error('Pilih status tujuan.')
      }
      return adminService.updateReportStatus(id, {
        status: nextStatus,
        adminNote: statusNote.trim() || undefined,
      })
    },
    onSuccess: () => {
      invalidate()
      setStatusOpen(false)
      setNextStatus('')
      setStatusNote('')
      toast('Status laporan diperbarui.', { tone: 'success' })
    },
  })

  if (reportQuery.isPending) {
    return (
      <div className="lc-admin-page" aria-busy="true">
        <Skeleton height="48px" width="40%" />
        <Skeleton height="400px" />
      </div>
    )
  }

  if (reportQuery.isError || !reportQuery.data) {
    return <ErrorState title="Gagal memuat laporan" onRetry={() => void reportQuery.refetch()} />
  }

  const report = reportQuery.data
  const transitions = TRANSITIONS[report.status] ?? []
  const changeable = transitions.filter((status) => status !== 'REJECTED')

  return (
    <div className="lc-admin-page">
      <section className="lc-admin-page__header">
        <div>
          <h1 className="lc-admin-page__title">Detail Laporan</h1>
          <p className="lc-admin-page__subtitle">
            <Link to="/admin/reports" className="lc-admin-page__link">
              Kembali ke daftar
            </Link>
          </p>
        </div>
        <StatusBadge status={report.status} kind="report" />
      </section>

      <div className="lc-admin-page__detail-grid">
        <div className="lc-admin-page__detail-main">
          <section className="lc-admin-page__section">
            <h2 className="lc-admin-page__section-title">
              {report.itemName}{' '}
              <Badge tone={report.type === 'LOST' ? 'danger' : 'success'}>
                {report.type === 'LOST' ? 'Hilang' : 'Ditemukan'}
              </Badge>
            </h2>
            <dl className="lc-admin-page__detail-list">
              <div className="lc-admin-page__detail-item">
                <dt>Kategori</dt>
                <dd>{report.category.name}</dd>
              </div>
              <div className="lc-admin-page__detail-item">
                <dt>Lokasi</dt>
                <dd>{report.location}</dd>
              </div>
              <div className="lc-admin-page__detail-item">
                <dt>Waktu Kejadian</dt>
                <dd>{formatDateTime(report.occurredAt)}</dd>
              </div>
              <div className="lc-admin-page__detail-item">
                <dt>Dibuat Pada</dt>
                <dd>{formatDateTime(report.createdAt)}</dd>
              </div>
            </dl>
            <h3 className="lc-admin-page__section-title">Deskripsi</h3>
            <p className="lc-admin-page__description">{report.description}</p>

            {report.images.length > 0 ? (
              <div className="lc-admin-page__images">
                {report.images.map((image) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt={`Foto ${report.itemName}`}
                    className="lc-admin-page__image"
                    loading="lazy"
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<ImageOff size={28} aria-hidden="true" />}
                title="Tidak ada foto"
                description="Pelapor tidak mengunggah foto barang."
              />
            )}
          </section>

          <section className="lc-admin-page__section">
            <h2 className="lc-admin-page__section-title">Informasi Pelapor</h2>
            <dl className="lc-admin-page__detail-list">
              <div className="lc-admin-page__detail-item">
                <dt>Nama</dt>
                <dd>{report.reporter.name}</dd>
              </div>
              <div className="lc-admin-page__detail-item">
                <dt>ID Pelapor</dt>
                <dd>{report.reporter.id}</dd>
              </div>
            </dl>
          </section>
        </div>

        <aside className="lc-admin-page__detail-side">
          <section className="lc-admin-page__section">
            <h2 className="lc-admin-page__section-title">Aksi Admin</h2>
            <div className="lc-admin-page__actions">
              {report.status === 'PENDING_VERIFICATION' ? (
                <>
                  <Button loading={approveMutation.isPending} onClick={() => setApproveOpen(true)}>
                    Setujui Laporan
                  </Button>
                  <Button variant="danger" onClick={() => setRejectOpen(true)}>
                    Tolak Laporan
                  </Button>
                </>
              ) : null}

              {changeable.length > 0 ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setNextStatus(changeable[0])
                    setStatusOpen(true)
                  }}
                >
                  Ubah Status
                </Button>
              ) : null}

              {report.adminNote ? (
                <p className="lc-admin-page__muted lc-admin-page__admin-note">
                  <strong>Catatan admin:</strong> {report.adminNote}
                </p>
              ) : null}
            </div>
          </section>
        </aside>
      </div>

      <ConfirmDialog
        open={approveOpen}
        title="Setujui Laporan?"
        message="Laporan akan diverifikasi dan langsung dipublikasikan ke semua pengguna."
        confirmLabel="Setujui Laporan"
        tone="primary"
        loading={approveMutation.isPending}
        onClose={() => setApproveOpen(false)}
        onConfirm={() => approveMutation.mutate()}
      />

      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Tolak Laporan" size="sm">
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
            htmlFor="reject-reason"
            required
            helper="Alasan akan dikirim sebagai notifikasi kepada pelapor."
            error={rejectError ?? undefined}
          >
            <Textarea
              id="reject-reason"
              rows={4}
              placeholder="cth: Informasi tidak lengkap, mohon perbarui data barang."
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
              Tolak Laporan
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        title="Ubah Status Laporan"
        size="sm"
      >
        <form
          className="lc-admin-page__reason-form"
          onSubmit={(event) => {
            event.preventDefault()
            changeStatusMutation.mutate()
          }}
          noValidate
        >
          <FormField label="Status Baru" htmlFor="next-status" required>
            <Select
              id="next-status"
              value={nextStatus}
              onChange={(event) => setNextStatus(event.target.value as ReportStatus)}
            >
              {changeable.map((status) => (
                <option key={status} value={status}>
                  {humanizeStatus(status)}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Catatan (opsional)" htmlFor="status-note">
            <Input
              id="status-note"
              placeholder="cth: Barang telah diambil pemilik."
              value={statusNote}
              onChange={(event) => setStatusNote(event.target.value)}
            />
          </FormField>
          <div className="lc-admin-page__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStatusOpen(false)}
              disabled={changeStatusMutation.isPending}
            >
              Batal
            </Button>
            <Button type="submit" loading={changeStatusMutation.isPending}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

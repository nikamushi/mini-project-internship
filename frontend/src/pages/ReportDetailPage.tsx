import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, Handshake, ImageOff, MapPin, Pencil, Trash2, User } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { reportService } from '@/services/reportService'
import { ApiError } from '@/api/errors'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/useToast'
import { formatDateTime } from '@/utils/format'
import './ReportDetailPage.css'

const TYPE_LABEL: Record<'LOST' | 'FOUND', string> = {
  LOST: 'Barang Hilang',
  FOUND: 'Barang Ditemukan',
}

export function ReportDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  const detailQuery = useQuery({
    queryKey: ['reports', id],
    queryFn: () => reportService.detail(id),
    enabled: id.length > 0,
  })

  const deleteMutation = useMutation({
    mutationFn: () => reportService.remove(id),
    onSuccess: () => {
      toast('Laporan berhasil dihapus.', { tone: 'success' })
      void queryClient.invalidateQueries({ queryKey: ['reports'] })
      navigate('/reports')
    },
    onError: (error: unknown) => {
      toast(error instanceof ApiError ? error.message : 'Gagal menghapus laporan.', {
        tone: 'error',
      })
    },
  })

  if (detailQuery.isPending) {
    return (
      <div className="lc-report-detail" aria-busy="true">
        <Skeleton height="400px" />
        <Skeleton height="32px" width="60%" />
        <Skeleton height="16px" width="40%" />
        <Skeleton height="120px" />
      </div>
    )
  }

  if (detailQuery.isError || !detailQuery.data) {
    return <ErrorState title="Gagal memuat laporan" onRetry={() => void detailQuery.refetch()} />
  }

  const report = detailQuery.data
  const isOwner = currentUser?.id === report.reporter.id
  const canClaim = report.type === 'FOUND' && report.status === 'ACTIVE' && !isOwner

  return (
    <div className="lc-report-detail">
      <div className="lc-report-detail__back">
        <Link to="/reports" className="lc-report-detail__back-link">
          &larr; Kembali ke daftar laporan
        </Link>
      </div>

      <div className="lc-report-detail__layout">
        <div className="lc-report-detail__media">
          {report.images.length > 0 ? (
            <>
              <div className="lc-report-detail__image-main">
                {report.images[activeImage]?.url ? (
                  <img
                    src={report.images[activeImage].url}
                    alt={report.title}
                    className="lc-report-detail__image"
                  />
                ) : null}
              </div>
              {report.images.length > 1 ? (
                <div className="lc-report-detail__thumbs" role="group" aria-label="Gambar lainnya">
                  {report.images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      className={[
                        'lc-report-detail__thumb',
                        index === activeImage ? 'lc-report-detail__thumb--active' : '',
                      ]
                        .join(' ')
                        .trim()}
                      aria-label={`Lihat gambar ${index + 1}`}
                      aria-pressed={index === activeImage}
                      onClick={() => setActiveImage(index)}
                    >
                      <img src={image.url} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="lc-report-detail__placeholder" aria-hidden="true">
              <ImageOff size={48} />
            </div>
          )}
        </div>

        <div className="lc-report-detail__info">
          <div className="lc-report-detail__badges">
            <Badge tone={report.type === 'LOST' ? 'danger' : 'success'}>
              {TYPE_LABEL[report.type]}
            </Badge>
            <StatusBadge status={report.status} kind="report" />
          </div>

          <h1 className="lc-report-detail__title">{report.title}</h1>
          <p className="lc-report-detail__category">{report.category.name}</p>

          <p className="lc-report-detail__description">{report.description}</p>

          <dl className="lc-report-detail__facts">
            <div className="lc-report-detail__fact">
              <dt>
                <MapPin size={16} aria-hidden="true" />
                Lokasi
              </dt>
              <dd>{report.location}</dd>
            </div>
            <div className="lc-report-detail__fact">
              <dt>
                <CalendarDays size={16} aria-hidden="true" />
                Waktu Kejadian
              </dt>
              <dd>{formatDateTime(report.eventAt)}</dd>
            </div>
            <div className="lc-report-detail__fact">
              <dt>
                <User size={16} aria-hidden="true" />
                Pelapor
              </dt>
              <dd>
                {report.reporter.name}
                {isOwner ? <span className="lc-report-detail__owner"> (Anda)</span> : null}
              </dd>
            </div>
          </dl>

          <div className="lc-report-detail__actions">
            {canClaim ? (
              <Link to={`/reports/${report.id}/claim`} className="lc-btn lc-btn--primary">
                <Handshake size={18} aria-hidden="true" />
                Ajukan Klaim
              </Link>
            ) : null}

            {isOwner ? (
              <>
                <Link to={`/reports/${report.id}/edit`} className="lc-btn lc-btn--outline">
                  <Pencil size={18} aria-hidden="true" />
                  Edit
                </Link>
                <Button
                  variant="danger"
                  icon={<Trash2 size={18} />}
                  onClick={() => setDeleteOpen(true)}
                >
                  Hapus
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus laporan?"
        message={`Laporan "${report.title}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        tone="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onClose={() => setDeleteOpen(false)}
      />

      {report.images.length === 0 && (
        <EmptyState title="Belum ada foto" description="Pelapor tidak mengunggah foto barang." />
      )}
    </div>
  )
}

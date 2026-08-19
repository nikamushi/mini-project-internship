import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { ApiError, mapFieldErrors } from '@/api/errors'
import { claimService } from '@/services/claimService'
import { reportService } from '@/services/reportService'
import { useToast } from '@/components/ui/useToast'
import { useAuth } from '@/auth/useAuth'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Textarea } from '@/components/ui/Textarea'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { formatDateTime } from '@/utils/format'
import { UnsavedChangesGuard } from '@/hooks/UnsavedChangesGuard'
import './ClaimFormPage.css'

const claimSchema = z.object({
  reason: z.string().trim().min(10, 'Alasan klaim minimal 10 karakter.'),
  evidence: z.string().trim().optional().or(z.literal('')),
})

type ClaimFormValues = z.infer<typeof claimSchema>

export function ClaimFormPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { currentUser } = useAuth()
  const [generalError, setGeneralError] = useState<string | null>(null)

  const reportQuery = useQuery({
    queryKey: ['reports', id],
    queryFn: () => reportService.detail(id),
    enabled: id.length > 0,
  })

  const { register, handleSubmit, formState, setError } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: { reason: '', evidence: '' },
  })

  const claimable = reportQuery.data
    ? reportQuery.data.type === 'FOUND' &&
      reportQuery.data.status === 'ACTIVE' &&
      reportQuery.data.reporter.id !== currentUser?.id
    : false

  const claimMutation = useMutation({
    mutationFn: (values: ClaimFormValues) =>
      claimService.create(id, {
        reason: values.reason,
        evidence: values.evidence || undefined,
      }),
    onSuccess: (claim) => {
      void queryClient.invalidateQueries({ queryKey: ['claims'] })
      void queryClient.invalidateQueries({ queryKey: ['my-claims'] })
      toast('Klaim berhasil diajukan. Menunggu verifikasi admin.', { tone: 'success' })
      navigate(`/my-claims/${claim.id}`)
    },
    onError: (error: unknown) => {
      const message = mapFieldErrors(
        error,
        (field, message) => setError(field as keyof ClaimFormValues, { type: 'server', message }),
        ['reason', 'evidence'],
      )
      if (error instanceof ApiError && error.isConflict) {
        setGeneralError('Data telah berubah di server. Silakan muat ulang halaman.')
      } else if (message) {
        setGeneralError(message)
      }
    },
  })

  if (reportQuery.isPending) {
    return (
      <div className="lc-claim-form" aria-busy="true">
        <Skeleton height="48px" width="40%" />
        <Skeleton height="300px" />
      </div>
    )
  }

  if (reportQuery.isError || !reportQuery.data) {
    return <ErrorState title="Gagal memuat laporan" onRetry={() => void reportQuery.refetch()} />
  }

  const report = reportQuery.data

  return (
    <div className="lc-claim-form">
      <UnsavedChangesGuard when={formState.isDirty && !claimMutation.isPending && claimable} />
      <div className="lc-claim-form__header">
        <h1 className="lc-claim-form__title">Ajukan Klaim</h1>
        <Badge tone="success">Barang Ditemukan</Badge>
      </div>

      <div className="lc-claim-form__report">
        <Link to={`/reports/${report.id}`} className="lc-claim-form__report-link">
          {report.itemName}
        </Link>
        <p className="lc-claim-form__report-meta">
          {report.category.name} &middot; {formatDateTime(report.occurredAt)}
        </p>
      </div>

      {!claimable ? (
        <ErrorState
          title="Klaim tidak tersedia"
          description="Klaim hanya dapat diajukan untuk barang ditemukan yang berstatus aktif, dan bukan oleh pelapor itu sendiri."
        />
      ) : (
        <>
          {generalError ? (
            <Alert tone="danger" title="Gagal mengajukan klaim">
              {generalError}
            </Alert>
          ) : null}

          <form
            className="lc-claim-form__fields"
            onSubmit={handleSubmit((values) => claimMutation.mutate(values))}
            noValidate
          >
            <FormField
              label="Alasan Klaim"
              htmlFor="claim-reason"
              required
              helper="Jelaskan mengapa barang ini milik Anda. Minimal 10 karakter."
              error={formState.errors.reason?.message}
            >
              <Textarea
                id="claim-reason"
                rows={5}
                placeholder="cth: Saya kehilangan dompet ini dan ada kartu identitas saya di dalamnya."
                invalid={Boolean(formState.errors.reason)}
                {...register('reason')}
              />
            </FormField>

            <FormField
              label="Bukti Pendukung (opsional)"
              htmlFor="claim-evidence"
              helper="Informasi tambahan yang hanya diketahui pemilik, misalnya ciri khusus atau isi barang."
              error={formState.errors.evidence?.message}
            >
              <Textarea
                id="claim-evidence"
                rows={4}
                placeholder="cth: Terdapat tanda khusus di bagian dalam dompet."
                invalid={Boolean(formState.errors.evidence)}
                {...register('evidence')}
              />
            </FormField>

            <div className="lc-claim-form__actions">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Batal
              </Button>
              <Button
                type="submit"
                loading={claimMutation.isPending}
                loadingLabel="Mengirim klaim..."
              >
                Ajukan Klaim
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

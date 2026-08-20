import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { ApiError, mapFieldErrors } from '@/api/errors'
import { categoryService } from '@/services/categoryService'
import { reportService } from '@/services/reportService'
import { useToast } from '@/components/ui/useToast'
import { useAuth } from '@/auth/useAuth'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { FileUpload } from '@/components/ui/FileUpload'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Badge } from '@/components/ui/Badge'
import { UnsavedChangesGuard } from '@/hooks/UnsavedChangesGuard'
import { IMAGE_MAX_COUNT } from '@/config/env'
import { formatDateTime, toDatetimeLocal } from '@/utils/format'
import type { ReportType } from '@/api/types'
import './ReportFormPage.css'

const reportSchema = z.object({
  categoryId: z.string().min(1, 'Pilih kategori.'),
  itemName: z
    .string()
    .trim()
    .min(2, 'Nama barang minimal 2 karakter.')
    .max(150, 'Nama barang maksimal 150 karakter.'),
  description: z.string().trim().min(10, 'Deskripsi minimal 10 karakter.'),
  location: z
    .string()
    .trim()
    .min(2, 'Lokasi minimal 2 karakter.')
    .max(255, 'Lokasi maksimal 255 karakter.'),
  occurredAt: z.string().min(1, 'Pilih tanggal dan waktu kejadian.'),
})

type ReportFormValues = z.infer<typeof reportSchema>

export interface ReportFormPageProps {
  mode: 'create' | 'edit'
  type?: ReportType
}

export function ReportFormPage({ mode, type }: ReportFormPageProps) {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()
  const [step, setStep] = useState<'form' | 'review'>('form')
  const [addImages, setAddImages] = useState<File[]>([])
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([])
  const [generalError, setGeneralError] = useState<string | null>(null)

  const reportQuery = useQuery({
    queryKey: ['reports', id],
    queryFn: () => reportService.detail(id),
    enabled: mode === 'edit' && id.length > 0,
  })

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list(),
  })

  const report = reportQuery.data ?? null
  const isOwner = mode === 'edit' && currentUser?.id === report?.reporter.id

  const { register, handleSubmit, formState, reset, getValues, setError } =
    useForm<ReportFormValues>({
      resolver: zodResolver(reportSchema),
      defaultValues: {
        categoryId: '',
        itemName: '',
        description: '',
        location: '',
        occurredAt: '',
      },
    })

  const hasHydrated = useRef(false)
  useEffect(() => {
    if (mode !== 'edit' || !report || hasHydrated.current) return
    hasHydrated.current = true
    reset({
      categoryId: String(report.category.id),
      itemName: report.itemName,
      description: report.description,
      location: report.location,
      occurredAt: toDatetimeLocal(report.occurredAt),
    })
  }, [mode, report, reset])

  const saveMutation = useMutation({
    mutationFn: async (values: ReportFormValues) => {
      if (mode === 'create' && !type) {
        throw new ApiError(null, 'BAD_REQUEST', 'Tipe laporan tidak diketahui.')
      }
      const input = {
        ...(mode === 'create'
          ? { type: type as ReportType, categoryId: Number(values.categoryId) }
          : {}),
        itemName: values.itemName,
        description: values.description,
        location: values.location,
        occurredAt: new Date(values.occurredAt).toISOString(),
      }
      const created =
        mode === 'create'
          ? await reportService.create(input as Parameters<typeof reportService.create>[0])
          : null
      const reportId = mode === 'edit' ? id : String(created!.id)

      if (mode === 'edit') {
        await reportService.update(reportId, {
          itemName: values.itemName,
          description: values.description,
          location: values.location,
          occurredAt: new Date(values.occurredAt).toISOString(),
        })
      }

      for (const imageId of deleteImageIds) {
        await reportService.deleteImage(reportId, imageId)
      }

      for (const file of addImages) {
        await reportService.uploadImage(reportId, file)
      }

      return reportId
    },
    onSuccess: (reportId) => {
      void queryClient.invalidateQueries({ queryKey: ['reports'] })
      void queryClient.invalidateQueries({ queryKey: ['my-reports'] })
      toast(
        mode === 'create'
          ? 'Laporan berhasil dibuat dan sedang menunggu verifikasi admin.'
          : 'Laporan berhasil diperbarui.',
        { tone: 'success' },
      )
      navigate(`/reports/${reportId}`)
    },
    onError: (error: unknown) => {
      const message = mapFieldErrors(
        error,
        (field, message) => setError(field as keyof ReportFormValues, { type: 'server', message }),
        ['categoryId', 'itemName', 'description', 'location', 'occurredAt'],
      )
      if (error instanceof ApiError && error.isConflict) {
        setGeneralError('Data telah berubah di server. Silakan muat ulang halaman.')
      } else if (message) {
        setGeneralError(message)
      }
    },
  })

  const submit = handleSubmit((values) => saveMutation.mutate(values))

  const toReview = handleSubmit(() => setStep('review'))

  if (mode === 'edit' && reportQuery.data && !isOwner) {
    return (
      <ErrorState
        title="Akses ditolak"
        description="Anda hanya dapat mengedit laporan milik Anda sendiri."
      />
    )
  }

  if (mode === 'edit' && reportQuery.isPending) {
    return (
      <div className="lc-report-form" aria-busy="true">
        <Skeleton height="48px" width="40%" />
        <Skeleton height="400px" />
      </div>
    )
  }

  if (mode === 'edit' && (reportQuery.isError || !report)) {
    return <ErrorState title="Gagal memuat laporan" onRetry={() => void reportQuery.refetch()} />
  }

  const categories = categoriesQuery.data ?? []

  return (
    <div className="lc-report-form">
      <UnsavedChangesGuard
        when={
          formState.isDirty &&
          !saveMutation.isPending &&
          (addImages.length > 0 || deleteImageIds.length > 0)
        }
      />
      <div className="lc-report-form__header">
        <h1 className="lc-report-form__title">
          {mode === 'create'
            ? type === 'LOST'
              ? 'Laporkan Barang Hilang'
              : 'Laporkan Barang Ditemukan'
            : 'Edit Laporan'}
        </h1>
        <Badge tone={type === 'LOST' || report?.type === 'LOST' ? 'danger' : 'success'}>
          {type === 'LOST' || report?.type === 'LOST' ? 'Hilang' : 'Ditemukan'}
        </Badge>
      </div>

      {generalError ? (
        <Alert tone="danger" title="Gagal menyimpan laporan">
          {generalError}
        </Alert>
      ) : null}

      {step === 'form' ? (
        <form onSubmit={submit} noValidate>
          <div className="lc-report-form__fields">
            {mode === 'create' ? (
              <FormField
                label="Kategori"
                htmlFor="report-category"
                required
                error={formState.errors.categoryId?.message}
              >
                <Select
                  id="report-category"
                  invalid={Boolean(formState.errors.categoryId)}
                  defaultValue=""
                  {...register('categoryId')}
                >
                  <option value="">Pilih kategori...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            ) : (
              <FormField label="Kategori">
                <Input value={report?.category.name ?? ''} disabled />
              </FormField>
            )}

            <FormField
              label="Nama Barang"
              htmlFor="report-item-name"
              required
              error={formState.errors.itemName?.message}
            >
              <Input
                id="report-item-name"
                placeholder="cth: Dompet kulit hitam"
                invalid={Boolean(formState.errors.itemName)}
                {...register('itemName')}
              />
            </FormField>

            <FormField
              label="Deskripsi"
              htmlFor="report-description"
              required
              helper="Minimal 10 karakter. Sertakan ciri khusus yang membedakan barang ini."
              error={formState.errors.description?.message}
            >
              <Textarea
                id="report-description"
                rows={5}
                placeholder="cth: Dompet kulit warna hitam dengan logo kecil di pojok kanan."
                invalid={Boolean(formState.errors.description)}
                {...register('description')}
              />
            </FormField>

            <FormField
              label="Lokasi"
              htmlFor="report-location"
              required
              error={formState.errors.location?.message}
            >
              <Input
                id="report-location"
                placeholder="cth: Perpustakaan Kampus, lantai 2"
                invalid={Boolean(formState.errors.location)}
                {...register('location')}
              />
            </FormField>

            <FormField
              label="Tanggal & Waktu Kejadian"
              htmlFor="report-occurred-at"
              required
              error={formState.errors.occurredAt?.message}
            >
              <Input
                id="report-occurred-at"
                type="datetime-local"
                invalid={Boolean(formState.errors.occurredAt)}
                {...register('occurredAt')}
              />
            </FormField>
          </div>

          <div className="lc-report-form__images">
            <h2 className="lc-report-form__section-title">Foto Barang (opsional)</h2>
            <FileUpload
              id="report-images"
              label="Pilih atau seret foto ke sini"
              hint={`Maksimal ${IMAGE_MAX_COUNT} foto, format JPG/PNG/WebP.`}
              multiple
              accept="image/jpeg,image/png,image/webp"
              files={addImages}
              onChange={(files) => setAddImages(files)}
            />

            {mode === 'edit' && report && report.images.length > 0 ? (
              <div className="lc-report-form__existing">
                <p className="lc-report-form__existing-label">Foto yang sudah ada:</p>
                <ul className="lc-report-form__existing-list">
                  {report.images.map((image) => {
                    const marked = deleteImageIds.includes(image.id)
                    return (
                      <li key={image.id} className="lc-report-form__existing-item">
                        <img src={image.url} alt="" loading="lazy" />
                        <button
                          type="button"
                          className="lc-report-form__remove-image"
                          onClick={() =>
                            setDeleteImageIds((current) =>
                              marked
                                ? current.filter((item) => item !== image.id)
                                : [...current, image.id],
                            )
                          }
                        >
                          {marked ? 'Batalkan' : 'Hapus'}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="lc-report-form__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(mode === 'edit' ? `/reports/${id}` : '/reports')}
            >
              Batal
            </Button>
            {mode === 'create' ? (
              <Button type="button" onClick={() => void toReview()}>
                Lanjut ke Review
              </Button>
            ) : (
              <Button type="submit" loading={saveMutation.isPending} loadingLabel="Menyimpan...">
                Simpan Perubahan
              </Button>
            )}
          </div>
        </form>
      ) : (
        <ReviewStep
          values={getValues()}
          categoryName={
            categories.find((category) => String(category.id) === getValues('categoryId'))?.name ??
          '-'
          }
          imageCount={addImages.length}
          submitting={saveMutation.isPending}
          onBack={() => setStep('form')}
          onSubmit={() => void submit()}
        />
      )}
    </div>
  )
}

interface ReviewStepProps {
  values: ReportFormValues
  categoryName: string
  imageCount: number
  submitting: boolean
  onBack: () => void
  onSubmit: () => void
}

function ReviewStep({
  values,
  categoryName,
  imageCount,
  submitting,
  onBack,
  onSubmit,
}: ReviewStepProps) {
  return (
    <div className="lc-report-form__review">
      <dl className="lc-report-form__review-list">
        <div className="lc-report-form__review-item">
          <dt>Kategori</dt>
          <dd>{categoryName}</dd>
        </div>
        <div className="lc-report-form__review-item">
          <dt>Nama Barang</dt>
          <dd>{values.itemName}</dd>
        </div>
        <div className="lc-report-form__review-item">
          <dt>Deskripsi</dt>
          <dd>{values.description}</dd>
        </div>
        <div className="lc-report-form__review-item">
          <dt>Lokasi</dt>
          <dd>{values.location}</dd>
        </div>
        <div className="lc-report-form__review-item">
          <dt>Tanggal & Waktu Kejadian</dt>
          <dd>{formatDateTime(new Date(values.occurredAt).toISOString())}</dd>
        </div>
        <div className="lc-report-form__review-item">
          <dt>Foto</dt>
          <dd>{imageCount > 0 ? `${imageCount} foto dipilih` : 'Tidak ada'}</dd>
        </div>
      </dl>

      <div className="lc-report-form__actions">
        <Button type="button" variant="secondary" onClick={onBack} disabled={submitting}>
          Ubah Data
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          loading={submitting}
          loadingLabel="Mengirim laporan..."
        >
          Kirim Laporan
        </Button>
      </div>
    </div>
  )
}

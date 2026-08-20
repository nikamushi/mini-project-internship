import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { Pencil, Plus } from 'lucide-react'
import { categoryService } from '@/services/categoryService'
import { useToast } from '@/components/ui/useToast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { ErrorState } from '@/components/ui/ErrorState'
import { ApiError, mapFieldErrors } from '@/api/errors'
import type { Category } from '@/api/types'
import './AdminPages.css'
import './AdminCategoriesPage.css'

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama kategori minimal 2 karakter.')
    .max(100, 'Nama kategori maksimal 100 karakter.'),
  description: z.string().trim().max(255, 'Deskripsi maksimal 255 karakter.').optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export function AdminCategoriesPage() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deactivating, setDeactivating] = useState<Category | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)

  const categoriesQuery = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => categoryService.list(),
  })

  const { register, handleSubmit, formState, reset, setError } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '' },
  })

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    void queryClient.invalidateQueries({ queryKey: ['categories'] })
  }

  const saveMutation = useMutation({
    mutationFn: (values: CategoryFormValues) => {
      const input = {
        name: values.name,
        description: values.description || undefined,
      }
      return editing ? categoryService.update(editing.id, input) : categoryService.create(input)
    },
    onSuccess: () => {
      invalidate()
      setModalOpen(false)
      setEditing(null)
      reset({ name: '', description: '' })
      setGeneralError(null)
      toast(editing ? 'Kategori berhasil diperbarui.' : 'Kategori berhasil ditambahkan.', {
        tone: 'success',
      })
    },
    onError: (error: unknown) => {
      const message = mapFieldErrors(
        error,
        (field, message) =>
          setError(field as keyof CategoryFormValues, { type: 'server', message }),
        ['name', 'description'],
      )
      setGeneralError(
        message ??
          (error instanceof ApiError && error.isConflict
            ? 'Data telah berubah di server. Silakan muat ulang halaman.'
            : null),
      )
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: (category: Category) =>
      categoryService.update(category.id, { isActive: !(category.isActive ?? true) }),
    onSuccess: (_data, category) => {
      invalidate()
      setDeactivating(null)
      toast(
        category.isActive === false ? 'Kategori diaktifkan kembali.' : 'Kategori dinonaktifkan.',
        {
          tone: 'success',
        },
      )
    },
  })

  const openCreate = () => {
    setEditing(null)
    reset({ name: '', description: '' })
    setGeneralError(null)
    setModalOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditing(category)
    reset({ name: category.name, description: category.description ?? '' })
    setGeneralError(null)
    setModalOpen(true)
  }

  const columns: TableColumn<Category>[] = [
    {
      key: 'name',
      header: 'Nama',
      render: (row) => <span className="lc-admin-page__link">{row.name}</span>,
    },
    {
      key: 'description',
      header: 'Deskripsi',
      render: (row) => <span className="lc-admin-page__muted">{row.description ?? '—'}</span>,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row) => (
        <Badge tone={row.isActive === false ? 'neutral' : 'success'} size="sm">
          {row.isActive === false ? 'Nonaktif' : 'Aktif'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row) => (
        <div className="lc-admin-page__row-actions">
          <Button variant="outline" size="sm" onClick={() => openEdit(row)}>
            <Pencil size={14} aria-hidden="true" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeactivating(row)}>
            {row.isActive === false ? 'Aktifkan' : 'Nonaktifkan'}
          </Button>
        </div>
      ),
    },
  ]

  const categories = categoriesQuery.data ?? []

  return (
    <div className="lc-admin-page">
      <section className="lc-admin-page__header">
        <div>
          <h1 className="lc-admin-page__title">Kategori</h1>
          <p className="lc-admin-page__subtitle">Kelola kategori barang untuk laporan.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} aria-hidden="true" />
          Tambah Kategori
        </Button>
      </section>

      {categoriesQuery.isError ? (
        <ErrorState title="Gagal memuat kategori" onRetry={() => void categoriesQuery.refetch()} />
      ) : (
        <div className="lc-admin-page__table-wrap">
          <Table
            columns={columns}
            rows={categories}
            rowKey={(row) => row.id}
            loading={categoriesQuery.isPending}
            emptyMessage="Belum ada kategori."
            aria-label="Daftar kategori"
          />
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Kategori' : 'Tambah Kategori'}
        size="sm"
      >
        <form
          className="lc-admin-page__reason-form"
          onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
          noValidate
        >
          {generalError ? <p className="lc-admin-page__form-error">{generalError}</p> : null}
          <FormField
            label="Nama"
            htmlFor="category-name"
            required
            error={formState.errors.name?.message}
          >
            <Input
              id="category-name"
              placeholder="cth: Elektronik"
              invalid={Boolean(formState.errors.name)}
              {...register('name')}
            />
          </FormField>
          <FormField
            label="Deskripsi (opsional)"
            htmlFor="category-description"
            error={formState.errors.description?.message}
          >
            <Textarea
              id="category-description"
              rows={3}
              placeholder="cth: Perangkat elektronik"
              invalid={Boolean(formState.errors.description)}
              {...register('description')}
            />
          </FormField>
          <div className="lc-admin-page__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={saveMutation.isPending}
            >
              Batal
            </Button>
            <Button type="submit" loading={saveMutation.isPending}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deactivating)}
        title={
          deactivating?.isActive === false ? 'Aktifkan kategori ini?' : 'Nonaktifkan kategori ini?'
        }
        message={
          deactivating?.isActive === false
            ? 'Kategori akan kembali tersedia untuk laporan baru.'
            : 'Kategori nonaktif tidak akan muncul pada formulir laporan. Laporan lama tetap tersimpan.'
        }
        confirmLabel="Ya"
        cancelLabel="Batal"
        loading={deactivateMutation.isPending}
        onClose={() => setDeactivating(null)}
        onConfirm={() => {
          if (deactivating) deactivateMutation.mutate(deactivating)
        }}
      />
    </div>
  )
}

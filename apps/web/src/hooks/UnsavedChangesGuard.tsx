import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

/**
 * FE-076 — Guard perubahan yang belum disimpan.
 * Memblokir navigasi SPA (useBlocker) dan menutup tab (beforeunload).
 */
export function UnsavedChangesGuard({ when }: { when: boolean }) {
  const blocker = useBlocker(when)

  useEffect(() => {
    if (!when) return undefined
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [when])

  return (
    <ConfirmDialog
      open={blocker.state === 'blocked'}
      title="Perubahan belum disimpan"
      message="Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman ini?"
      confirmLabel="Ya, Tinggalkan"
      cancelLabel="Tetap di Sini"
      tone="danger"
      onClose={() => blocker.reset?.()}
      onConfirm={() => blocker.proceed?.()}
    />
  )
}

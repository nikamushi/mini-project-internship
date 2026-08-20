import { Link, useSearchParams } from 'react-router-dom'
import { Eye, PackageSearch } from 'lucide-react'
import { ReportFormPage } from './ReportFormPage'
import type { ReportType } from '@/api/types'
import './CreateReportPage.css'

function normalizeType(value: string | null): ReportType | null {
  const upper = value?.toUpperCase()
  if (upper === 'LOST' || upper === 'FOUND') return upper
  return null
}

export function CreateReportPage() {
  const [searchParams] = useSearchParams()
  const type = normalizeType(searchParams.get('type'))

  if (!type) {
    return (
      <div className="lc-create-report">
        <h1 className="lc-create-report__title">Buat Laporan</h1>
        <p className="lc-create-report__subtitle">Pilih jenis laporan yang ingin Anda buat.</p>
        <div className="lc-create-report__options">
          <Link
            to={{ pathname: '/reports/create', search: '?type=LOST' }}
            className="lc-create-report__option lc-create-report__option--lost"
          >
            <span className="lc-create-report__option-icon" aria-hidden="true">
              <Eye size={28} />
            </span>
            <h2 className="lc-create-report__option-title">Barang Hilang</h2>
            <p className="lc-create-report__option-text">
              Laporkan barang yang hilang agar dapat ditemukan oleh civitas kampus.
            </p>
          </Link>
          <Link
            to={{ pathname: '/reports/create', search: '?type=FOUND' }}
            className="lc-create-report__option lc-create-report__option--found"
          >
            <span className="lc-create-report__option-icon" aria-hidden="true">
              <PackageSearch size={28} />
            </span>
            <h2 className="lc-create-report__option-title">Barang Ditemukan</h2>
            <p className="lc-create-report__option-text">
              Laporkan barang yang Anda temukan agar pemilik dapat mengambilnya kembali.
            </p>
          </Link>
        </div>
      </div>
    )
  }

  return <ReportFormPage mode="create" type={type} />
}

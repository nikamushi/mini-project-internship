import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import './NotFoundPage.css'

export function NotFoundPage() {
  return (
    <div className="lc-not-found">
      <span className="lc-not-found__icon" aria-hidden="true">
        <Compass size={40} />
      </span>
      <p className="lc-not-found__code">404</p>
      <h1 className="lc-not-found__title">Halaman tidak ditemukan</h1>
      <p className="lc-not-found__text">Halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
      <div className="lc-not-found__actions">
        <Link to="/dashboard" className="lc-btn lc-btn--primary">
          Kembali ke Dashboard
        </Link>
        <Link to="/reports" className="lc-btn lc-btn--outline">
          Lihat Laporan
        </Link>
      </div>
    </div>
  )
}

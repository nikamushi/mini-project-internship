import { type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import './AuthLayout.css'

export interface AuthLayoutProps {
  children?: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="lc-auth">
      <main className="lc-auth__main">
        <Container className="lc-auth__container">
          <div className="lc-auth__brand" aria-label="Kehilangan Kampus">
            <span className="lc-auth__logo" aria-hidden="true">
              <Search size={24} />
            </span>
            <h1 className="lc-auth__title">Kehilangan Kampus</h1>
            <p className="lc-auth__subtitle">Sistem Laporan Kehilangan Barang Kampus</p>
          </div>
          <div className="lc-auth__card">{children ?? <Outlet />}</div>
        </Container>
      </main>
    </div>
  )
}

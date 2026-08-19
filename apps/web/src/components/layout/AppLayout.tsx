import { type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { HeaderProps } from '@/components/layout/Header'
import './AppLayout.css'

export interface AppLayoutProps extends Partial<HeaderProps> {
  children?: ReactNode
}

export function AppLayout({ children, ...headerProps }: AppLayoutProps) {
  return (
    <div className="lc-app">
      <Header {...headerProps} />
      <main className="lc-app__main">{children ?? <Outlet />}</main>
      <Footer />
    </div>
  )
}

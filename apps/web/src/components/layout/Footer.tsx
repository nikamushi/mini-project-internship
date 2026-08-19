import { Container } from '@/components/layout/Container'
import './Footer.css'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="lc-footer">
      <Container className="lc-footer__inner">
        <p className="lc-footer__text">© {year} Sistem Laporan Kehilangan Kampus</p>
      </Container>
    </footer>
  )
}

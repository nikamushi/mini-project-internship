import { Container } from '@/components/layout/Container'
import './PlaceholderPage.css'

export interface PlaceholderPageProps {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Container className="lc-placeholder">
      <h1 className="lc-placeholder__title">{title}</h1>
      <p className="lc-placeholder__text">
        {description ?? 'Halaman akan diimplementasikan pada fase berikutnya.'}
      </p>
    </Container>
  )
}

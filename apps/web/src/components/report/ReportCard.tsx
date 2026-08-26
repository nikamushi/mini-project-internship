import { Link } from 'react-router-dom'
import { CalendarDays, ImageOff, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { ReportSummary } from '@/api/types'
import { formatDateTime } from '@/utils/format'
import './ReportCard.css'

export interface ReportCardProps {
  report: ReportSummary
}

const TYPE_LABEL: Record<ReportSummary['type'], string> = {
  LOST: 'Hilang',
  FOUND: 'Ditemukan',
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <article
      className={[
        'lc-report-card',
        report.type === 'LOST' ? 'lc-report-card--lost' : 'lc-report-card--found',
      ].join(' ')}
    >
      <Link to={`/reports/${report.id}`} className="lc-report-card__link" aria-label={report.itemName}>
        <div className="lc-report-card__media">
          {report.images[0]?.url ? (
            <img src={report.images[0].url} alt="" loading="lazy" className="lc-report-card__image" />
          ) : (
            <span className="lc-report-card__placeholder" aria-hidden="true">
              <ImageOff size={28} />
            </span>
          )}
        </div>

        <div className="lc-report-card__body">
          <div className="lc-report-card__badges">
            <Badge tone={report.type === 'LOST' ? 'danger' : 'success'} size="sm">
              {TYPE_LABEL[report.type]}
            </Badge>
            <StatusBadge status={report.status} kind="report" size="sm" />
          </div>

          <h3 className="lc-report-card__title">{report.itemName}</h3>

          <p className="lc-report-card__meta">
            <MapPin size={14} aria-hidden="true" />
            {report.location}
          </p>
          <p className="lc-report-card__meta">
            <CalendarDays size={14} aria-hidden="true" />
            {formatDateTime(report.occurredAt)}
          </p>
        </div>
      </Link>
    </article>
  )
}

import { NEW_TAB_LABEL } from '@/components/ui/NewTabHint';
import { BodySmall } from '@/components/ui/Typography';
import type { Certification } from '@/config/content/certifications';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';
import { toDateTime } from '@/lib/utils/date';

import { ExternalLink } from 'lucide-react';

const TITLE = 'text-sm font-medium text-zinc-100';

const CertificationRow = ({
  id,
  title,
  issuer,
  date,
  description,
  credentialUrl,
}: Certification) => (
  <li className='flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8'>
    <div className='min-w-0'>
      {credentialUrl ? (
        <a
          href={credentialUrl}
          target='_blank'
          rel='noopener noreferrer'
          data-analytics-event={ANALYTICS_EVENTS.CERT_CREDENTIAL_CLICK}
          data-analytics-cert-id={id}
          className={`${TITLE} inline-flex min-h-11 items-center gap-2 transition-colors hover:text-primary-300`}
        >
          {title}
          <ExternalLink size={14} aria-hidden='true' />
          <span className='sr-only'>({NEW_TAB_LABEL})</span>
        </a>
      ) : (
        <p className={`${TITLE} flex min-h-11 items-center`}>{title}</p>
      )}
      {description && (
        <BodySmall className='max-w-[60ch] pb-1 text-zinc-300'>{description}</BodySmall>
      )}
    </div>
    <p className='shrink-0 text-xs text-zinc-400 sm:pt-3.5 sm:text-right'>
      {issuer} · <time dateTime={toDateTime(date)}>{date}</time>
    </p>
  </li>
);

export default CertificationRow;

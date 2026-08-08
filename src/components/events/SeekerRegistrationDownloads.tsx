'use client';

import { FiDownload } from 'react-icons/fi';
import { AppEvent } from '@/lib/events';

const seekerRegistrationBaseUrl = 'https://www.sahajayogatelangana.org/seeker-registration';

function slugify(value: string) {
  return value.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'event';
}

export function getSeekerRegistrationUrl(event: AppEvent) {
  return `${seekerRegistrationBaseUrl}?event=${encodeURIComponent(event.title.trim())}`;
}

export function getSeekerRegistrationQrUrl(event: AppEvent) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=900x900&margin=24&data=${encodeURIComponent(getSeekerRegistrationUrl(event))}`;
}

function getSeekerRegistrationFormDownload(event: AppEvent) {
  const formUrl = getSeekerRegistrationUrl(event);
  const title = event.title.trim();
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=${formUrl}">
  <title>${title} seeker registration form</title>
</head>
<body>
  <p><a href="${formUrl}">Open seeker registration form for ${title}</a></p>
</body>
</html>`;

  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

export default function SeekerRegistrationDownloads({
  event,
  compact = false,
}: {
  event: AppEvent;
  compact?: boolean;
}) {
  const filePrefix = slugify(event.title);
  const buttonClass = compact
    ? 'inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_96%,transparent)] px-3 py-2 text-xs font-semibold text-[color:var(--primary)] shadow-[0_10px_24px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-colors hover:bg-[color:var(--surface)]'
    : 'inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-xs font-semibold text-[color:var(--primary)] transition-colors hover:bg-[color:var(--surface-2)]';

  return (
    <>
      <a
        href={getSeekerRegistrationQrUrl(event)}
        download={`${filePrefix}-seeker-registration-qr.png`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
      >
        <FiDownload className="h-3.5 w-3.5" aria-hidden="true" />
        Download seeker registration QR
      </a>
      <a
  href={`https://www.sahajayogatelangana.org/seeker-registration?event=${encodeURIComponent(event.title)}`}
  className={buttonClass}
>
  
  Register as a seeker
</a>
    </>
  );
}

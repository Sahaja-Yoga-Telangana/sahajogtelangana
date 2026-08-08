'use client';

import { useTranslations } from '@/app/provider/localeProvider';

type UpcomingEvent = {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
};

type EventHistoryEntry = {
  receiptNumber: string;
  eventTitle: string;
  registeredAt: string;
  amountPaid: number;
  transactionNumber: string;
};

export default function YogiEventRegistrationsContent({
  upcomingEvents,
  eventHistory,
}: {
  upcomingEvents: UpcomingEvent[];
  eventHistory: EventHistoryEntry[];
}) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] p-6 shadow-soft md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">{t('event_regs.eyebrow')}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--ink)]">{t('event_regs.title')}</h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
          {t('event_regs.body')}
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title={t('event_regs.upcoming')}>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-[color:var(--muted)]">{t('event_regs.upcoming_empty')}</p>
          ) : (
            upcomingEvents.map((eventItem) => (
              <div key={eventItem._id} className="rounded-[20px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_70%,transparent)] p-4">
                <p className="font-semibold text-[color:var(--ink)]">{eventItem.title}</p>
                <p className="numeric-font mt-1 text-sm text-[color:var(--muted)]">
                  {new Date(eventItem.date).toLocaleDateString()} • {eventItem.time}
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">{eventItem.location}</p>
              </div>
            ))
          )}
        </Panel>

        <Panel title={t('event_regs.history')}>
          {eventHistory.length === 0 ? (
            <p className="text-sm text-[color:var(--muted)]">{t('event_regs.history_empty')}</p>
          ) : (
            eventHistory.map((entry) => (
              <div key={`${entry.receiptNumber}-${entry.registeredAt}`} className="rounded-[20px] border border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--surface-2)_70%,transparent)] p-4">
                <p className="font-semibold text-[color:var(--ink)]">{entry.eventTitle}</p>
                <p className="numeric-font mt-1 text-sm text-[color:var(--muted)]">{t('event_regs.receipt')} #{entry.receiptNumber}</p>
                <p className="numeric-font mt-1 text-sm text-[color:var(--muted)]">
                  {new Date(entry.registeredAt).toLocaleDateString()} • ₹{entry.amountPaid.toLocaleString()}
                </p>
                {entry.transactionNumber ? (
                  <p className="numeric-font mt-1 text-sm text-[color:var(--muted)]">{t('event_regs.transaction')}: {entry.transactionNumber}</p>
                ) : null}
              </div>
            ))
          )}
        </Panel>
      </section>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-[color:var(--ink)]">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

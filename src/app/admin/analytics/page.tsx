import { connect } from '@/database/mongo.config';
import { EventRegistration } from '@/models/EventRegistration';
import { Seeker } from '@/models/Seeker';
import { Center } from '@/models/Center';
import { CenterConnection } from '@/models/CenterConnection';
import { EventSubscription } from '@/models/EventSubscription';
import { Event } from '@/models/Event';

export default async function AnalyticsPage() {
  await connect();

  const [
    totalRegistrations,
    totalSeekers,
    totalCenters,
    totalSavedCenters,
    totalJoinedCenters,
    totalSubscriptions,
    upcomingEvents,
    registrationsByEvent,
    seekersBySource,
  ] = await Promise.all([
    EventRegistration.countDocuments(),
    Seeker.countDocuments(),
    Center.countDocuments(),
    CenterConnection.countDocuments({ connectionType: 'saved' }),
    CenterConnection.countDocuments({ connectionType: 'joined' }),
    EventSubscription.countDocuments({ isActive: true }),
    Event.countDocuments({ date: { $gte: new Date() }, isActive: true }),
    EventRegistration.aggregate([
      { $group: { _id: '$eventTitle', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Seeker.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  const conversionRate = totalSeekers > 0 ? Math.round((totalJoinedCenters / totalSeekers) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="admin-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">Analytics</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-4xl">Operational analytics dashboard</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
          Monitor registrations, seeker source quality, center activity, and simple conversion indicators without leaving the admin workspace.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Registrations" value={totalRegistrations.toString()} />
        <MetricCard label="Seekers" value={totalSeekers.toString()} />
        <MetricCard label="Upcoming events" value={upcomingEvents.toString()} />
        <MetricCard label="Active event subscribers" value={totalSubscriptions.toString()} />
        <MetricCard label="Centers listed" value={totalCenters.toString()} />
        <MetricCard label="Saved centers" value={totalSavedCenters.toString()} />
        <MetricCard label="Joined centers" value={totalJoinedCenters.toString()} />
        <MetricCard label="Conversion to joined center" value={`${conversionRate}%`} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-6">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)]">Top events by registrations</h2>
          <div className="mt-5 space-y-4">
            {registrationsByEvent.map((entry: any) => (
              <div key={entry._id} className="rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-[color:var(--ink)]">{entry._id}</p>
                  <span className="text-sm text-[color:var(--muted)]">{entry.count} registrations</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card p-6">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)]">Seekers by source</h2>
          <div className="mt-5 space-y-4">
            {seekersBySource.map((entry: any) => (
              <div key={entry._id || 'Unknown'} className="rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-[color:var(--ink)]">{entry._id || 'Unknown'}</p>
                  <span className="text-sm text-[color:var(--muted)]">{entry.count} seekers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-card p-5">
      <p className="text-sm text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[color:var(--ink)]">{value}</p>
    </div>
  );
}

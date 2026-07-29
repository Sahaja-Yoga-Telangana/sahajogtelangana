function SkeletonCard() {
  return (
    <article className="animate-pulse rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-6 w-36 rounded-full bg-[color:var(--surface-2)]" />
          <div className="mt-1.5 h-4 w-20 rounded-full bg-[color:var(--surface-2)]" />
        </div>
        <div className="h-7 w-16 rounded-full bg-[color:var(--surface-2)]" />
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-4 w-32 rounded-full bg-[color:var(--surface-2)]" />
        <div className="h-4 w-28 rounded-full bg-[color:var(--surface-2)]" />
        <div className="h-4 w-36 rounded-full bg-[color:var(--surface-2)]" />
        <div className="mt-3 pt-3 border-t border-[color:var(--border)]">
          <div className="h-4 w-full rounded-full bg-[color:var(--surface-2)]" />
          <div className="mt-1.5 h-4 w-5/6 rounded-full bg-[color:var(--surface-2)]" />
        </div>
      </div>
    </article>
  );
}

export default function Loading() {
  return (
    <div className="bg-[color:var(--bg)] pb-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="animate-pulse py-8">
          <div className="h-8 w-24 rounded-full bg-[color:var(--surface-2)]" />
          <div className="mt-2 h-4 w-32 rounded-full bg-[color:var(--surface-2)]" />
        </div>

        <div className="mb-6">
          <div className="h-12 w-full rounded-xl bg-[color:var(--surface-2)]" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

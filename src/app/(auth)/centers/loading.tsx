function SkeletonCard() {
  return (
    <article className="animate-pulse rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="h-3 w-16 rounded-full bg-[color:var(--surface-2)]" />
          <div className="mt-3 h-8 w-40 rounded-full bg-[color:var(--surface-2)]" />
          <div className="mt-2 h-4 w-24 rounded-full bg-[color:var(--surface-2)]" />
        </div>
        <div className="h-10 w-28 rounded-full bg-[color:var(--surface-2)]" />
      </div>

      <div className="mt-5 space-y-3">
        <div className="h-4 w-full rounded-full bg-[color:var(--surface-2)]" />
        <div className="h-4 w-3/4 rounded-full bg-[color:var(--surface-2)]" />
        <div className="h-4 w-2/3 rounded-full bg-[color:var(--surface-2)]" />
        <div className="h-4 w-1/2 rounded-full bg-[color:var(--surface-2)]" />
      </div>

      <div className="mt-5 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-2)]/65 p-4">
        <div className="h-3 w-24 rounded-full bg-[color:var(--surface-2)]" />
        <div className="mt-3 h-4 w-full rounded-full bg-[color:var(--surface-2)]" />
        <div className="mt-2 h-4 w-5/6 rounded-full bg-[color:var(--surface-2)]" />
      </div>
    </article>
  );
}

export default function Loading() {
  return (
    <div className="page-container bg-[color:var(--bg)] pb-6 text-[color:var(--ink)] lg:px-20">
      <div className="mx-4 lg:mx-6">
        <div className="mx-auto mb-8 max-w-5xl rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)]/86 p-6 shadow-soft">
          <div className="animate-pulse">
            <div className="h-10 w-40 rounded-full bg-[color:var(--surface-2)]" />
            <div className="mt-4 h-6 w-72 rounded-full bg-[color:var(--surface-2)]" />
            <div className="mt-3 h-4 w-full rounded-full bg-[color:var(--surface-2)]" />
            <div className="mt-2 h-4 w-5/6 rounded-full bg-[color:var(--surface-2)]" />
            <div className="mt-6 h-12 w-full rounded-2xl bg-[color:var(--surface-2)]" />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

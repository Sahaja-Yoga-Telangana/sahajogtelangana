export default function Loading() {
	return (
		<div className="flex min-h-[60vh] items-center justify-center bg-[color:var(--bg)]">
			<div className="flex flex-col items-center gap-4">
				<div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[color:var(--primary)]" />
				<p className="text-sm text-[color:var(--muted)] animate-pulse">Loading…</p>
			</div>
		</div>
	);
}

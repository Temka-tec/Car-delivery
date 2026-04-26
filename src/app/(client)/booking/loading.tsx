import { SkeletonListItem } from "@/components/skeleton-card";

export default function BookingLoading() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-white/8 px-2 py-6">
          <div className="flex items-center gap-3">
            <div className="skeleton h-9 w-28 rounded-lg" />
            <div className="skeleton h-7 w-32 rounded-lg" />
          </div>
          <div className="skeleton h-9 w-9 rounded-full" />
        </div>

        <div className="border-b border-white/8 bg-[var(--color-surface)] px-2 py-6 sm:px-4">
          <div className="skeleton mb-3 h-3 w-20 rounded" />
          <div className="grid gap-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-11 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="grid min-h-[680px] lg:grid-cols-[280px_1fr]">
          <aside className="border-r border-white/8 bg-[var(--color-surface)] p-6">
            <div className="skeleton mb-6 h-4 w-16 rounded" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton h-4 rounded"
                  style={{ width: `${60 + (i % 3) * 15}%` }}
                />
              ))}
            </div>
          </aside>

          <div className="p-6">
            <div className="skeleton mb-5 h-4 w-40 rounded" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="grid items-start overflow-hidden rounded-2xl border border-white/8 bg-[var(--color-panel)] xl:grid-cols-[220px_1fr_180px]"
                >
                  <div className="skeleton min-h-44 rounded-none" />
                  <div className="flex flex-col gap-3 p-5">
                    <div className="skeleton h-5 w-1/2 rounded-lg" />
                    <div className="skeleton h-3.5 w-2/3 rounded-lg" />
                    <div className="flex gap-2">
                      <div className="skeleton h-6 w-16 rounded-md" />
                      <div className="skeleton h-6 w-20 rounded-md" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 border-t border-white/8 p-5 xl:border-l xl:border-t-0">
                    <div className="skeleton ml-auto h-8 w-28 rounded-lg" />
                    <div className="skeleton h-10 w-full rounded-lg" />
                    <div className="skeleton h-9 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="skeleton mb-4 h-5 w-36 rounded-lg" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <SkeletonListItem key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

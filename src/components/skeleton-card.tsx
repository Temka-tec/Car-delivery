export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-white/8 bg-[var(--color-surface)]">
      <div className="skeleton h-36 w-full rounded-none" />

      <div className="flex flex-col gap-3 p-5">
        <div className="skeleton h-5 w-2/3 rounded-lg" />
        <div className="skeleton h-3.5 w-full rounded-lg" />
        <div className="mt-1 flex gap-2">
          <div className="skeleton h-6 w-16 rounded-md" />
          <div className="skeleton h-6 w-20 rounded-md" />
          <div className="skeleton h-6 w-14 rounded-md" />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="skeleton h-7 w-24 rounded-lg" />
          <div className="skeleton h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/8 bg-[var(--color-panel)] p-4">
      <div className="skeleton h-20 w-28 flex-shrink-0 rounded-xl" />
      <div className="flex flex-1 flex-col justify-center gap-2">
        <div className="skeleton h-4 w-1/2 rounded-lg" />
        <div className="skeleton h-3 w-1/3 rounded-lg" />
        <div className="skeleton h-3 w-2/3 rounded-lg" />
      </div>
      <div className="flex flex-col items-end justify-center gap-2">
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-24 rounded-lg" />
      </div>
    </div>
  );
}

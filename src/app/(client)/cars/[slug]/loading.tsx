export default function CarDetailsLoading() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mb-6 h-5 w-24 rounded bg-white/8" />
        <div className="grid gap-6 xl:grid-cols-[1.35fr_420px]">
          <div className="space-y-4">
            <div className="h-72 rounded-[24px] bg-white/8" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-16 rounded-2xl bg-white/8" />
              ))}
            </div>
            <div className="h-8 w-72 rounded bg-white/8" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-28 rounded-[18px] bg-white/8" />
              ))}
            </div>
          </div>
          <div className="h-[560px] rounded-[24px] bg-white/8" />
        </div>
      </div>
    </main>
  );
}

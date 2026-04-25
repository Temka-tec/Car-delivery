"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type CarImageGalleryProps = {
  carName: string;
  carYear: string;
  carColor: string;
  heroImage: string | null;
  icon: string;
  gallery: string[];
};

const isStoredImage = (value: string) => value.startsWith("/");

export function CarImageGallery({
  carName,
  carYear,
  carColor,
  heroImage,
  icon,
  gallery,
}: CarImageGalleryProps) {
  const storedGallery = gallery.filter(isStoredImage);
  const displayImages =
    storedGallery.length > 0
      ? storedGallery
      : heroImage && isStoredImage(heroImage)
        ? [heroImage]
        : [];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage =
    activeIndex === null ? null : displayImages[activeIndex] ?? null;

  useEffect(() => {
    if (activeIndex === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (displayImages.length <= 1) {
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? 0 : (current + 1) % displayImages.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? 0 : (current - 1 + displayImages.length) % displayImages.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, displayImages.length]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (displayImages.length > 0) {
            setActiveIndex(0);
          }
        }}
        disabled={displayImages.length === 0}
        className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(135deg,#1A1A26,#22222E)] text-left transition enabled:cursor-zoom-in enabled:hover:border-[rgba(201,168,76,0.35)] disabled:cursor-default"
      >
        {heroImage ? (
          <Image
            src={heroImage}
            alt={carName}
            fill
            sizes="(max-width: 1280px) 100vw, 66vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="font-display text-7xl font-extrabold tracking-[0.12em] text-white/80">
            {icon}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-black/35 px-3 py-2 text-xs text-[var(--color-muted)]">
          {carName} {carYear} · {carColor}
        </div>
      </button>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {gallery.map((item, index) => {
          const previewIndex = displayImages.findIndex((image) => image === item);

          return (
            <button
              key={`${carName}-${item}-${index}`}
              type="button"
              onClick={() => {
                if (previewIndex >= 0) {
                  setActiveIndex(previewIndex);
                }
              }}
              disabled={previewIndex < 0}
              className={`relative flex h-16 items-center justify-center overflow-hidden rounded-2xl border text-2xl transition ${
                index === 0
                  ? "border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.08)]"
                  : "border-white/8 bg-[var(--color-panel)]"
              } ${previewIndex >= 0 ? "cursor-pointer hover:border-[rgba(201,168,76,0.35)]" : "cursor-default"}`}
            >
              {item.startsWith("/") ? (
                <Image
                  src={item}
                  alt={`${carName} зураг ${index + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                item
              )}
            </button>
          );
        })}
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#090A0F] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
              <div>
                <div className="text-sm font-semibold text-white">{carName}</div>
                <div className="mt-1 text-xs text-[var(--color-muted)]">
                  {activeIndex + 1} / {displayImages.length}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/70 transition hover:text-white"
              >
                Хаах
              </button>
            </div>

            <div className="relative min-h-[320px] bg-black sm:min-h-[560px]">
              <Image
                src={activeImage}
                alt={carName}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-contain"
                unoptimized
              />

              {displayImages.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((current) =>
                        current === null ? 0 : (current - 1 + displayImages.length) % displayImages.length,
                      )
                    }
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-xl text-white transition hover:bg-black/75"
                    aria-label="Өмнөх зураг"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((current) =>
                        current === null ? 0 : (current + 1) % displayImages.length,
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-xl text-white transition hover:bg-black/75"
                    aria-label="Дараагийн зураг"
                  >
                    ›
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

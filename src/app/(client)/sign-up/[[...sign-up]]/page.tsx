"use client";

import Link from "next/link";
import { SignUp, useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SignUpPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const compactMode = searchParams.get("compact") === "1";
  const redirectUrl = searchParams.get("redirect_url") || "/auth/redirect";

  useEffect(() => {
    if (isLoaded && userId) {
      router.replace(redirectUrl);
    }
  }, [isLoaded, redirectUrl, router, userId]);

  if (isLoaded && userId) {
    return null;
  }

  if (compactMode) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4 text-[var(--color-text)] sm:p-6">
        <div className="w-full max-w-md rounded-[28px] border border-white/8 bg-[var(--color-surface)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:p-6">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent border-0",
                headerTitle:
                  "font-display text-2xl font-extrabold text-[var(--color-text)]",
                headerSubtitle: "text-[var(--color-muted)]",
                socialButtonsBlockButton:
                  "border-white/8 bg-[var(--color-panel)] text-[var(--color-text)] hover:bg-[#22222E]",
                socialButtonsBlockButtonText: "text-[var(--color-text)]",
                formButtonPrimary:
                  "bg-[var(--color-gold)] text-[var(--color-ink)] hover:bg-[var(--color-gold-light)] shadow-none",
                formFieldInput:
                  "bg-[var(--color-panel)] border-white/8 text-[var(--color-text)]",
                footerActionLink:
                  "text-[var(--color-gold)] hover:text-[var(--color-gold-light)]",
                formFieldLabel: "text-[var(--color-muted)]",
                dividerLine: "bg-white/8",
                dividerText: "text-[var(--color-muted)]",
              },
            }}
            path="/sign-up"
            routing="path"
            signInUrl={`/sign-in?compact=1&redirect_url=${encodeURIComponent(redirectUrl)}`}
            forceRedirectUrl={redirectUrl}
            fallbackRedirectUrl={redirectUrl}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative flex flex-col justify-between overflow-hidden border-b border-white/8 bg-[linear-gradient(160deg,#0A0A0F_0%,#12121A_60%,#0F0F18_100%)] p-8 lg:border-b-0 lg:border-r lg:border-white/8 lg:p-12">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.09)_0%,transparent_70%)]" />
          <Link
            href="/"
            className="font-display text-2xl font-extrabold tracking-[-0.04em]"
          >
            ALPHARD<span className="text-[var(--color-gold)]">.</span>
          </Link>

          <div className="relative max-w-md">
            <div className="mb-5 inline-flex rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] px-4 py-1.5 text-xs text-[var(--color-gold)]">
              Шинэ хэрэглэгчийн бүртгэл
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-[-0.05em] sm:text-5xl">
              Дараагийн
              <br />
              <span className="text-[var(--color-gold)]">аяллаа</span>
              <br />
              эндээс эхлүүл
            </h1>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              Бүртгүүлээд баталгаажсан жолооч, найдвартай машинтай аяллаа хэдхэн
              алхмаар захиалах боломжтой болно.
            </p>
            <div className="mt-8 space-y-3 text-sm text-[var(--color-muted)]">
              <div>• Хэдхэн минутын дотор шинэ эрх нээнэ</div>
              <div>• Баталгаажсан жолооч, даатгалтай машин сонгоно</div>
              <div>• Захиалгын түүх, сэтгэгдлээ нэг газраас удирдана</div>
              <div>• Дараа нь жолооч эсвэл байгууллагын хүсэлт гаргаж болно</div>
            </div>
          </div>

          <div className="text-xs text-[#5A5856]">
            © 2026 Alphard Rentals · Улаанбаатар, Монгол
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md rounded-[28px] border border-white/8 bg-[var(--color-surface)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:p-6">
            <SignUp
              appearance={{
                elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent border-0",
                headerTitle:
                  "font-display text-2xl font-extrabold text-[var(--color-text)]",
                headerSubtitle: "text-[var(--color-muted)]",
                socialButtonsBlockButton:
                  "border-white/8 bg-[var(--color-panel)] text-[var(--color-text)] hover:bg-[#22222E]",
                socialButtonsBlockButtonText: "text-[var(--color-text)]",
                formButtonPrimary:
                  "bg-[var(--color-gold)] text-[var(--color-ink)] hover:bg-[var(--color-gold-light)] shadow-none",
                formFieldInput:
                  "bg-[var(--color-panel)] border-white/8 text-[var(--color-text)]",
                footerActionLink: "text-[var(--color-gold)] hover:text-[var(--color-gold-light)]",
                formFieldLabel: "text-[var(--color-muted)]",
                dividerLine: "bg-white/8",
                dividerText: "text-[var(--color-muted)]",
                },
              }}
              path="/sign-up"
              routing="path"
              signInUrl="/sign-in"
              forceRedirectUrl={redirectUrl}
              fallbackRedirectUrl={redirectUrl}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

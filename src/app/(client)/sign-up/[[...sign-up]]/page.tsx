"use client";

import Link from "next/link";
import { SignUp, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function SignUpPage() {
  const { isLoaded, userId } = useAuth();

  if (isLoaded && userId) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-8 text-[var(--color-text)] sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[28px] border border-white/8 bg-[linear-gradient(160deg,#0A0A0F_0%,#12121A_60%,#0F0F18_100%)] p-8">
          <Link
            href="/"
            className="font-display text-2xl font-extrabold tracking-[-0.04em]"
          >
            ALPHARD<span className="text-[var(--color-gold)]">.</span>
          </Link>
          <h1 className="mt-8 font-display text-4xl font-extrabold tracking-[-0.05em]">
            Шинэ хэрэглэгчийн
            <br />
            <span className="text-[var(--color-gold)]">бүртгэл</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--color-muted)]">
            Эхлээд хэрэглэгчээр бүртгүүлээд, дараа нь профайлаасаа жолооч эсвэл
            компанийн хүсэлт гаргах боломжтой.
          </p>
        </section>

        <section className="flex items-center justify-center rounded-[28px] border border-white/8 bg-[var(--color-surface)] p-4 sm:p-6">
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
            fallbackRedirectUrl="/"
          />
        </section>
      </div>
    </main>
  );
}

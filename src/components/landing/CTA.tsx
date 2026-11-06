import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import CTAButton from "./CTAButton";

export default function CTA() {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32 lg:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(139,92,246,0.22)_0%,transparent_65%)]"
      />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Give your business a voice
          <br />
          your customers understand.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/60">
          Join 500+ Indian businesses already building with NotHuman.ai —
          free to start, no credit card required.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <CTAButton href="/dashboard" className="gap-2 px-7 py-3.5 text-sm">
            Start Building Free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </CTAButton>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-violet-400/40 hover:bg-violet-500/10"
          >
            Talk to Sales
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

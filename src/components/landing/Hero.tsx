"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Star, Activity, Clock3 } from "lucide-react";
import { HERO_STATS } from "./data";
import CTAButton from "./CTAButton";

const RobotFaceScene = dynamic(() => import("./RobotFaceScene"), {
  ssr: false,
  loading: () => <FaceFallback />,
});

function FaceFallback() {
  return (
    <div className="flex size-full items-center justify-center">
      <div className="size-56 animate-pulse rounded-full bg-gradient-to-br from-violet-500/40 via-fuchsia-500/20 to-amber-400/20 blur-2xl" />
    </div>
  );
}

function HudChip({
  className,
  delay = 0.5,
  children,
}: {
  className: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`glass animate-float absolute z-20 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white shadow-xl shadow-black/20 ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-20 lg:pt-32"
    >
      <div className="bg-grid mask-radial-fade pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="animate-blob-drift pointer-events-none absolute -left-32 top-16 size-[28rem] rounded-full bg-violet-600/20 blur-[90px]"
      />
      <div
        aria-hidden
        className="animate-blob-drift pointer-events-none absolute bottom-0 right-10 size-[24rem] rounded-full bg-amber-400/10 blur-[100px]"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-violet-300">
            <span className="animate-pulse-dot size-1.5 rounded-full bg-violet-400" />
            Live across India · 12 regional languages
          </span>

          <h1 className="mt-6 text-balance font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[3.6rem]">
            The future of voice
            <br />
            is <span className="gradient-text">Not Human</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
            Design, train and launch voice AI agents that speak fluent Hindi,
            Tamil, Telugu and 9 more Indian languages — no code, no call
            centre, no compromise.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <CTAButton href="/dashboard" className="gap-2 px-7 py-3.5 text-sm">
              Start Building Free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </CTAButton>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-violet-400/40 hover:bg-violet-500/10"
            >
              <Play className="size-3.5 fill-current" />
              Watch 2-min Demo
            </button>
          </div>

          <div className="mt-7 flex items-center gap-2 text-sm text-white/50">
            <div className="flex -space-x-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </div>
            Rated 4.9/5 by 500+ teams across India
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {HERO_STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl">
                  {s.value}
                </dd>
                <dd className="mt-1 text-xs text-white/45">{s.label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg"
        >
          <div className="absolute inset-0">
            {reduceMotion ? <FaceFallback /> : <RobotFaceScene />}
          </div>

          <HudChip className="left-0 top-6 sm:left-2">
            <Activity className="size-3.5 text-violet-300" />
            Transcribing · हिंदी
          </HudChip>
          <HudChip className="right-0 top-1/3 sm:right-2" delay={0.9}>
            <span className="flex gap-0.5">
              {[6, 10, 4, 12, 7].map((h, i) => (
                <span
                  key={i}
                  className="w-0.5 rounded-full bg-emerald-400"
                  style={{ height: `${h}px` }}
                />
              ))}
            </span>
            Sentiment: Positive
          </HudChip>
          <HudChip className="bottom-4 left-1/4" delay={1.3}>
            <Clock3 className="size-3.5 text-amber-300" />
            Resolved in 48s
          </HudChip>
        </motion.div>
      </div>
    </section>
  );
}

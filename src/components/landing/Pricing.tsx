"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import CTAButton from "./CTAButton";
import { PRICING_PLANS } from "./data";

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="scroll-mt-24 px-6 py-24 md:py-32 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          subtitle="Start free. Scale as you grow. No hidden fees, billed in rupees."
          center
        />

        <Reveal delay={0.1} className="mt-10 flex justify-center">
          <div className="glass inline-flex items-center gap-1 rounded-full p-1">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !annual ? "bg-violet-600 text-white" : "text-white/50"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                annual ? "bg-violet-600 text-white" : "text-white/50"
              }`}
            >
              Annual
              <span className="rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                Save 20%
              </span>
            </button>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 transition-transform duration-300 hover:-translate-y-1 ${
                  plan.featured
                    ? "border-violet-500/50 bg-violet-500/[0.07] shadow-[0_0_60px_rgba(139,92,246,0.15)]"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    Most Popular
                  </span>
                )}

                <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">
                  {plan.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-1">
                  {plan.monthly === null ? (
                    <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-white">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-white">
                        ₹{(annual ? plan.annual! : plan.monthly).toLocaleString("en-IN")}
                      </span>
                      <span className="text-white/40">/mo</span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-sm text-white/45">{plan.sub}</p>

                <ul className="mt-7 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                      <Check className="mt-0.5 size-4 shrink-0 text-violet-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.featured ? (
                  <CTAButton href="/dashboard" className="mt-8 w-full py-3 text-sm">
                    {plan.monthly === null ? "Contact Sales" : "Get Started"}
                  </CTAButton>
                ) : (
                  <Link
                    href="/dashboard"
                    className="mt-8 rounded-xl border border-white/15 py-3 text-center text-sm font-semibold text-white transition-colors hover:border-violet-400/40 hover:bg-violet-500/10"
                  >
                    {plan.monthly === null ? "Contact Sales" : "Get Started"}
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

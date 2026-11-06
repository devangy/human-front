import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { STEPS } from "./data";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 px-6 py-24 md:py-32 lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Process"
          title="From idea to live agent, in days"
          subtitle="A no-code path from blank canvas to a voice agent handling real conversations — in the languages your customers already speak."
          center
        />

        <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent md:block"
          />

          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.12} className="relative">
              <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-violet-500/[0.06]">
                <div className="relative z-10 flex size-14 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                  <step.icon className="size-6 text-violet-300" />
                </div>
                <span className="mt-6 block font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.2em] text-violet-400">
                  STEP {step.num}
                </span>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

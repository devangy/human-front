import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { FEATURES, LANGUAGES } from "./data";

export default function BentoFeatures() {
  return (
    <section
      id="features"
      className="scroll-mt-24 px-6 py-24 md:py-32 lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Capabilities"
          title="Built for enterprise scale, tuned for India"
          subtitle="Every feature you need to deploy AI voice at scale, with the reliability — and regional nuance — your customers expect."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const span =
              i === 0 || i === FEATURES.length - 1
                ? "md:col-span-2 lg:col-span-2"
                : "lg:col-span-1";
            return (
              <Reveal key={f.title} delay={i * 0.08} className={span}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-500/[0.05]">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                    <f.icon className="size-5 text-violet-300" />
                  </div>
                  <h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-bold text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2.5 max-w-md text-sm leading-relaxed text-white/55">
                    {f.desc}
                  </p>

                  {f.big ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {LANGUAGES.slice(0, 7).map((l) => (
                        <span
                          key={l.en}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/60"
                        >
                          {l.native}
                        </span>
                      ))}
                      <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-300">
                        +5 more
                      </span>
                    </div>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

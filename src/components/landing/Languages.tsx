import { Mic } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { LANGUAGES } from "./data";

export default function Languages() {
  const n = LANGUAGES.length;

  return (
    <section
      id="languages"
      className="scroll-mt-24 px-6 py-24 md:py-32 lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Language Coverage"
          title="One platform. Every language your customers actually speak."
          subtitle="Stop losing customers to a language barrier. Deploy agents that switch fluidly between English and whichever language your caller is most comfortable in — mid-sentence, if needed."
          center
        />

        {/* Orbit layout — desktop */}
        <Reveal
          delay={0.15}
          className="relative mx-auto mt-16 hidden aspect-square w-full max-w-xl lg:block"
        >
          <div className="absolute inset-[6%] animate-spin-slower rounded-full border border-dashed border-violet-400/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass flex size-24 flex-col items-center justify-center rounded-full text-center shadow-[0_0_50px_rgba(139,92,246,0.25)]">
              <Mic className="size-6 text-violet-300" />
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                Voice AI
              </span>
            </div>
          </div>

          {LANGUAGES.map((lang, i) => {
            const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
            const radius = 42;
            const left = 50 + radius * Math.cos(angle);
            const top = 50 + radius * Math.sin(angle);
            return (
              <div
                key={lang.en}
                className="animate-float absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${(i % 6) * 0.4}s`,
                }}
              >
                <div
                  dir={lang.dir}
                  className="glass rounded-xl px-3.5 py-2 text-base font-semibold text-white shadow-lg shadow-black/20"
                >
                  {lang.native}
                </div>
                <span className="mt-1.5 text-[11px] text-white/40">
                  {lang.en}
                </span>
              </div>
            );
          })}
        </Reveal>

        {/* Wrapped grid — mobile / tablet */}
        <Reveal delay={0.1} className="mt-14 flex flex-wrap justify-center gap-3 lg:hidden">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.en}
              className="glass flex items-center gap-2 rounded-full px-4 py-2"
            >
              <span dir={lang.dir} className="text-sm font-semibold text-white">
                {lang.native}
              </span>
              <span className="text-xs text-white/40">{lang.en}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

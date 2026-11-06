import { TRUSTED_BY } from "./data";

export default function LogoMarquee() {
  const row = [...TRUSTED_BY, ...TRUSTED_BY];

  return (
    <section className="relative border-y border-white/5 bg-white/[0.02] py-10">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-white/35">
        Powering voice AI for ambitious teams across India
      </p>
      <div
        className="relative mx-auto max-w-6xl overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="animate-marquee flex w-max items-center gap-16 whitespace-nowrap">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-white/30"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

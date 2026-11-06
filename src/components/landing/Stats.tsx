"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { STATS_BAND } from "./data";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(0);
  const isDecimal = value % 1 !== 0;

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();

    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {isDecimal ? display.toFixed(1) : Math.round(display).toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="border-b border-white/5 px-6 py-20 lg:px-10">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-10 text-center lg:grid-cols-4">
        {STATS_BAND.map((s) => (
          <div key={s.label}>
            <dd className="font-[family-name:var(--font-display)] text-4xl font-bold text-white sm:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </dd>
            <dt className="mt-2 text-sm text-white/50">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

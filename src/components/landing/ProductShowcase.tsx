"use client";

import { useRef, useState, useEffect, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Phone, MessageCircle, GitBranch, UserRound, PackageCheck } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const NODES = [
  { key: "call", label: "Incoming Call", icon: Phone, x: 16, y: 16, w: 160, h: 48 },
  { key: "greet", label: "Greet · Auto-detect", icon: MessageCircle, x: 16, y: 96, w: 160, h: 48 },
  { key: "intent", label: "Detect Intent", icon: GitBranch, x: 16, y: 176, w: 160, h: 56 },
  { key: "billing", label: "Billing Query", icon: PackageCheck, x: 252, y: 48, w: 168, h: 48 },
  { key: "human", label: "Talk to Human", icon: UserRound, x: 252, y: 256, w: 168, h: 48 },
  { key: "fetch", label: "Fetch Order Status", icon: PackageCheck, x: 460, y: 48, w: 160, h: 48 },
  { key: "transfer", label: "Transfer to Agent", icon: UserRound, x: 460, y: 256, w: 160, h: 48 },
] as const;

const EDGES = [
  "M96,64 L96,96",
  "M96,144 L96,176",
  "M176,204 C 210,204 210,72 252,72",
  "M176,204 C 210,204 210,280 252,280",
  "M420,72 L460,72",
  "M420,280 L460,280",
];

const TRANSCRIPT = [
  { who: "Customer", text: "मेरा ऑर्डर अभी तक नहीं आया।" },
  {
    who: "Agent",
    text: "मुझे खेद है! आपका ऑर्डर कल तक पहुंच जाएगा — I'll share the tracking link on WhatsApp too.",
  },
  { who: "Customer", text: "Thank you!" },
  { who: "Agent", text: "आपका स्वागत है। Anything else I can help with?" },
] as const;

function FlowDiagram() {
  return (
    <div className="relative w-full aspect-[640/330]">
      <svg
        viewBox="0 0 640 330"
        className="absolute inset-0 size-full overflow-visible"
        fill="none"
      >
        {EDGES.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="#8b5cf6"
            strokeOpacity={0.45}
            strokeWidth={2}
            strokeDasharray="5 6"
            className="edge-flow"
          />
        ))}
      </svg>

      {NODES.map((node) => (
        <div
          key={node.key}
          className="glass absolute flex items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium text-white/85 shadow-lg shadow-black/30"
          style={{
            left: `${(node.x / 640) * 100}%`,
            top: `${(node.y / 330) * 100}%`,
            width: `${(node.w / 640) * 100}%`,
            height: `${(node.h / 330) * 100}%`,
          }}
        >
          <node.icon className="size-4 shrink-0 text-violet-300" />
          <span className="truncate">{node.label}</span>
        </div>
      ))}
    </div>
  );
}

function LiveTranscript() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (count >= TRANSCRIPT.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), 1500);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      {TRANSCRIPT.slice(0, count).map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-[13px] leading-snug ${
            line.who === "Agent"
              ? "self-start bg-violet-500/15 text-violet-100"
              : "self-end bg-white/[0.06] text-white/75"
          }`}
        >
          <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider opacity-50">
            {line.who}
          </span>
          {line.text}
        </motion.div>
      ))}
    </div>
  );
}

export default function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), {
    stiffness: 150,
    damping: 20,
  });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section className="scroll-mt-24 px-6 py-24 md:py-32 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The Builder"
          title="Your call flow, visualized"
          subtitle="Map every branch of a conversation — intents, conditions, fallbacks — on the same no-code canvas your team uses every day, then watch your agent follow it live."
        />

        <Reveal delay={0.1} className="mt-14">
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformPerspective: 1200 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-ink-2 shadow-2xl shadow-black/40"
          >
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-3">
              <span className="size-2.5 rounded-full bg-rose-400/70" />
              <span className="size-2.5 rounded-full bg-amber-400/70" />
              <span className="size-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 text-xs text-white/40">
                flow · incoming-support-call
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
                <span className="animate-pulse-dot size-1.5 rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            <div className="grid grid-cols-1 gap-0 lg:grid-cols-5">
              <div className="p-6 lg:col-span-3 lg:p-10">
                <FlowDiagram />
              </div>
              <div className="border-t border-white/10 p-6 lg:col-span-2 lg:border-l lg:border-t-0 lg:p-8">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Live transcript
                </p>
                <LiveTranscript />
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

/** The shared primary call-to-action treatment: a glossy gradient surface
 * that sits still at rest, lifts slightly on hover, and sweeps a single
 * light reflection across itself once per hover — no idle pulsing. */
export default function CTAButton({
  href,
  children,
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-violet-500 to-violet-700 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_30px_rgba(139,92,246,0.45)] ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-[-75%] w-1/2 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-[left] duration-700 ease-out group-hover:left-[125%]"
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Link>
  );
}

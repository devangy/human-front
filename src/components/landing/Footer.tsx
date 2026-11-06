import Link from "next/link";
import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Languages", href: "#languages" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Status", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
      { label: "DPDP Compliance", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Link
              href="#top"
              className="flex items-center gap-2.5 font-[family-name:var(--font-display)] text-lg font-bold text-white"
            >
              <Logo size={30} />
              NotHuman<span className="text-white/40">.ai</span>
            </Link>
            <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-white/45">
              No-code voice AI agents, fluent in English and 11 Indian
              languages.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © 2026 NotHuman.ai. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-white/40">
            Proudly built in India
            <span className="flex h-[3px] w-10 overflow-hidden rounded-full">
              <span className="flex-1 bg-[#FF9933]" />
              <span className="flex-1 bg-white/80" />
              <span className="flex-1 bg-[#138808]" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

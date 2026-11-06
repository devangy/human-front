"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bot,
    BookOpen,
    BarChart3,
    Workflow,
    Database,
    Phone,
    ScrollText,
    Settings,
    type LucideIcon,
} from "lucide-react";

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
    { href: "/dashboard", label: "Agents", icon: Bot },
    { href: "/knowledge", label: "Knowledge Base", icon: BookOpen },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/workflows", label: "Workflows", icon: Workflow },
    { href: "/memory", label: "Memory", icon: Database },
    { href: "/phone", label: "Phone Numbers", icon: Phone },
    { href: "/logs", label: "Logs", icon: ScrollText },
    { href: "/settings", label: "Settings", icon: Settings },
];

function NavItem({
    href,
    label,
    icon: Icon,
    active,
}: {
    href: string;
    label: string;
    icon: LucideIcon;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={`group flex items-center gap-3.5 border-r-2 px-6 py-3 text-[13.5px] transition-colors ${
                active
                    ? "border-violet-400 bg-white/[0.04] font-medium text-violet-300"
                    : "border-transparent text-slate-400 hover:bg-white/[0.02] hover:text-slate-200"
            }`}
        >
            <Icon
                className={`size-[18px] shrink-0 ${active ? "text-violet-300" : "text-slate-500 group-hover:text-slate-300"}`}
                strokeWidth={1.8}
            />
            {label}
        </Link>
    );
}

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-[248px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0f1016]">
            <div className="flex items-center gap-3 px-6 py-6">
                <svg
                    width={34}
                    height={34}
                    viewBox="0 0 34 34"
                    fill="none"
                    className="shrink-0"
                    aria-hidden
                >
                    <defs>
                        <linearGradient id="sb-logo" x1="0" y1="0" x2="34" y2="34">
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="55%" stopColor="#7c3aed" />
                            <stop offset="100%" stopColor="#4c1d95" />
                        </linearGradient>
                    </defs>
                    <circle cx="17" cy="17" r="16" fill="url(#sb-logo)" />
                    <g stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.95">
                        <path d="M11 15v4" stroke="#f6b73c" />
                        <path d="M15.5 11v12" />
                        <path d="M20 9v16" />
                        <path d="M24.5 13v8" stroke="#f6b73c" />
                    </g>
                </svg>
                <span className="text-[1.35rem] font-semibold tracking-tight text-slate-100">
                    Human
                </span>
            </div>

            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-1">
                {navItems.map((item) => (
                    <NavItem
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        active={pathname.startsWith(item.href)}
                    />
                ))}
            </nav>

            <div className="flex items-center gap-3 border-t border-white/[0.05] px-6 py-5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-bold text-white">
                    AR
                </div>
                <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium text-slate-200">
                        Alex Rivera
                    </div>
                    <div className="text-[11px] text-slate-500">Admin</div>
                </div>
            </div>
        </aside>
    );
}

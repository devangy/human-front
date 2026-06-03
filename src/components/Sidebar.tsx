"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ── Icons ─────────────────────────────────────────────────────────────────
const Icon = ({
    d,
    size = 18,
    color = "currentColor",
    strokeWidth = 1.6,
    fill = "none",
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {Array.isArray(d) ? (
            d.map((p, i) => <path key={i} d={p} />)
        ) : (
            <path d={d} />
        )}
    </svg>
);

const Icons = {
    agents: [
        "M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z",
        "M3 14v7h18v-7",
        "M8 14v4M16 14v4M12 14v4",
    ],
    knowledge: [
        "M4 19.5A2.5 2.5 0 0 1 6.5 17H20",
        "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
    ],
    analytics: "M18 20V10M12 20V4M6 20v-6",
    workflows: [
        "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
        "M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12",
    ],
    memory: [
        "M3 9a9 3 0 0 1 18 0",
        "M3 9c0 1.66 4.03 3 9 3s9-1.34 9-3",
        "M3 9v6c0 1.66 4.03 3 9 3s9-1.34 9-3V9",
        "M3 15v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6",
    ],
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.6 12.18 19.79 19.79 0 0 1 1.52 3.6 2 2 0 0 1 3.49 1.44h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l1.83-1.83a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
    logs: [
        "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
        "M3 3v5h5",
        "M12 7v5l4 2",
    ],
    settings: [
        "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
        "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
    ],
    brandWave: ["M7 8v8", "M10 10v4", "M13 6v12", "M16 9v6", "M19 11v2"],
};

// ── Navigation Configuration ──────────────────────────────────────────────
const navItems = [
    { href: "/agents", label: "Agents", iconKey: "agents" },
    { href: "/knowledge", label: "Knowledge Base", iconKey: "knowledge" },
    { href: "/analytics", label: "Analytics", iconKey: "analytics" },
    { href: "/workflows", label: "Workflows", iconKey: "workflows" },
    { href: "/memory", label: "Memory", iconKey: "memory" },
    { href: "/phone", label: "Phone Numbers", iconKey: "phone" },
    { href: "/logs", label: "Logs", iconKey: "logs" },
    { href: "/settings", label: "Settings", iconKey: "settings" },
];

// ── Components ────────────────────────────────────────────────────────────
function NavItem({ href, label, iconKey, active }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <Link
            href={href}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 24px",
                cursor: "pointer",
                textDecoration: "none",
                background: active
                    ? "#25243e"
                    : isHovered
                      ? "rgba(255,255,255,0.03)"
                      : "transparent",
                color: active ? "#a78bfa" : "#8ca0b8",
                borderRight: active
                    ? "3px solid #a78bfa"
                    : "3px solid transparent",
                transition: "background 0.15s ease, color 0.15s ease",
            }}
        >
            <Icon
                d={Icons[iconKey]}
                size={22}
                color={active ? "#a78bfa" : "#8ca0b8"}
                strokeWidth={1.8}
            />
            <span style={{ fontSize: 14.5, fontWeight: active ? 500 : 400 }}>
                {label}
            </span>
        </Link>
    );
}

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside
            style={{
                width: 250,
                background: "#151724",
                borderRight: "1px solid #1f233a",
                display: "flex",
                flexDirection: "column",
                zIndex: 20,
                flexShrink: 0, // Prevents sidebar from squishing
                height: "100vh", // Full height
            }}
        >
            <div
                style={{
                    padding: "26px 24px 30px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                }}
            >
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: "#8b5cf6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon
                        d={Icons.brandWave}
                        size={22}
                        color="#fff"
                        strokeWidth={2}
                    />
                </div>
                <span
                    style={{
                        color: "#e2e8f0",
                        fontSize: 22,
                        fontWeight: 600,
                        letterSpacing: "-0.5px",
                    }}
                >
                    Human
                </span>
            </div>

            <nav
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                {navItems.map(({ href, label, iconKey }) => (
                    <NavItem
                        key={href}
                        href={href}
                        label={label}
                        iconKey={iconKey}
                        active={pathname.includes(href)} // Automatically determines active state
                    />
                ))}
            </nav>

            <div
                style={{
                    padding: "20px 24px",
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#7c3aed,#3b82f6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "#fff",
                        fontWeight: 700,
                    }}
                >
                    AR
                </div>
                <div>
                    <div
                        style={{
                            color: "#e2e8f0",
                            fontSize: 13,
                            fontWeight: 500,
                        }}
                    >
                        Alex Rivera
                    </div>
                    <div
                        style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}
                    >
                        Admin
                    </div>
                </div>
            </div>
        </aside>
    );
}

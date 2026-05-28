"use client";

import { useState } from "react";

// ── SVG Icon primitives ──────────────────────────────────────────────────────

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
    search: ["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "M21 21l-4.35-4.35"],
    bell: [
        "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9",
        "M13.73 21a2 2 0 0 1-3.46 0",
    ],
    help: [
        "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
        "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
        "M12 17h.01",
    ],
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
    plus: "M12 5v14M5 12h14",
    filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    flow: ["M5 12H19", "M12 5l7 7-7 7"],
    prompt: [
        "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
        "M14 2v6h6",
        "M16 13H8M16 17H8M10 9H8",
    ],
    more: "M12 5h.01M12 12h.01M12 19h.01",
    check: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4 12 14.01l-3-3"],
    clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
    mic: [
        "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z",
        "M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8",
    ],
    globe: [
        "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z",
        "M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
    ],
    chevLeft: "M15 18l-6-6 6-6",
    chevRight: "M9 18l6-6-6-6",
    brandWave: ["M7 8v8", "M10 10v4", "M13 6v12", "M16 9v6", "M19 11v2"],
};

const agents = [
    {
        id: "AG-8842-X",
        name: "Customer Support Pro",
        version: "V2.4",
        mode: "Flow",
        type: "Inbound",
        status: "Active",
        edited: "Oct 24, 2023 · 14:20",
        iconKey: "phone",
        iconBg: "#1e3a5f",
        iconColor: "#60a5fa",
    },
    {
        id: "AG-9120-L",
        name: "Lead Gen Specialist",
        version: "V1.0",
        mode: "Prompt",
        type: "Outbound",
        status: "Draft",
        edited: "Oct 23, 2023 · 09:15",
        iconKey: "mic",
        iconBg: "#2d1f4e",
        iconColor: "#a78bfa",
    },
    {
        id: "AG-4451-B",
        name: "Booking Assistant",
        version: "V3.2",
        mode: "Flow",
        type: "Inbound",
        status: "Active",
        edited: "Oct 21, 2023 · 18:44",
        iconKey: "clock",
        iconBg: "#1a3a2e",
        iconColor: "#34d399",
    },
    {
        id: "AG-1022-M",
        name: "Multi-Lingual Gatekeeper",
        version: "V1.5",
        mode: "Flow",
        type: "Inbound",
        status: "Paused",
        edited: "Oct 18, 2023 · 11:30",
        iconKey: "globe",
        iconBg: "#3a2a10",
        iconColor: "#fbbf24",
    },
];

const statusConfig = {
    Active: {
        color: "#34d399",
        dot: "#34d399",
    },
    Draft: {
        color: "#94a3b8",
        dot: "#94a3b8",
    },
    Paused: {
        color: "#fb923c",
        dot: "#fb923c",
    },
};

const navItems = [
    { id: "agents", label: "Agents", iconKey: "agents" },
    { id: "knowledge", label: "Knowledge Base", iconKey: "knowledge" },
    { id: "analytics", label: "Analytics", iconKey: "analytics" },
    { id: "workflows", label: "Workflows", iconKey: "workflows" },
    { id: "memory", label: "Memory", iconKey: "memory" },
    { id: "phone", label: "Phone Numbers", iconKey: "phone" },
    { id: "logs", label: "Logs", iconKey: "logs" },
    { id: "settings", label: "Settings", iconKey: "settings" },
];

function NavItem({ id, label, iconKey, active, onSelect }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onSelect(id)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 24px",
                cursor: "pointer",
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
        </div>
    );
}

function Sidebar({ activeItem, onSelect }) {
    return (
        <aside
            style={{
                width: 250,
                background: "#151724",
                borderRight: "1px solid #1f233a",
                display: "flex",
                flexDirection: "column",
                zIndex: 20,
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
                {navItems.map(({ id, label, iconKey }) => (
                    <NavItem
                        key={id}
                        id={id}
                        label={label}
                        iconKey={iconKey}
                        active={activeItem === id}
                        onSelect={onSelect}
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

export default function Dashboard() {
    const [activePage, setActivePage] = useState(1);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [activeNav, setActiveNav] = useState("agents");

    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                fontFamily: "'Inter','DM Sans','Segoe UI',sans-serif",
                background: "#13141f",
                overflow: "hidden",
            }}
        >
            {/* ── SIDEBAR (unchanged) ── */}
            <Sidebar activeItem={activeNav} onSelect={setActiveNav} />

            {/* ── MAIN CONTENT ── */}
            <main
                style={{
                    flex: 1,
                    overflowY: "auto",
                    background: "#13141f",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* ── TOPBAR ── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        padding: "14px 28px",
                        background: "#13141f",
                        borderBottom: "1px solid #1e2235",
                        gap: 12,
                        position: "sticky",
                        top: 0,
                        zIndex: 20,
                    }}
                >
                    {/* Search bar */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                            background: "#1c1e2e",
                            border: "1px solid #2a2d45",
                            borderRadius: 8,
                            padding: "8px 14px",
                            width: 280,
                        }}
                    >
                        <Icon d={Icons.search} size={14} color="#4a5070" />
                        <input
                            placeholder="Search agents, nodes, or files…"
                            style={{
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                color: "#4a5070",
                                fontSize: 13,
                                width: "100%",
                                fontFamily: "inherit",
                            }}
                        />
                    </div>

                    {/* Bell icon */}
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: "#1c1e2e",
                            border: "1px solid #2a2d45",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <Icon d={Icons.bell} size={16} color="#4a5070" />
                    </div>
                </div>

                {/* ── BODY ── */}
                <div style={{ padding: "28px 28px", flex: 1 }}>
                    {/* Page Header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 24,
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    color: "#e8eaf6",
                                    fontSize: 20,
                                    fontWeight: 700,
                                    margin: 0,
                                    letterSpacing: -0.3,
                                }}
                            >
                                My Agents
                            </h1>
                            <p
                                style={{
                                    color: "#4a5070",
                                    fontSize: 13,
                                    margin: "4px 0 0",
                                }}
                            >
                                Orchestrate and monitor your voice AI fleet.
                            </p>
                        </div>

                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: 8,
                                    border: "1px solid #2a2d45",
                                    background: "#1c1e2e",
                                    color: "#8892b0",
                                    fontSize: 13,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 7,
                                    fontFamily: "inherit",
                                    fontWeight: 500,
                                }}
                            >
                                <Icon
                                    d={Icons.filter}
                                    size={14}
                                    color="#8892b0"
                                />{" "}
                                Filters
                            </button>

                            <button
                                style={{
                                    padding: "8px 18px",
                                    borderRadius: 8,
                                    border: "none",
                                    background: "#7c3aed",
                                    color: "#fff",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 7,
                                    fontFamily: "inherit",
                                }}
                            >
                                <Icon
                                    d={Icons.plus}
                                    size={14}
                                    color="#fff"
                                    strokeWidth={2.2}
                                />{" "}
                                New Agent
                            </button>
                        </div>
                    </div>

                    {/* ── STAT CARDS ── */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4,1fr)",
                            gap: 14,
                            marginBottom: 22,
                        }}
                    >
                        <StatCard
                            label="Total Agents"
                            value="12"
                            sub="+2 this week"
                            subColor="#8892b0"
                            iconKey="agents"
                            accent="#7c3aed"
                            accentRgb="124,58,237"
                        />
                        <StatCard
                            label="Active Calls"
                            value="48"
                            sub="Live now"
                            subColor="#34d399"
                            iconKey="phone"
                            accent="#3b82f6"
                            accentRgb="59,130,246"
                            live
                        />
                        <StatCard
                            label="Success Rate"
                            value="94.2%"
                            sub="avg"
                            subColor="#8892b0"
                            iconKey="check"
                            accent="#10b981"
                            accentRgb="16,185,129"
                        />
                        <StatCard
                            label="Total Minutes"
                            value="1,402"
                            sub=""
                            subColor="#8892b0"
                            iconKey="clock"
                            accent="#f59e0b"
                            accentRgb="245,158,11"
                        />
                    </div>

                    {/* ── AGENT TABLE ── */}
                    <div
                        style={{
                            background: "#181a2a",
                            border: "1px solid #1e2235",
                            borderRadius: 12,
                            overflow: "hidden",
                        }}
                    >
                        {/* Table Header */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "2.6fr 0.9fr 1fr 0.9fr 1.1fr 1.5fr 36px",
                                padding: "12px 22px",
                                borderBottom: "1px solid #1e2235",
                                color: "#3a3f5c",
                                fontSize: 11,
                                fontWeight: 600,
                                letterSpacing: 0.8,
                                textTransform: "uppercase",
                                background: "#181a2a",
                            }}
                        >
                            {[
                                "Agent Name",
                                "Version",
                                "Mode",
                                "Type",
                                "Status",
                                "Last Edited",
                                "",
                            ].map((h) => (
                                <div key={h}>{h}</div>
                            ))}
                        </div>

                        {/* Rows */}
                        {agents.map((agent, i) => {
                            const sc = statusConfig[agent.status];
                            const isHov = hoveredRow === i;

                            return (
                                <div
                                    key={agent.id}
                                    onMouseEnter={() => setHoveredRow(i)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "2.6fr 0.9fr 1fr 0.9fr 1.1fr 1.5fr 36px",
                                        padding: "18px 22px",
                                        borderBottom:
                                            i < agents.length - 1
                                                ? "1px solid #1e2235"
                                                : "none",
                                        alignItems: "center",
                                        background: isHov
                                            ? "#1d1f30"
                                            : "transparent",
                                        transition: "background 0.15s",
                                        cursor: "pointer",
                                    }}
                                >
                                    {/* Agent Name */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 9,
                                                background: agent.iconBg,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Icon
                                                d={Icons[agent.iconKey]}
                                                size={16}
                                                color={agent.iconColor}
                                                strokeWidth={1.7}
                                            />
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    color: "#cdd5f0",
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {agent.name}
                                            </div>
                                            <div
                                                style={{
                                                    color: "#3a3f5c",
                                                    fontSize: 11,
                                                    marginTop: 2,
                                                    fontFamily:
                                                        "'SF Mono','Fira Code',monospace",
                                                }}
                                            >
                                                ID: {agent.id}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Version */}
                                    <div>
                                        <span
                                            style={{
                                                background: "#1c1e2e",
                                                color: "#8892b0",
                                                padding: "3px 9px",
                                                borderRadius: 5,
                                                fontSize: 11,
                                                fontWeight: 600,
                                                border: "1px solid #2a2d45",
                                                letterSpacing: 0.3,
                                            }}
                                        >
                                            {agent.version}
                                        </span>
                                    </div>

                                    {/* Mode */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 6,
                                            color: "#8892b0",
                                            fontSize: 13,
                                        }}
                                    >
                                        <Icon
                                            d={
                                                agent.mode === "Flow"
                                                    ? Icons.flow
                                                    : Icons.prompt
                                            }
                                            size={14}
                                            color="#3a3f5c"
                                        />
                                        {agent.mode}
                                    </div>

                                    {/* Type */}
                                    <div
                                        style={{
                                            color: "#8892b0",
                                            fontSize: 13,
                                        }}
                                    >
                                        {agent.type}
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <span
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 6,
                                                color: sc.color,
                                                fontSize: 13,
                                                fontWeight: 500,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 7,
                                                    height: 7,
                                                    borderRadius: "50%",
                                                    background: sc.dot,
                                                    display: "inline-block",
                                                    flexShrink: 0,
                                                    boxShadow:
                                                        agent.status ===
                                                        "Active"
                                                            ? `0 0 6px ${sc.dot}`
                                                            : "none",
                                                }}
                                            />
                                            {agent.status}
                                        </span>
                                    </div>

                                    {/* Last Edited */}
                                    <div
                                        style={{
                                            color: "#4a5070",
                                            fontSize: 12,
                                        }}
                                    >
                                        {agent.edited}
                                    </div>

                                    {/* More */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <Icon
                                            d={Icons.more}
                                            size={16}
                                            color="#3a3f5c"
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        {/* Pagination */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "14px 22px",
                                borderTop: "1px solid #1e2235",
                                color: "#3a3f5c",
                                fontSize: 12,
                                background: "#181a2a",
                            }}
                        >
                            <span>Showing 1 to 4 of 12 agents</span>
                            <div style={{ display: "flex", gap: 5 }}>
                                <PageBtn
                                    onClick={() =>
                                        setActivePage((p) => Math.max(1, p - 1))
                                    }
                                >
                                    <Icon
                                        d={Icons.chevLeft}
                                        size={13}
                                        color="#4a5070"
                                    />
                                </PageBtn>
                                {[1, 2, 3].map((n) => (
                                    <PageBtn
                                        key={n}
                                        active={activePage === n}
                                        onClick={() => setActivePage(n)}
                                    >
                                        {n}
                                    </PageBtn>
                                ))}
                                <PageBtn
                                    onClick={() =>
                                        setActivePage((p) => Math.min(3, p + 1))
                                    }
                                >
                                    <Icon
                                        d={Icons.chevRight}
                                        size={13}
                                        color="#4a5070"
                                    />
                                </PageBtn>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
    label,
    value,
    sub,
    subColor,
    iconKey,
    accent,
    accentRgb,
    live,
}) {
    return (
        <div
            style={{
                background: "#181a2a",
                border: "1px solid #1e2235",
                borderRadius: 12,
                padding: "18px 20px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 14,
                }}
            >
                <span
                    style={{
                        color: "#4a5070",
                        fontSize: 12,
                        fontWeight: 500,
                        letterSpacing: 0.2,
                    }}
                >
                    {label}
                </span>
                <div
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: `rgba(${accentRgb},0.12)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon
                        d={Icons[iconKey]}
                        size={15}
                        color={accent}
                        strokeWidth={1.8}
                    />
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                    style={{
                        color: "#e8eaf6",
                        fontSize: 28,
                        fontWeight: 700,
                        letterSpacing: -0.5,
                        lineHeight: 1,
                    }}
                >
                    {value}
                </span>
                {sub && (
                    <span
                        style={{
                            fontSize: 12,
                            color: subColor || "#4a5070",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        {live && (
                            <span
                                style={{
                                    display: "inline-block",
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: "#34d399",
                                    boxShadow: "0 0 5px #34d399",
                                }}
                            />
                        )}
                        {sub}
                    </span>
                )}
            </div>
        </div>
    );
}

function PageBtn({ children, active, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                minWidth: 32,
                height: 32,
                borderRadius: 6,
                border: "1px solid",
                borderColor: active ? "#7c3aed" : "#2a2d45",
                background: active ? "#7c3aed" : "#1c1e2e",
                color: active ? "#fff" : "#4a5070",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: active ? 600 : 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
                fontFamily: "inherit",
            }}
        >
            {children}
        </button>
    );
}

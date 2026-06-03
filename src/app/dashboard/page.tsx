"use client";

import { useState, useRef, useEffect } from "react";

// ── Icons (Used by the Dashboard UI) ──────────────
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
    x: "M18 6 6 18M6 6l12 12",
    chat: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
    inbound: [
        "M16 2v4",
        "" + "M8 2v4",
        "M3 10h18",
        "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
    ],
    outbound: [
        "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07",
        "M1.52 3.6 A2 2 0 0 1 3.49 1.44h3",
        "M5 10l4 4-4 4",
        "M9 14H3",
    ],
    widget: [
        "M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5z",
        "M14 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5z",
        "M4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4z",
        "M14 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4z",
    ],
    node: [
        "M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
        "M5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
        "M19 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
        "M12 5v10M12 15l-7 3M12 15l7 3",
    ],
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
    Active: { color: "#34d399", dot: "#34d399" },
    Draft: { color: "#94a3b8", dot: "#94a3b8" },
    Paused: { color: "#fb923c", dot: "#fb923c" },
};

// ── Agent Type Modal ─────────────────────────────────────────────────────────
function AgentTypeModal({ onClose, onNext }) {
    const [selected, setSelected] = useState("inbound");

    const options = [
        {
            id: "inbound",
            label: "Inbound",
            desc: "For incoming calls",
            iconKey: "phone",
            iconBg: "#1e3a5f",
            iconColor: "#60a5fa",
        },
        {
            id: "outbound",
            label: "Outbound",
            desc: "For outgoing calls",
            iconKey: "mic",
            iconBg: "#2d1f4e",
            iconColor: "#a78bfa",
        },
        {
            id: "widget",
            label: "Voice Widget",
            desc: "Embeddable widget",
            iconKey: "widget",
            iconBg: "#1a3a2e",
            iconColor: "#34d399",
        },
    ];

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
            }}
        >
            <div
                style={{
                    background: "#1a1c2e",
                    border: "1px solid #2a2d45",
                    borderRadius: 16,
                    padding: "32px 28px",
                    width: 520,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 24,
                    }}
                >
                    <h2
                        style={{
                            color: "#e8eaf6",
                            fontSize: 18,
                            fontWeight: 700,
                            margin: 0,
                        }}
                    >
                        Choose the type of agent
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: 4,
                            display: "flex",
                        }}
                    >
                        <Icon d={Icons.x} size={18} color="#4a5070" />
                    </button>
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 12,
                        marginBottom: 28,
                    }}
                >
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            onClick={() => setSelected(opt.id)}
                            style={{
                                border: `2px solid ${selected === opt.id ? "#7c3aed" : "#2a2d45"}`,
                                borderRadius: 12,
                                padding: "20px 14px",
                                cursor: "pointer",
                                background:
                                    selected === opt.id
                                        ? "rgba(124,58,237,0.08)"
                                        : "#13141f",
                                transition: "all 0.15s",
                                position: "relative",
                            }}
                        >
                            {selected === opt.id && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 10,
                                        right: 10,
                                        width: 18,
                                        height: 18,
                                        borderRadius: "50%",
                                        background: "#7c3aed",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 7,
                                            height: 7,
                                            borderRadius: "50%",
                                            background: "#fff",
                                        }}
                                    />
                                </div>
                            )}
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    background: opt.iconBg,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 12,
                                }}
                            >
                                <Icon
                                    d={Icons[opt.iconKey]}
                                    size={18}
                                    color={opt.iconColor}
                                    strokeWidth={1.7}
                                />
                            </div>
                            <div
                                style={{
                                    color: "#cdd5f0",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    marginBottom: 4,
                                }}
                            >
                                {opt.label}
                            </div>
                            <div style={{ color: "#4a5070", fontSize: 11 }}>
                                {opt.desc}
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            padding: "9px 20px",
                            borderRadius: 8,
                            border: "1px solid #2a2d45",
                            background: "transparent",
                            color: "#8892b0",
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            fontWeight: 500,
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onNext(selected)}
                        style={{
                            padding: "9px 24px",
                            borderRadius: 8,
                            border: "none",
                            background: "#7c3aed",
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Editing Mode Modal ───────────────────────────────────────────────────────
function EditingModeModal({ agentType, onClose, onBack }) {
    const [selected, setSelected] = useState("prompt");

    const options = [
        {
            id: "prompt",
            label: "Prompt Builder",
            desc: "Write a single prompt to define your agent's behavior.",
            iconKey: "prompt",
            iconBg: "#2d1f4e",
            iconColor: "#a78bfa",
        },
        {
            id: "flow",
            label: "Flow Designer",
            desc: "Design structured dialogue paths with nodes and conditions.",
            iconKey: "node",
            iconBg: "#1e3a5f",
            iconColor: "#60a5fa",
        },
    ];

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
            }}
        >
            <div
                style={{
                    background: "#1a1c2e",
                    border: "1px solid #2a2d45",
                    borderRadius: 16,
                    padding: "32px 28px",
                    width: 460,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 24,
                    }}
                >
                    <h2
                        style={{
                            color: "#e8eaf6",
                            fontSize: 18,
                            fontWeight: 700,
                            margin: 0,
                        }}
                    >
                        Select Editing Mode
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: 4,
                            display: "flex",
                        }}
                    >
                        <Icon d={Icons.x} size={18} color="#4a5070" />
                    </button>
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        marginBottom: 28,
                    }}
                >
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            onClick={() => setSelected(opt.id)}
                            style={{
                                border: `2px solid ${selected === opt.id ? "#7c3aed" : "#2a2d45"}`,
                                borderRadius: 12,
                                padding: "20px 16px",
                                cursor: "pointer",
                                background:
                                    selected === opt.id
                                        ? "rgba(124,58,237,0.08)"
                                        : "#13141f",
                                transition: "all 0.15s",
                                position: "relative",
                            }}
                        >
                            {selected === opt.id && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 10,
                                        right: 10,
                                        width: 18,
                                        height: 18,
                                        borderRadius: "50%",
                                        background: "#7c3aed",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 7,
                                            height: 7,
                                            borderRadius: "50%",
                                            background: "#fff",
                                        }}
                                    />
                                </div>
                            )}
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    background: opt.iconBg,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 12,
                                }}
                            >
                                <Icon
                                    d={Icons[opt.iconKey]}
                                    size={18}
                                    color={opt.iconColor}
                                    strokeWidth={1.7}
                                />
                            </div>
                            <div
                                style={{
                                    color: "#cdd5f0",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    marginBottom: 6,
                                }}
                            >
                                {opt.label}
                            </div>
                            <div
                                style={{
                                    color: "#4a5070",
                                    fontSize: 11,
                                    lineHeight: 1.5,
                                }}
                            >
                                {opt.desc}
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            padding: "9px 20px",
                            borderRadius: 8,
                            border: "1px solid #2a2d45",
                            background: "transparent",
                            color: "#8892b0",
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            fontWeight: 500,
                        }}
                    >
                        Cancel
                    </button>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            onClick={onBack}
                            style={{
                                padding: "9px 20px",
                                borderRadius: 8,
                                border: "1px solid #2a2d45",
                                background: "transparent",
                                color: "#8892b0",
                                fontSize: 13,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                fontWeight: 500,
                            }}
                        >
                            Back
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                padding: "9px 24px",
                                borderRadius: 8,
                                border: "none",
                                background: "#7c3aed",
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            Create Agent
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── New Agent Dropdown ───────────────────────────────────────────────────────
function NewAgentButton({ onSelectType }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const items = [
        {
            id: "voice",
            label: "Voice Agent",
            desc: "For phone calls and voice interactions.",
            iconKey: "mic",
            iconBg: "#2d1f4e",
            iconColor: "#a78bfa",
        },
        {
            id: "chat",
            label: "Chat Agent",
            desc: "For messaging and live chats.",
            iconKey: "chat",
            iconBg: "#1e3a5f",
            iconColor: "#60a5fa",
        },
    ];

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={() => setOpen((v) => !v)}
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
                <Icon d={Icons.plus} size={14} color="#fff" strokeWidth={2.2} />{" "}
                New Agent
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        background: "#1a1c2e",
                        border: "1px solid #2a2d45",
                        borderRadius: 12,
                        padding: "6px",
                        minWidth: 260,
                        zIndex: 50,
                        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                    }}
                >
                    {items.map((item, i) => (
                        <div key={item.id}>
                            <div
                                onClick={() => {
                                    setOpen(false);
                                    onSelectType(item.id);
                                }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "10px 12px",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    transition: "background 0.12s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                        "#25243e")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        "transparent")
                                }
                            >
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 9,
                                        background: item.iconBg,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <Icon
                                        d={Icons[item.iconKey]}
                                        size={16}
                                        color={item.iconColor}
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
                                        {item.label}
                                    </div>
                                    <div
                                        style={{
                                            color: "#4a5070",
                                            fontSize: 11,
                                            marginTop: 2,
                                        }}
                                    >
                                        {item.desc}
                                    </div>
                                </div>
                            </div>
                            {i < items.length - 1 && (
                                <div
                                    style={{
                                        height: 1,
                                        background: "#1e2235",
                                        margin: "2px 0",
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Dashboard() {
    const [activePage, setActivePage] = useState(1);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [modal, setModal] = useState(null); // null | "agentType" | "editingMode"
    const [agentType, setAgentType] = useState(null);

    const handleAgentTypeSelected = (type) => {
        if (type === "voice") {
            setModal("agentType");
        }
        // chat agent could open a different flow
    };

    const handleAgentTypeNext = (selected) => {
        setAgentType(selected);
        setModal("editingMode");
    };

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
            <main
                style={{
                    flex: 1,
                    overflowY: "auto",
                    background: "#13141f",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* TOPBAR */}
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

                {/* BODY */}
                <div style={{ padding: "28px 28px", flex: 1 }}>
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
                            <NewAgentButton
                                onSelectType={handleAgentTypeSelected}
                            />
                        </div>
                    </div>

                    {/* STAT CARDS */}
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

                    {/* AGENT TABLE */}
                    <div
                        style={{
                            background: "#181a2a",
                            border: "1px solid #1e2235",
                            borderRadius: 12,
                            overflow: "hidden",
                        }}
                    >
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
                                    <div
                                        style={{
                                            color: "#8892b0",
                                            fontSize: 13,
                                        }}
                                    >
                                        {agent.type}
                                    </div>
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
                                    <div
                                        style={{
                                            color: "#4a5070",
                                            fontSize: 12,
                                        }}
                                    >
                                        {agent.edited}
                                    </div>
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

            {/* MODALS */}
            {modal === "agentType" && (
                <AgentTypeModal
                    onClose={() => setModal(null)}
                    onNext={handleAgentTypeNext}
                />
            )}
            {modal === "editingMode" && (
                <EditingModeModal
                    agentType={agentType}
                    onClose={() => setModal(null)}
                    onBack={() => setModal("agentType")}
                />
            )}
        </div>
    );
}

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

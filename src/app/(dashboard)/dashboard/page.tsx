"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import {
    Bot,
    Mic,
    Clock,
    Globe,
    Phone,
    PhoneIncoming,
    PhoneOutgoing,
    LayoutGrid,
    GitBranch,
    FileText,
    Workflow,
    MessageSquare,
    Search,
    Bell,
    Plus,
    Filter,
    CircleCheckBig,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    X,
    type LucideIcon,
} from "lucide-react";

type AgentMode = "Flow" | "Prompt";
type AgentDirection = "Inbound" | "Outbound";
type AgentStatus = "Active" | "Draft" | "Paused";

type Agent = {
    id: string;
    name: string;
    version: string;
    mode: AgentMode;
    type: AgentDirection;
    status: AgentStatus;
    edited: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
};

const agents: Agent[] = [
    {
        id: "AG-8842-X",
        name: "Customer Support Pro",
        version: "V2.4",
        mode: "Flow",
        type: "Inbound",
        status: "Active",
        edited: "Oct 24, 2023 · 14:20",
        icon: Phone,
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
        icon: Mic,
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
        icon: Clock,
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
        icon: Globe,
        iconBg: "#3a2a10",
        iconColor: "#fbbf24",
    },
];

const statusConfig: Record<AgentStatus, string> = {
    Active: "#34d399",
    Draft: "#94a3b8",
    Paused: "#fb923c",
};

// ── Shared primitives ───────────────────────────────────────────────────────

function IconBadge({
    icon: Icon,
    bg,
    color,
    size = 36,
}: {
    icon: LucideIcon;
    bg: string;
    color: string;
    size?: number;
}) {
    return (
        <div
            className="flex shrink-0 items-center justify-center rounded-[10px]"
            style={{ width: size, height: size, background: bg }}
        >
            <Icon size={size * 0.45} color={color} strokeWidth={1.8} />
        </div>
    );
}

function GhostButton({
    children,
    onClick,
    className = "",
}: {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white ${className}`}
        >
            {children}
        </button>
    );
}

function PrimaryButton({
    children,
    onClick,
    className = "",
}: {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-violet-500 ${className}`}
        >
            {children}
        </button>
    );
}

// ── Choice card (used by both modals) ───────────────────────────────────────

function ChoiceCard({
    icon: Icon,
    iconBg,
    iconColor,
    label,
    desc,
    selected,
    onClick,
}: {
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    label: string;
    desc: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative rounded-xl border-2 p-4 text-left transition-colors ${
                selected
                    ? "border-violet-500 bg-violet-500/[0.08]"
                    : "border-white/[0.06] bg-[#13141f] hover:border-white/15"
            }`}
        >
            {selected && (
                <span className="absolute right-2.5 top-2.5 flex size-[18px] items-center justify-center rounded-full bg-violet-500">
                    <span className="size-[7px] rounded-full bg-white" />
                </span>
            )}
            <IconBadge icon={Icon} bg={iconBg} color={iconColor} size={40} />
            <div className="mt-3 text-[13px] font-semibold text-slate-200">
                {label}
            </div>
            <div className="mt-1 text-[11px] leading-relaxed text-slate-500">
                {desc}
            </div>
        </button>
    );
}

function ModalShell({
    title,
    onClose,
    width,
    children,
    footer,
}: {
    title: string;
    onClose: () => void;
    width: number;
    children: ReactNode;
    footer: ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div
                className="rounded-2xl border border-white/10 bg-[#15161f] p-7 shadow-2xl shadow-black/50"
                style={{ width }}
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-100">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex rounded-md p-1 text-slate-500 transition-colors hover:text-slate-300"
                    >
                        <X size={18} />
                    </button>
                </div>
                {children}
                <div className="mt-7 flex items-center justify-between">
                    {footer}
                </div>
            </div>
        </div>
    );
}

// ── Agent Type Modal ─────────────────────────────────────────────────────────

function AgentTypeModal({
    onClose,
    onNext,
}: {
    onClose: () => void;
    onNext: (selected: string) => void;
}) {
    const [selected, setSelected] = useState("inbound");

    const options = [
        { id: "inbound", label: "Inbound", desc: "For incoming calls", icon: PhoneIncoming, iconBg: "#1e3a5f", iconColor: "#60a5fa" },
        { id: "outbound", label: "Outbound", desc: "For outgoing calls", icon: PhoneOutgoing, iconBg: "#2d1f4e", iconColor: "#a78bfa" },
        { id: "widget", label: "Voice Widget", desc: "Embeddable widget", icon: LayoutGrid, iconBg: "#1a3a2e", iconColor: "#34d399" },
    ];

    return (
        <ModalShell
            title="Choose the type of agent"
            onClose={onClose}
            width={520}
            footer={
                <>
                    <GhostButton onClick={onClose}>Cancel</GhostButton>
                    <PrimaryButton onClick={() => onNext(selected)}>Next</PrimaryButton>
                </>
            }
        >
            <div className="grid grid-cols-3 gap-3">
                {options.map((opt) => (
                    <ChoiceCard
                        key={opt.id}
                        icon={opt.icon}
                        iconBg={opt.iconBg}
                        iconColor={opt.iconColor}
                        label={opt.label}
                        desc={opt.desc}
                        selected={selected === opt.id}
                        onClick={() => setSelected(opt.id)}
                    />
                ))}
            </div>
        </ModalShell>
    );
}

// ── Editing Mode Modal ───────────────────────────────────────────────────────

function EditingModeModal({
    onClose,
    onBack,
    onCreate,
}: {
    onClose: () => void;
    onBack: () => void;
    onCreate: () => void;
}) {
    const [selected, setSelected] = useState("prompt");

    const options = [
        { id: "prompt", label: "Prompt Builder", desc: "Write a single prompt to define your agent's behavior.", icon: FileText, iconBg: "#2d1f4e", iconColor: "#a78bfa" },
        { id: "flow", label: "Flow Designer", desc: "Design structured dialogue paths with nodes and conditions.", icon: GitBranch, iconBg: "#1e3a5f", iconColor: "#60a5fa" },
    ];

    return (
        <ModalShell
            title="Select Editing Mode"
            onClose={onClose}
            width={460}
            footer={
                <>
                    <GhostButton onClick={onClose}>Cancel</GhostButton>
                    <div className="flex gap-2.5">
                        <GhostButton onClick={onBack}>Back</GhostButton>
                        <PrimaryButton onClick={onCreate}>Create Agent</PrimaryButton>
                    </div>
                </>
            }
        >
            <div className="grid grid-cols-2 gap-3">
                {options.map((opt) => (
                    <ChoiceCard
                        key={opt.id}
                        icon={opt.icon}
                        iconBg={opt.iconBg}
                        iconColor={opt.iconColor}
                        label={opt.label}
                        desc={opt.desc}
                        selected={selected === opt.id}
                        onClick={() => setSelected(opt.id)}
                    />
                ))}
            </div>
        </ModalShell>
    );
}

// ── New Agent Dropdown ───────────────────────────────────────────────────────

function NewAgentButton({ onSelectType }: { onSelectType: (id: string) => void }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const items = [
        { id: "voice", label: "Voice Agent", desc: "For phone calls and voice interactions.", icon: Mic, iconBg: "#2d1f4e", iconColor: "#a78bfa" },
        { id: "chat", label: "Chat Agent", desc: "For messaging and live chats.", icon: MessageSquare, iconBg: "#1e3a5f", iconColor: "#60a5fa" },
    ];

    return (
        <div ref={ref} className="relative">
            <PrimaryButton onClick={() => setOpen((v) => !v)}>
                <Plus size={14} strokeWidth={2.4} />
                New Agent
            </PrimaryButton>

            {open && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[260px] rounded-xl border border-white/10 bg-[#15161f] p-1.5 shadow-2xl shadow-black/50">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                onSelectType(item.id);
                            }}
                            className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-white/[0.05]"
                        >
                            <IconBadge icon={item.icon} bg={item.iconBg} color={item.iconColor} />
                            <div>
                                <div className="text-[13px] font-semibold text-slate-200">
                                    {item.label}
                                </div>
                                <div className="mt-0.5 text-[11px] text-slate-500">
                                    {item.desc}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
    label,
    value,
    sub,
    icon: Icon,
    accent,
    live = false,
}: {
    label: string;
    value: string;
    sub?: string;
    icon: LucideIcon;
    accent: string;
    live?: boolean;
}) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#13141f] p-5 transition-colors hover:border-white/10">
            <div className="mb-3.5 flex items-start justify-between">
                <span className="text-xs font-medium text-slate-500">{label}</span>
                <div
                    className="flex size-7 items-center justify-center rounded-lg"
                    style={{ background: `${accent}1f` }}
                >
                    <Icon size={15} color={accent} strokeWidth={1.8} />
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-[1.75rem] font-bold tracking-tight text-slate-100">
                    {value}
                </span>
                {sub && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        {live && (
                            <span className="inline-block size-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]" />
                        )}
                        {sub}
                    </span>
                )}
            </div>
        </div>
    );
}

function PageBtn({
    children,
    active = false,
    onClick,
}: {
    children: ReactNode;
    active?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-8 min-w-8 items-center justify-center rounded-md border text-xs font-medium transition-colors ${
                active
                    ? "border-violet-500 bg-violet-600 text-white"
                    : "border-white/10 bg-white/[0.03] text-slate-500 hover:text-slate-300"
            }`}
        >
            {children}
        </button>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const [activePage, setActivePage] = useState(1);
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);
    const [modal, setModal] = useState<"agentType" | "editingMode" | null>(null);

    const handleAgentTypeSelected = (type: string) => {
        if (type === "voice") setModal("agentType");
        // chat agent could open a different flow
    };

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#0d0e14]">
            {/* TOPBAR */}
            <div className="sticky top-0 z-20 flex items-center justify-end gap-3 border-b border-white/[0.06] px-7 py-3.5">
                <div className="flex w-[280px] items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 transition-colors focus-within:border-violet-500/50">
                    <Search size={14} className="text-slate-500" />
                    <input
                        placeholder="Search agents, nodes, or files…"
                        className="w-full bg-transparent text-[13px] text-slate-300 placeholder:text-slate-600 focus:outline-none"
                    />
                </div>
                <button
                    type="button"
                    className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-500 transition-colors hover:text-slate-300"
                >
                    <Bell size={16} />
                </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-7 py-7">
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-100">
                            My Agents
                        </h1>
                        <p className="mt-1 text-[13px] text-slate-500">
                            Orchestrate and monitor your voice AI fleet.
                        </p>
                    </div>
                    <div className="flex gap-2.5">
                        <GhostButton>
                            <Filter size={14} />
                            Filters
                        </GhostButton>
                        <NewAgentButton onSelectType={handleAgentTypeSelected} />
                    </div>
                </div>

                {/* STAT CARDS */}
                <div className="mb-5 grid grid-cols-4 gap-3.5">
                    <StatCard label="Total Agents" value="12" sub="+2 this week" icon={Bot} accent="#8b5cf6" />
                    <StatCard label="Active Calls" value="48" sub="Live now" icon={Phone} accent="#3b82f6" live />
                    <StatCard label="Success Rate" value="94.2%" sub="avg" icon={CircleCheckBig} accent="#10b981" />
                    <StatCard label="Total Minutes" value="1,402" icon={Clock} accent="#f59e0b" />
                </div>

                {/* AGENT TABLE */}
                <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#13141f]">
                    <div className="grid grid-cols-[2.6fr_0.9fr_1fr_0.9fr_1.1fr_1.5fr_36px] border-b border-white/[0.06] px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                        <div>Agent Name</div>
                        <div>Version</div>
                        <div>Mode</div>
                        <div>Type</div>
                        <div>Status</div>
                        <div>Last Edited</div>
                        <div />
                    </div>

                    {agents.map((agent, i) => {
                        const ModeIcon = agent.mode === "Flow" ? Workflow : FileText;
                        return (
                            <div
                                key={agent.id}
                                onMouseEnter={() => setHoveredRow(agent.id)}
                                onMouseLeave={() => setHoveredRow(null)}
                                className={`grid cursor-pointer grid-cols-[2.6fr_0.9fr_1fr_0.9fr_1.1fr_1.5fr_36px] items-center px-5 py-4 transition-colors ${
                                    i < agents.length - 1 ? "border-b border-white/[0.06]" : ""
                                } ${hoveredRow === agent.id ? "bg-white/[0.025]" : ""}`}
                            >
                                <div className="flex items-center gap-3">
                                    <IconBadge icon={agent.icon} bg={agent.iconBg} color={agent.iconColor} />
                                    <div>
                                        <div className="text-[13px] font-semibold text-slate-200">
                                            {agent.name}
                                        </div>
                                        <div className="mt-0.5 font-mono text-[11px] text-slate-600">
                                            ID: {agent.id}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-slate-400">
                                        {agent.version}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[13px] text-slate-400">
                                    <ModeIcon size={14} className="text-slate-600" />
                                    {agent.mode}
                                </div>
                                <div className="text-[13px] text-slate-400">{agent.type}</div>
                                <div>
                                    <span
                                        className="inline-flex items-center gap-1.5 text-[13px] font-medium"
                                        style={{ color: statusConfig[agent.status] }}
                                    >
                                        <span
                                            className="inline-block size-[7px] shrink-0 rounded-full"
                                            style={{
                                                background: statusConfig[agent.status],
                                                boxShadow:
                                                    agent.status === "Active"
                                                        ? `0 0 6px ${statusConfig[agent.status]}`
                                                        : "none",
                                            }}
                                        />
                                        {agent.status}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-500">{agent.edited}</div>
                                <div className="flex items-center justify-center text-slate-600 hover:text-slate-400">
                                    <MoreHorizontal size={16} />
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3.5 text-xs text-slate-600">
                        <span>Showing 1 to 4 of 12 agents</span>
                        <div className="flex gap-1.5">
                            <PageBtn onClick={() => setActivePage((p) => Math.max(1, p - 1))}>
                                <ChevronLeft size={13} />
                            </PageBtn>
                            {[1, 2, 3].map((n) => (
                                <PageBtn key={n} active={activePage === n} onClick={() => setActivePage(n)}>
                                    {n}
                                </PageBtn>
                            ))}
                            <PageBtn onClick={() => setActivePage((p) => Math.min(3, p + 1))}>
                                <ChevronRight size={13} />
                            </PageBtn>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {modal === "agentType" && (
                <AgentTypeModal
                    onClose={() => setModal(null)}
                    onNext={() => setModal("editingMode")}
                />
            )}
            {modal === "editingMode" && (
                <EditingModeModal
                    onClose={() => setModal(null)}
                    onBack={() => setModal("agentType")}
                    onCreate={() => setModal(null)}
                />
            )}
        </div>
    );
}

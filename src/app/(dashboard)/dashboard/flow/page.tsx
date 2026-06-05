"use client";

import { useState } from "react";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #0f1117;
    --bg2:         #141720;
    --bg3:         #1a1e2e;
    --border:      #252a3d;
    --border2:     #2e3450;
    --accent:      #7c4dff;
    --accent2:     #9b6eff;
    --accent-glow: rgba(124,77,255,0.25);
    --text:        #e2e6f3;
    --text2:       #8b91ad;
    --text3:       #5a607a;
    --cyan:        #22d3ee;
    --warn:        #f59e0b;
  }

  /* ── Root layout ─────────────────────────────── */
  .wf-root {
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: var(--bg);
    color: var(--text);
  }

  /* ── Topbar ──────────────────────────────────── */
  .wf-topbar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 16px;
    height: 52px;
    background: var(--bg2);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .wf-topbar-logo {
    display: flex; align-items: center; gap: 8px;
    font-size: 15px; font-weight: 700; color: var(--text);
    padding-right: 12px;
    border-right: 1px solid var(--border2);
    margin-right: 4px;
  }
  .wf-topbar-logo-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg, var(--accent), #5b3fd4);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 12px var(--accent-glow);
  }
  .wf-topbar-title {
    display: flex; align-items: center; gap: 6px;
    font-size: 14px; font-weight: 600; color: var(--text);
  }
  .wf-topbar-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; padding: 2px 7px;
    border-radius: 4px;
    background: rgba(124,77,255,0.15);
    color: var(--accent2);
    border: 1px solid rgba(124,77,255,0.25);
  }
  .wf-topbar-meta {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; color: var(--text3);
  }
  .wf-topbar-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--border2); }
  .wf-topbar-warn {
    display: flex; align-items: center; gap: 4px;
    color: var(--warn); font-size: 12px;
  }
  .wf-spacer { flex: 1; }
  .wf-topbar-saved {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; color: var(--text3);
    font-family: 'JetBrains Mono', monospace;
  }
  .wf-topbar-saved-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #4ade80; box-shadow: 0 0 6px #4ade80;
  }
  .wf-icon-btn {
    width: 32px; height: 32px;
    border-radius: 7px; border: 1px solid var(--border);
    background: transparent; color: var(--text2);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.12s;
  }
  .wf-icon-btn:hover { background: var(--bg3); color: var(--text); border-color: var(--border2); }
  .wf-btn-test {
    display: flex; align-items: center; gap: 6px;
    padding: 0 14px; height: 32px; border-radius: 7px; border: none;
    background: linear-gradient(135deg, var(--accent), #5b3fd4);
    color: white; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'Inter', sans-serif;
    box-shadow: 0 0 14px var(--accent-glow); transition: all 0.2s;
  }
  .wf-btn-test:hover { box-shadow: 0 0 22px rgba(124,77,255,0.5); transform: translateY(-1px); }
  .wf-btn-deploy {
    padding: 0 14px; height: 32px; border-radius: 7px;
    border: 1px solid var(--border2); background: var(--bg3);
    color: var(--text2); font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.12s;
  }
  .wf-btn-deploy:hover { color: var(--text); border-color: var(--border); }

  /* ── Body (canvas + sidebar) ─────────────────── */
  .wf-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* ── Canvas pane ─────────────────────────────── */
  .wf-canvas {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Subflow tab bar */
  .wf-tabs {
    display: flex; align-items: center;
    padding: 0 12px; height: 42px;
    background: var(--bg2);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    gap: 2px;
  }
  .wf-tab {
    display: flex; align-items: center; gap: 6px;
    padding: 0 14px; height: 42px;
    font-size: 13px; font-weight: 500; color: var(--text2);
    cursor: pointer; border-bottom: 2px solid transparent;
    transition: color 0.12s, border-color 0.12s;
    user-select: none; white-space: nowrap;
  }
  .wf-tab:hover { color: var(--text); }
  .wf-tab.active { color: var(--text); border-bottom-color: var(--accent); }
  .wf-tab-sep { width: 1px; height: 18px; background: var(--border); margin: 0 4px; }
  .wf-tab-add {
    width: 26px; height: 26px; border-radius: 6px;
    border: 1px solid var(--border2); background: transparent;
    color: var(--text3); cursor: pointer; font-size: 15px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.12s; margin-left: 2px;
  }
  .wf-tab-add:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }

  /* ReactFlow override — dark bg + dots */
  .wf-flow-wrap {
    flex: 1;
    overflow: hidden;
  }
  .wf-flow-wrap .react-flow {
    background-color: var(--bg) !important;
    background-image: radial-gradient(circle, #252a3d 1px, transparent 1px) !important;
    background-size: 24px 24px !important;
  }
  .wf-flow-wrap .react-flow__controls {
    background: var(--bg2) !important;
    border: 1px solid var(--border) !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 12px rgba(0,0,0,0.4) !important;
  }
  .wf-flow-wrap .react-flow__controls-button {
    background: transparent !important;
    border: none !important;
    border-bottom: 1px solid var(--border) !important;
    color: var(--text2) !important;
    fill: var(--text2) !important;
  }
  .wf-flow-wrap .react-flow__controls-button:hover {
    background: var(--bg3) !important;
    fill: var(--text) !important;
  }
  .wf-flow-wrap .react-flow__controls-button:last-child { border-bottom: none !important; }
  .wf-flow-wrap .react-flow__minimap {
    background: var(--bg2) !important;
    border: 1px solid var(--border) !important;
    border-radius: 8px !important;
  }
  .wf-flow-wrap .react-flow__minimap-mask { fill: rgba(15,17,23,0.7) !important; }

  /* ── Global Settings sidebar ─────────────────── */
  .gs-panel {
    width: 300px;
    height: 100%;
    background: var(--bg2);
    border-left: 1px solid var(--border);
    display: flex; flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;
  }
  .gs-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 20px 14px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .gs-title { font-size: 17px; font-weight: 600; color: var(--text); }
  .gs-history-btn {
    width: 30px; height: 30px; border-radius: 7px;
    border: 1px solid var(--border2); background: transparent;
    color: var(--text2); display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.12s;
  }
  .gs-history-btn:hover { background: var(--bg3); color: var(--text); }
  .gs-body { flex: 1; overflow-y: auto; }
  .gs-body::-webkit-scrollbar { width: 3px; }
  .gs-body::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
  .gs-space { display: flex; flex-direction: column; gap: 4px; padding: 8px; }
  .gs-row-inner { display: flex; align-items: center; gap: 12px; }
  .gs-row {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 10px 12px; border-radius: 8px;
    background: none; border: none; border-bottom: 1px solid var(--border);
    color: inherit; font: inherit; cursor: pointer; text-align: left;
    transition: background 0.12s;
  }
  .gs-row:hover { background: var(--bg3); }
  .gs-row.open { background: rgba(124,77,255,0.08); border-bottom-color: rgba(124,77,255,0.2); }
  .gs-row-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: var(--bg3); border: 1px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    color: var(--text2); flex-shrink: 0; transition: all 0.12s;
  }
  .gs-row:hover .gs-row-icon,
  .gs-row.open  .gs-row-icon {
    background: rgba(124,77,255,0.12); border-color: rgba(124,77,255,0.3); color: var(--accent2);
  }
  .gs-row-label { flex: 1; font-size: 14px; font-weight: 500; color: var(--text2); transition: color 0.12s; }
  .gs-row:hover .gs-row-label,
  .gs-row.open  .gs-row-label { color: var(--text); }
  .gs-chevron { font-size: 18px; color: var(--text3); line-height: 1; transition: transform 0.2s, color 0.15s; }
  .gs-row.open .gs-chevron { transform: rotate(90deg); color: var(--accent2); }
  .gs-sub {
    margin-top: 4px; padding: 6px 12px 10px;
    background: rgba(0,0,0,0.25); border-radius: 8px; margin-bottom: 4px;
  }
  .gs-sub-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 0; font-size: 12.5px; color: var(--text2);
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .gs-sub-row:last-child { border-bottom: none; }
  .gs-sub-val { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent2); }
  .gs-toggle {
    width: 30px; height: 17px; border-radius: 9px;
    background: var(--border2); position: relative;
    cursor: pointer; transition: background 0.2s;
    border: none; padding: 0; flex-shrink: 0;
  }
  .gs-toggle.on { background: var(--accent); box-shadow: 0 0 8px var(--accent-glow); }
  .gs-toggle-knob {
    width: 11px; height: 11px; border-radius: 50%; background: #fff;
    position: absolute; top: 3px; left: 3px; transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.4); pointer-events: none;
  }
  .gs-toggle.on .gs-toggle-knob { left: 16px; }
  .gs-footer {
    border-top: 1px solid var(--border); padding: 14px 16px;
    display: flex; flex-direction: column; gap: 10px;
    background: var(--bg2); flex-shrink: 0;
  }
  .gs-footer-meta { display: flex; align-items: center; justify-content: space-between; }
  .gs-saved { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text3); }
  .gs-v-badge {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    padding: 2px 8px; border-radius: 4px;
    border: 1px solid var(--border2); color: var(--text2);
  }
  .gs-btn-row { display: flex; gap: 8px; }
  .gs-btn-preview {
    flex: 1; height: 38px; border-radius: 8px;
    border: 1px solid var(--border2); background: var(--bg3);
    color: var(--text); font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s;
  }
  .gs-btn-preview:hover { border-color: var(--accent); color: var(--accent2); }
  .gs-btn-publish {
    flex: 1; height: 38px; border-radius: 8px; border: none;
    background: linear-gradient(135deg, var(--accent), #5b3fd4);
    color: white; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Inter', sans-serif;
    box-shadow: 0 0 16px var(--accent-glow); transition: all 0.2s;
  }
  .gs-btn-publish:hover { box-shadow: 0 0 24px rgba(124,77,255,0.45); transform: translateY(-1px); }
  .gs-btn-test {
    width: 100%; height: 42px; border-radius: 8px;
    border: 1px solid #22d3ee55;
    background: linear-gradient(90deg, #22d3ee22, #22d3ee11);
    color: var(--cyan); font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'Inter', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all 0.2s;
  }
  .gs-btn-test:hover { background: linear-gradient(90deg, #22d3ee33, #22d3ee18); box-shadow: 0 0 16px rgba(34,211,238,0.2); }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = ({
    d,
    size = 14,
    fill = "none",
    stroke = "currentColor",
    sw = 1.8,
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d={d} />
    </svg>
);
function SettingsIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}
function VoiceIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    );
}
function PhoneIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
}
function EndCallIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2C9.67 20.82 3.18 14.33 2.08 6.18A2 2 0 0 1 4.11 4h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 11.9M23 1 1 23" />
        </svg>
    );
}
function KnowledgeIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    );
}
function ShieldIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}
function SlidersIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
    );
}
function HistoryIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.67" />
        </svg>
    );
}
function PlayIcon() {
    return (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
        >
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
    );
}
function ClockIcon() {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SETTINGS = [
    { id: "general", label: "General", icon: <SettingsIcon /> },
    { id: "voice", label: "Voice", icon: <VoiceIcon /> },
    { id: "call", label: "Call Configuration", icon: <PhoneIcon /> },
    { id: "end", label: "End-Call Reasons", icon: <EndCallIcon /> },
    { id: "knowledge", label: "Knowledge & Memory", icon: <KnowledgeIcon /> },
    { id: "security", label: "Security & Compliance", icon: <ShieldIcon /> },
    { id: "additional", label: "Additional Settings", icon: <SlidersIcon /> },
];
const SUBS = {
    general: [
        { label: "Name", value: "My Inbound Assistant" },
        { label: "ID", value: "AG-8842-X" },
    ],
    voice: [
        { label: "TTS Enabled", toggle: true, on: true },
        { label: "Voice Model", value: "en_us_standard" },
    ],
    call: [
        { label: "Max Duration", value: "30m" },
        { label: "Recording", toggle: true, on: false },
    ],
    end: [{ label: "End Reason A", value: "Customer hangup" }],
    knowledge: [{ label: "Memory Enabled", toggle: true, on: true }],
    security: [{ label: "Require SSO", toggle: true, on: false }],
    additional: [{ label: "Beta Features", toggle: true, on: false }],
};
const TABS_INIT = [
    { id: "main", label: "Main Flow" },
    { id: "sub1", label: "Subflow 1" },
];
const INIT_NODES = [
    {
        id: "1",
        position: { x: 200, y: 80 },
        data: { label: "Main Flow" },
        type: "input",
        style: {
            background: "#1a1e2e",
            color: "#e2e6f3",
            border: "1px solid #2e3450",
            borderRadius: 999,
            fontWeight: 600,
            padding: "8px 20px",
        },
    },
    {
        id: "2",
        position: { x: 175, y: 200 },
        data: { label: "⚡ Before Conversation" },
        style: {
            background: "#1a1e2e",
            color: "#8b91ad",
            border: "1px solid #2e3450",
            borderRadius: 999,
            fontSize: 13,
        },
    },
    {
        id: "3",
        position: { x: 100, y: 320 },
        data: { label: "📞 Greeting Message\n\nNo instructions added..." },
        style: {
            background: "#1a1e2e",
            color: "#e2e6f3",
            border: "1.5px solid #7c4dff",
            borderRadius: 12,
            width: 260,
            whiteSpace: "pre-wrap",
            fontSize: 13,
        },
    },
];
const INIT_EDGES = [
    {
        id: "e1-2",
        source: "1",
        target: "2",
        style: { stroke: "#2e3450", strokeWidth: 2 },
        animated: false,
    },
    {
        id: "e2-3",
        source: "2",
        target: "3",
        style: { stroke: "#2e3450", strokeWidth: 2 },
        animated: false,
    },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function FlowPage() {
    const [tabs, setTabs] = useState(TABS_INIT);
    const [activeTab, setActiveTab] = useState("main");
    const [openSetting, setOpenSetting] = useState(null);
    const [toggles, setToggles] = useState({});

    const toggle = (key, def = false) =>
        setToggles((t) => ({ ...t, [key]: !(t[key] ?? def) }));

    const addTab = () => {
        const n = tabs.length + 1;
        const id = `sub${n}`;
        setTabs((t) => [...t, { id, label: `Subflow ${n}` }]);
        setActiveTab(id);
    };

    return (
        <>
            <style>{styles}</style>
            <div className="wf-root">
                {/* ══ TOPBAR ══ */}
                <header className="wf-topbar p-4">
                    {/* Title + meta */}
                    <div className="wf-topbar-title">
                        My Inbound Assistant
                        <Ic
                            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                            size={12}
                            stroke="#5a607a"
                        />
                    </div>
                    <span className="wf-topbar-badge">V2</span>
                    <div className="wf-topbar-meta">
                        <span>Inbound</span>
                        <span className="wf-topbar-dot" />
                        <span className="wf-topbar-warn">
                            <Ic
                                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"
                                size={12}
                                stroke="#f59e0b"
                            />
                            No Phone Number
                        </span>
                        <span className="wf-topbar-dot" />
                        <span
                            style={{
                                fontFamily: "'JetBrains Mono',monospace",
                                fontSize: 11,
                            }}
                        >
                            ID: ba21…5567
                        </span>
                    </div>

                    <div className="wf-spacer" />

                    {/* Right actions */}
                    <div className="wf-topbar-saved">
                        <div className="wf-topbar-saved-dot" />
                        Saved 23:35
                    </div>
                    <button className="wf-icon-btn">
                        <Ic
                            d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                            size={14}
                        />
                    </button>
                    <button className="wf-icon-btn">
                        <SettingsIcon />
                    </button>
                    <button className="wf-btn-test">
                        <PlayIcon /> Test
                    </button>
                    <button className="wf-btn-deploy">Deploy</button>
                </header>

                {/* ══ BODY ══ */}
                <div className="wf-body">
                    {/* ── Left: ReactFlow canvas ── */}
                    <div className="wf-canvas">
                        {/* Subflow tabs */}
                        <div className="wf-tabs">
                            {tabs.map((tab, i) => (
                                <div
                                    key={tab.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {i > 0 && <div className="wf-tab-sep" />}
                                    <div
                                        className={`wf-tab${activeTab === tab.id ? " active" : ""}`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect
                                                x="3"
                                                y="3"
                                                width="7"
                                                height="7"
                                            />
                                            <rect
                                                x="14"
                                                y="3"
                                                width="7"
                                                height="7"
                                            />
                                            <rect
                                                x="3"
                                                y="14"
                                                width="7"
                                                height="7"
                                            />
                                            <circle
                                                cx="17.5"
                                                cy="17.5"
                                                r="3.5"
                                            />
                                        </svg>
                                        {tab.label}
                                    </div>
                                </div>
                            ))}
                            <div className="wf-tab-sep" />
                            <button
                                className="wf-tab-add"
                                onClick={addTab}
                                title="Add subflow"
                            >
                                +
                            </button>
                        </div>

                        {/* ReactFlow */}
                        <div className="wf-flow-wrap">
                            <ReactFlow
                                defaultNodes={INIT_NODES}
                                defaultEdges={INIT_EDGES}
                                fitView
                                style={{ width: "100%", height: "100%" }}
                            >
                                <Background color="#252a3d" gap={24} size={1} />
                                <Controls />
                                <MiniMap
                                    nodeColor="#2e3450"
                                    maskColor="rgba(15,17,23,0.7)"
                                    style={{
                                        background: "#141720",
                                        border: "1px solid #252a3d",
                                    }}
                                />
                            </ReactFlow>
                        </div>
                    </div>

                    {/* ── Right: Global Settings sidebar ── */}
                    <aside className="gs-panel">
                        {/* Header */}
                        <div className="gs-head">
                            <span className="gs-title">Global Settings</span>
                            <button className="gs-history-btn">
                                <HistoryIcon />
                            </button>
                        </div>

                        {/* Scrollable rows — FlowPage pattern */}
                        <div className="gs-body">
                            <div className="gs-space">
                                {SETTINGS.map((s) => {
                                    const open = openSetting === s.id;
                                    return (
                                        <div key={s.id}>
                                            <button
                                                onClick={() =>
                                                    setOpenSetting(
                                                        open ? null : s.id,
                                                    )
                                                }
                                                className={`gs-row${open ? " open" : ""}`}
                                            >
                                                <div className="gs-row-inner">
                                                    <div className="gs-row-icon">
                                                        {s.icon}
                                                    </div>
                                                    <span className="gs-row-label">
                                                        {s.label}
                                                    </span>
                                                </div>
                                                <span className="gs-chevron">
                                                    ›
                                                </span>
                                            </button>

                                            {open && (
                                                <div className="gs-sub">
                                                    {SUBS[s.id].map(
                                                        (item, i) => {
                                                            const key = `${s.id}-${i}`;
                                                            const isOn =
                                                                toggles[key] ??
                                                                item.on;
                                                            return (
                                                                <div
                                                                    key={key}
                                                                    className="gs-sub-row"
                                                                >
                                                                    <span>
                                                                        {
                                                                            item.label
                                                                        }
                                                                    </span>
                                                                    {item.toggle ? (
                                                                        <button
                                                                            onClick={(
                                                                                e,
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                                toggle(
                                                                                    key,
                                                                                    item.on,
                                                                                );
                                                                            }}
                                                                            className={`gs-toggle${isOn ? " on" : ""}`}
                                                                        >
                                                                            <div className="gs-toggle-knob" />
                                                                        </button>
                                                                    ) : (
                                                                        <span className="gs-sub-val">
                                                                            {
                                                                                item.value
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="gs-footer">
                            <div className="gs-footer-meta">
                                <span className="gs-saved">
                                    <ClockIcon /> Saved 23:22
                                </span>
                                <span className="gs-v-badge">V2</span>
                            </div>
                            <div className="gs-btn-row">
                                <button className="gs-btn-preview">
                                    Preview
                                </button>
                                <button className="gs-btn-publish">
                                    Publish
                                </button>
                            </div>
                            <button className="gs-btn-test">
                                <PlayIcon /> Test Voice Agent
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}

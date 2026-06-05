"use client";

import React, {
    useState,
    useCallback,
    useMemo,
    createContext,
    useContext,
} from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    applyNodeChanges,
    applyEdgeChanges,
    Handle,
    Position,
    ReactFlowProvider,
    useReactFlow,
    BaseEdge,
    EdgeLabelRenderer,
    getStraightPath,
    EdgeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ─── Constants for Straight Line Layout ───────────────────────────────────────
const CENTER_X = 300;
const NODE_WIDTH = 260;
const Y_STEP = 160;
const START_Y = 80;

// Context to pass edge click events down to the custom edges
const FlowActionContext = createContext<any>(null);

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

  .wf-root { font-family: 'Inter', sans-serif; display: flex; flex-direction: column; width: 100%; height: 100vh; overflow: hidden; background: var(--bg); color: var(--text); }

  /* ── Topbar ──────────────────────────────────── */
  .wf-topbar { display: flex; align-items: center; gap: 12px; padding: 0 24px; height: 60px; background: var(--bg2); border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .wf-topbar-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: var(--text); }
  .wf-topbar-badge { font-family: 'JetBrains Mono', monospace; font-size: 10px; padding: 3px 8px; border-radius: 4px; background: rgba(124,77,255,0.15); color: var(--accent2); border: 1px solid rgba(124,77,255,0.25); }
  .wf-topbar-meta { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text3); }
  .wf-topbar-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--border2); }
  .wf-topbar-warn { display: flex; align-items: center; gap: 5px; color: var(--warn); font-size: 13px; }
  .wf-spacer { flex: 1; }
  .wf-topbar-saved { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text3); font-family: 'JetBrains Mono', monospace; }
  .wf-topbar-saved-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 6px #4ade80; }
  .wf-icon-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--text2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.12s; }
  .wf-icon-btn:hover { background: var(--bg3); color: var(--text); border-color: var(--border2); }
  .wf-btn-test { display: flex; align-items: center; gap: 8px; padding: 0 18px; height: 36px; border-radius: 8px; border: none; background: linear-gradient(135deg, var(--accent), #5b3fd4); color: white; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; box-shadow: 0 0 14px var(--accent-glow); transition: all 0.2s; }
  .wf-btn-test:hover { box-shadow: 0 0 22px rgba(124,77,255,0.5); transform: translateY(-1px); }
  .wf-btn-deploy { padding: 0 18px; height: 36px; border-radius: 8px; border: 1px solid var(--border2); background: var(--bg3); color: var(--text2); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.12s; }
  .wf-btn-deploy:hover { color: var(--text); border-color: var(--border); }

  .wf-body { display: flex; flex: 1; overflow: hidden; }
  .wf-canvas { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  /* ── Tabs ────────────────────────────────────── */
  .wf-tabs { display: flex; align-items: center; padding: 0 16px; height: 48px; background: var(--bg2); border-bottom: 1px solid var(--border); flex-shrink: 0; gap: 4px; }
  .wf-tab { display: flex; align-items: center; gap: 8px; padding: 0 16px; height: 48px; font-size: 13px; font-weight: 500; color: var(--text2); cursor: pointer; border-bottom: 2px solid transparent; transition: color 0.12s, border-color 0.12s; user-select: none; white-space: nowrap; }
  .wf-tab:hover { color: var(--text); }
  .wf-tab.active { color: var(--text); border-bottom-color: var(--accent); }
  .wf-tab-sep { width: 1px; height: 20px; background: var(--border); margin: 0 6px; }
  .wf-tab-add { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border2); background: transparent; color: var(--text3); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.12s; margin-left: 4px; }
  .wf-tab-add:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }

  /* ── React Flow ──────────────────────────────── */
  .wf-flow-wrap { flex: 1; overflow: hidden; }
  .wf-flow-wrap .react-flow { background-color: var(--bg) !important; background-image: radial-gradient(circle, #252a3d 1px, transparent 1px) !important; background-size: 24px 24px !important; }
  .wf-flow-wrap .react-flow__controls { background: var(--bg2) !important; border: 1px solid var(--border) !important; border-radius: 8px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.4) !important; }
  .wf-flow-wrap .react-flow__controls-button { background: transparent !important; border: none !important; border-bottom: 1px solid var(--border) !important; color: var(--text2) !important; fill: var(--text2) !important; }
  .wf-flow-wrap .react-flow__controls-button:hover { background: var(--bg3) !important; fill: var(--text) !important; }
  .wf-flow-wrap .react-flow__controls-button:last-child { border-bottom: none !important; }
  .wf-flow-wrap .react-flow__minimap { background: var(--bg2) !important; border: 1px solid var(--border) !important; border-radius: 8px !important; }
  .wf-flow-wrap .react-flow__minimap-mask { fill: rgba(15,17,23,0.7) !important; }

  /* ── Custom Node styling ──── */
  .wf-node { position: relative; transition: box-shadow 0.2s; }
  .wf-node.selected { box-shadow: 0 0 0 2px var(--accent) !important; }

  /* ACTION BUTTON FIX: Added padding-bottom to create an invisible hover bridge */
  .wf-node-actions { position: absolute; top: -42px; right: 0; display: flex; gap: 6px; opacity: 0; pointer-events: none; transition: all 0.2s; transform: translateY(4px); padding-bottom: 12px; z-index: 100; }
  .wf-node:hover .wf-node-actions { opacity: 1; pointer-events: all; transform: translateY(0); }

  .wf-node-action-btn { width: 30px; height: 30px; border-radius: 8px; background: var(--bg2); border: 1px solid var(--border2); color: var(--text2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
  .wf-node-action-btn:hover { background: var(--bg3); color: var(--text); border-color: var(--border); }
  .wf-node-action-btn.delete:hover { color: #ef4444; border-color: rgba(239,68,68,0.5); background: rgba(239,68,68,0.1); }

  /* Structured Card Node Styles */
  .wf-card-node { border-radius: 12px; border: 1.5px solid transparent; padding: 12px; text-align: left; background-color: var(--bg3); }
  .wf-card-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; margin-bottom: 10px; }

  /* Locked height with ellipsis */
  .wf-card-body {
      background: var(--bg);
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 13px;
      color: var(--text);
      height: 40px;
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  }
  .wf-card-body:empty::before { content: "No instructions added..."; color: var(--text3); font-style: italic; }

  /* ── Edge Button (Subtle Default, Bold Hover) ── */
  .wf-edge-add-btn {
      width: 26px; height: 26px; border-radius: 50%;
      background: var(--bg); /* Matches canvas */
      border: 1.5px solid transparent;
      color: var(--text3);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s; font-size: 18px; line-height: 1;
  }
  .wf-edge-add-btn:hover {
      background: var(--bg2); border-color: var(--accent); color: var(--accent); box-shadow: 0 0 10px var(--accent-glow);
  }

  /* ── Custom Add Button Node ──────────────────── */
  .wf-add-btn-node { width: 34px; height: 34px; border-radius: 50%; background: var(--bg3); border: 1.5px dashed var(--border2); color: var(--text2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
  .wf-add-btn-node:hover { background: rgba(124,77,255,0.15); border-color: var(--accent); color: var(--accent2); transform: scale(1.05); box-shadow: 0 0 12px var(--accent-glow); }

  /* ── Right Panel Base (Wider) ────────────────── */
  .wf-right-panel { width: 380px; height: 100%; background: var(--bg2); border-left: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0; }

  /* Global Settings */
  .gs-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .gs-title { font-size: 18px; font-weight: 600; color: var(--text); }
  .gs-history-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border2); background: transparent; color: var(--text2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.12s; }
  .gs-history-btn:hover { background: var(--bg3); color: var(--text); }

  .gs-body { flex: 1; overflow-y: auto; padding: 16px; }
  .gs-body::-webkit-scrollbar { width: 4px; }
  .gs-body::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .gs-space { display: flex; flex-direction: column; gap: 8px; }
  .gs-row-inner { display: flex; align-items: center; gap: 14px; }
  .gs-row { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 12px 16px; border-radius: 8px; background: none; border: none; border-bottom: 1px solid var(--border); color: inherit; font: inherit; cursor: pointer; text-align: left; transition: background 0.12s; margin-bottom: 4px; }
  .gs-row:hover { background: var(--bg3); }
  .gs-row.open { background: rgba(124,77,255,0.08); border-bottom-color: rgba(124,77,255,0.2); }
  .gs-row-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--bg3); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; color: var(--text2); flex-shrink: 0; transition: all 0.12s; }
  .gs-row:hover .gs-row-icon, .gs-row.open  .gs-row-icon { background: rgba(124,77,255,0.12); border-color: rgba(124,77,255,0.3); color: var(--accent2); }
  .gs-row-label { flex: 1; font-size: 15px; font-weight: 500; color: var(--text2); transition: color 0.12s; }
  .gs-row:hover .gs-row-label, .gs-row.open  .gs-row-label { color: var(--text); }
  .gs-chevron { font-size: 18px; color: var(--text3); line-height: 1; transition: transform 0.2s, color 0.15s; }
  .gs-row.open .gs-chevron { transform: rotate(90deg); color: var(--accent2); }

  .gs-sub { padding: 12px 16px 16px; background: rgba(0,0,0,0.25); border-radius: 8px; margin-bottom: 12px; }
  .gs-sub-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; font-size: 13px; color: var(--text2); border-bottom: 1px solid rgba(255,255,255,0.04); }
  .gs-sub-row:last-child { border-bottom: none; }
  .gs-sub-val { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--accent2); }

  .gs-footer { border-top: 1px solid var(--border); padding: 24px; display: flex; flex-direction: column; gap: 16px; background: var(--bg2); flex-shrink: 0; }
  .gs-footer-meta { display: flex; align-items: center; justify-content: space-between; }
  .gs-saved { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text3); }
  .gs-v-badge { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 3px 10px; border-radius: 4px; border: 1px solid var(--border2); color: var(--text2); }
  .gs-btn-row { display: flex; gap: 12px; }
  .gs-btn-preview { flex: 1; height: 42px; border-radius: 8px; border: 1px solid var(--border2); background: var(--bg3); color: var(--text); font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
  .gs-btn-preview:hover { border-color: var(--accent); color: var(--accent2); }
  .gs-btn-publish { flex: 1; height: 42px; border-radius: 8px; border: none; background: linear-gradient(135deg, var(--accent), #5b3fd4); color: white; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Inter', sans-serif; box-shadow: 0 0 16px var(--accent-glow); transition: all 0.2s; }
  .gs-btn-publish:hover { box-shadow: 0 0 24px rgba(124,77,255,0.45); transform: translateY(-1px); }
  .gs-btn-test { width: 100%; height: 46px; border-radius: 8px; border: 1px solid #22d3ee55; background: linear-gradient(90deg, #22d3ee22, #22d3ee11); color: var(--cyan); font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
  .gs-btn-test:hover { background: linear-gradient(90deg, #22d3ee33, #22d3ee18); box-shadow: 0 0 16px rgba(34,211,238,0.2); }

  /* Node Settings Overlay Panel */
  .ns-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .ns-title { font-size: 18px; font-weight: 600; color: var(--text); }
  .ns-close-btn { background: transparent; border: none; color: var(--text3); cursor: pointer; transition: color 0.15s; display:flex; align-items:center; }
  .ns-close-btn:hover { color: var(--text); }

  .ns-body { padding: 24px; display: flex; flex-direction: column; gap: 24px; overflow-y: auto; flex: 1; }
  .ns-body::-webkit-scrollbar { width: 4px; }
  .ns-body::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .ns-field { display: flex; flex-direction: column; gap: 10px; }
  .ns-field label { font-size: 14px; font-weight: 500; color: var(--text); display: flex; align-items: center; gap: 8px; }
  .ns-field label i { font-style: normal; color: var(--text3); font-size: 11px; cursor: help; border: 1px solid var(--border2); border-radius: 50%; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; }
  .ns-input { background: var(--bg); border: 1px solid var(--border2); border-radius: 8px; padding: 12px 16px; color: var(--text); font-size: 14px; outline: none; font-family: inherit; transition: border-color 0.2s; }
  .ns-input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-glow); }
  .ns-textarea { background: var(--bg); border: 1px solid var(--border2); border-radius: 8px; padding: 12px 16px; color: var(--text); font-size: 14px; outline: none; font-family: inherit; min-height: 100px; resize: vertical; transition: border-color 0.2s; line-height: 1.5; }
  .ns-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-glow); }

  .ns-hint { font-size: 13px; color: var(--text3); display: flex; align-items: center; gap: 8px; margin-top: 2px; }
  .ns-hint span { background: var(--bg3); padding: 3px 8px; border-radius: 4px; border: 1px solid var(--border2); font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text2); }

  .ns-toggle-row { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
  .ns-toggle-row label { font-size: 14px; font-weight: 500; color: var(--text); display: flex; align-items: center; gap: 8px; }
  .ns-toggle-row label i { font-style: normal; color: var(--text3); font-size: 11px; cursor: help; border: 1px solid var(--border2); border-radius: 50%; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; }

  /* Universal Toggle Switch */
  .gs-toggle { width: 38px; height: 22px; border-radius: 11px; background: var(--border2); position: relative; cursor: pointer; transition: background 0.2s; border: none; padding: 0; flex-shrink: 0; }
  .gs-toggle.on { background: var(--accent); box-shadow: 0 0 8px var(--accent-glow); }
  .gs-toggle-knob { width: 16px; height: 16px; border-radius: 50%; background: #fff; position: absolute; top: 3px; left: 3px; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.4); pointer-events: none; }
  .gs-toggle.on .gs-toggle-knob { left: 19px; }

  /* ── Popover Dialog ──────────────────────────── */
  .wf-popover { position: fixed; z-index: 1000; width: 280px; background: var(--bg2); border: 1px solid var(--border2); border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; font-family: 'Inter', sans-serif; }
  .wf-popover-search { padding: 12px; border-bottom: 1px solid var(--border); }
  .wf-popover-search input { width: 100%; background: var(--bg); border: 1px solid var(--border2); border-radius: 8px; padding: 10px 14px; color: var(--text); font-size: 14px; outline: none; transition: border-color 0.2s; }
  .wf-popover-search input:focus { border-color: var(--accent); }
  .wf-popover-list { max-height: 340px; overflow-y: auto; padding: 8px; }
  .wf-popover-list::-webkit-scrollbar { width: 4px; }
  .wf-popover-list::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
  .wf-popover-item { display: flex; align-items: center; gap: 14px; padding: 12px; border-radius: 8px; cursor: pointer; transition: background 0.15s; }
  .wf-popover-item:hover { background: var(--bg3); }
  .wf-popover-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .wf-popover-text { display: flex; flex-direction: column; gap: 4px; }
  .wf-popover-title { font-size: 14px; font-weight: 500; color: var(--text); }
  .wf-popover-desc { font-size: 12px; color: var(--text3); line-height: 1.3; }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = ({
    d,
    size = 14,
    fill = "none",
    stroke = "currentColor",
    sw = 1.8,
}: any) => (
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
const SettingsIcon = () => (
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
const VoiceIcon = () => (
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
const PhoneIcon = () => (
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
const EndCallIcon = () => (
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
const KnowledgeIcon = () => (
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
const ShieldIcon = () => (
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
const SlidersIcon = () => (
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
const HistoryIcon = () => (
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
const PlayIcon = () => (
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
const ClockIcon = () => (
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

// Action Icons
const CopyIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);
const TrashIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);
const CloseIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

// Menu Icons
const ConversationIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);
const MessageIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);
const TriggerIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M12 22V8M5 15l7-7 7 7" />
    </svg>
);
const SplitIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M6 3v12a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M6 3l-3 3m3-3 3 3M18 3l-3 3m3-3 3 3" />
    </svg>
);
const JumpIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
    </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const NODE_TYPES_MENU = [
    {
        id: "conversation",
        label: "Conversation",
        desc: "Collect info and drive the dialog",
        icon: <ConversationIcon />,
        bg: "rgba(168, 85, 247, 0.15)",
        color: "#c084fc",
        emoji: "💬",
    },
    {
        id: "message",
        label: "Message",
        desc: "This is the message node",
        icon: <MessageIcon />,
        bg: "rgba(168, 85, 247, 0.15)",
        color: "#c084fc",
        emoji: "✉️",
    },
    {
        id: "trigger",
        label: "Trigger Subflow",
        desc: "Choose to which subflow the conversatio...",
        icon: <TriggerIcon />,
        bg: "rgba(34, 197, 94, 0.15)",
        color: "#4ade80",
        emoji: "⚡",
    },
    {
        id: "split",
        label: "Split the Path",
        desc: "Split the path based on conditions",
        icon: <SplitIcon />,
        bg: "rgba(168, 85, 247, 0.15)",
        color: "#c084fc",
        emoji: "🔀",
    },
    {
        id: "jump",
        label: "Jump",
        desc: "This is the jump node",
        icon: <JumpIcon />,
        bg: "rgba(56, 189, 248, 0.15)",
        color: "#38bdf8",
        emoji: "⤵️",
    },
];

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

// ─── Custom Elements ─────────────────────────────────────────────────────────────

// Custom Edge with inline Plus Button
function ButtonEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    style,
    markerEnd,
    target,
    source,
}: EdgeProps) {
    const { onEdgeAddClick } = useContext(FlowActionContext);
    const [edgePath, labelX, labelY] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    // Hide the edge plus button on the very last edge OR the edges coming from nodes 1 and 2
    const isHiddenEdge =
        target === "add-btn" || source === "1" || source === "2";

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                style={style}
                markerEnd={markerEnd}
            />
            {!isHiddenEdge && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: "absolute",
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: "all",
                            zIndex: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "26px",
                            height: "26px",
                        }}
                        className="nodrag nopan"
                    >
                        <button
                            className="wf-edge-add-btn"
                            onClick={(e) => onEdgeAddClick(e, id)}
                        >
                            +
                        </button>
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
}

// Node Component (handles both simple root nodes and complex card nodes)
function ActionNode({ id, data, selected }: any) {
    const { setNodes, setEdges, getNode, getEdges } = useReactFlow();

    const onCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        const nodeToCopy = getNode(id);
        if (!nodeToCopy) return;

        const newId = `node_${Date.now()}`;
        const newNode = {
            ...nodeToCopy,
            id: newId,
            position: {
                x: CENTER_X,
                y: nodeToCopy.position.y + Y_STEP,
            },
            origin: [0.5, 0] as [number, number],
            selected: false,
        };

        const outEdge = getEdges().find((edge) => edge.source === id);

        setEdges((eds) => {
            let next = eds.filter((edge) => edge.id !== outEdge?.id);
            next.push({
                id: `e${id}-${newId}`,
                source: id,
                target: newId,
                type: "buttonEdge",
                style: { stroke: "#2e3450", strokeWidth: 2 },
            });
            if (outEdge) {
                next.push({
                    id: `e${newId}-${outEdge.target}`,
                    source: newId,
                    target: outEdge.target,
                    type: "buttonEdge",
                    style: { stroke: "#2e3450", strokeWidth: 2 },
                });
            }
            return next;
        });

        setNodes((nds) => {
            const shifted = nds.map((n) => {
                if (n.position.y > nodeToCopy.position.y) {
                    return {
                        ...n,
                        position: { ...n.position, y: n.position.y + Y_STEP },
                    };
                }
                return n;
            });
            shifted.push(newNode);
            return shifted;
        });
    };

    const onDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Prevent deleting the very first required node
        if (id === "1") return;

        const nodeToDelete = getNode(id);
        if (!nodeToDelete) return;

        const inEdge = getEdges().find((edge) => edge.target === id);
        const outEdge = getEdges().find((edge) => edge.source === id);

        setEdges((eds) => {
            let next = eds.filter(
                (edge) => edge.source !== id && edge.target !== id,
            );
            if (inEdge && outEdge) {
                next.push({
                    id: `e${inEdge.source}-${outEdge.target}`,
                    source: inEdge.source,
                    target: outEdge.target,
                    type: "buttonEdge",
                    style: { stroke: "#2e3450", strokeWidth: 2 },
                });
            }
            return next;
        });

        setNodes((nds) => {
            const filtered = nds.filter((n) => n.id !== id);
            return filtered.map((n) => {
                if (n.position.y > nodeToDelete.position.y) {
                    return {
                        ...n,
                        position: { ...n.position, y: n.position.y - Y_STEP },
                    };
                }
                return n;
            });
        });
    };

    const actionButtons = (
        <div className="wf-node-actions">
            <button
                className="wf-node-action-btn"
                onClick={onCopy}
                title="Duplicate Node"
            >
                <CopyIcon />
            </button>
            {id !== "1" && (
                <button
                    className="wf-node-action-btn delete"
                    onClick={onDelete}
                    title="Delete Node"
                >
                    <TrashIcon />
                </button>
            )}
        </div>
    );

    // Render simple root node style
    if (data.isRoot) {
        return (
            <div
                className={`wf-node ${selected ? "selected" : ""}`}
                style={data.style}
            >
                <Handle
                    type="target"
                    position={Position.Top}
                    style={{ opacity: 0 }}
                />
                {actionButtons}
                {data.emoji} {data.name}
                <Handle
                    type="source"
                    position={Position.Bottom}
                    style={{ opacity: 0 }}
                />
            </div>
        );
    }

    // Render structured Card node style
    return (
        <div
            className={`wf-node wf-card-node ${selected ? "selected" : ""}`}
            style={{
                borderColor: data.color,
                backgroundColor: data.bg,
                width: NODE_WIDTH,
            }}
        >
            <Handle
                type="target"
                position={Position.Top}
                style={{ opacity: 0 }}
            />

            {actionButtons}

            <div className="wf-card-title" style={{ color: data.color }}>
                <span>{data.emoji}</span> {data.name}
            </div>
            <div className="wf-card-body" title={data.text}>
                {data.text}
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                style={{ opacity: 0 }}
            />
        </div>
    );
}

const AddBtnNode = () => {
    return (
        <div className="wf-add-btn-node">
            <Handle
                type="target"
                position={Position.Top}
                style={{ opacity: 0 }}
            />
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </div>
    );
};

const customNodeTypes = { addBtn: AddBtnNode, actionNode: ActionNode };
const customEdgeTypes = { buttonEdge: ButtonEdge };

// INITIAL DATA - Centered perfectly using origin: [0.5, 0]
const INIT_NODES = [
    {
        id: "1",
        type: "actionNode",
        position: { x: CENTER_X, y: START_Y },
        origin: [0.5, 0] as [number, number],
        data: {
            name: "Main Flow",
            emoji: "🖧",
            isRoot: true,
            style: {
                background: "#334155",
                color: "#e2e6f3",
                border: "1px solid #475569",
                borderRadius: 999,
                fontWeight: 600,
                padding: "10px 24px",
                width: "fit-content",
                minWidth: 160,
                textAlign: "center" as const,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
            },
        },
    },
    {
        id: "2",
        type: "actionNode",
        position: { x: CENTER_X, y: START_Y + Y_STEP * 0.8 },
        origin: [0.5, 0] as [number, number],
        data: {
            name: "Before Conversation",
            emoji: "⚡",
            isRoot: true,
            style: {
                background: "#f8fafc",
                color: "#64748b",
                border: "1px solid #e2e8f0",
                borderRadius: 999,
                fontSize: 13,
                padding: "10px 24px",
                width: "fit-content",
                minWidth: 240,
                textAlign: "center" as const,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                fontWeight: 500,
            },
        },
    },
    {
        id: "3",
        type: "actionNode",
        position: { x: CENTER_X, y: START_Y + Y_STEP * 1.8 },
        origin: [0.5, 0] as [number, number],
        data: {
            name: "Greeting Message",
            emoji: "📞",
            text: "Hello How can I help you?",
            color: "#4ade80",
            bg: "rgba(74, 222, 128, 0.15)",
            waitForResponse: false,
        },
    },
    {
        id: "add-btn",
        type: "addBtn",
        position: { x: CENTER_X, y: START_Y + Y_STEP * 2.8 },
        origin: [0.5, 0] as [number, number],
        data: {},
    },
];

const INIT_EDGES = [
    {
        id: "e1-2",
        source: "1",
        target: "2",
        type: "buttonEdge",
        style: { stroke: "#2e3450", strokeWidth: 2 },
        animated: false,
    },
    {
        id: "e2-3",
        source: "2",
        target: "3",
        type: "buttonEdge",
        style: { stroke: "#2e3450", strokeWidth: 2 },
        animated: false,
    },
    {
        id: "e3-add",
        source: "3",
        target: "add-btn",
        type: "buttonEdge",
        style: { stroke: "#2e3450", strokeWidth: 2 },
        animated: false,
    },
];

// ─── Inner Component (Must be wrapped in ReactFlowProvider) ───────────────────
function FlowPageContent() {
    const [tabs, setTabs] = useState(TABS_INIT);
    const [activeTab, setActiveTab] = useState("main");
    const [openSetting, setOpenSetting] = useState<string | null>(null);
    const [toggles, setToggles] = useState<Record<string, boolean>>({});

    // ReactFlow Controlled State
    const [nodes, setNodes] = useState(INIT_NODES);
    const [edges, setEdges] = useState(INIT_EDGES);

    // Popover & Sidebar State
    const [popover, setPopover] = useState<{
        x: number;
        y: number;
        insertEdgeId?: string;
    } | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );

    // LIVE STATE UPDATE HANDLER
    const updateNodeData = useCallback((id: string, newData: any) => {
        setNodes((nds) =>
            nds.map((n) => {
                if (n.id === id) {
                    return { ...n, data: { ...n.data, ...newData } };
                }
                return n;
            }),
        );
    }, []);

    const onNodeClick = useCallback((event: any, node: any) => {
        if (node.id === "add-btn") {
            const domNode = event.target.closest(".react-flow__node");
            const rect = domNode.getBoundingClientRect();
            let x = rect.right + 20;
            let y = rect.top - 20;

            if (x + 300 > window.innerWidth) x = rect.left - 290;

            setPopover({ x, y });
            setSelectedNodeId(null);
        } else {
            setPopover(null);
            setSelectedNodeId(node.id);
        }
    }, []);

    const onEdgeAddClick = useCallback((event: any, edgeId: string) => {
        let x = event.clientX + 15;
        let y = event.clientY - 20;
        if (x + 300 > window.innerWidth) x = event.clientX - 290;

        setPopover({ x, y, insertEdgeId: edgeId });
        setSelectedNodeId(null);
    }, []);

    const onPaneClick = useCallback(() => {
        setPopover(null);
        setSelectedNodeId(null);
    }, []);

    const handleAddNode = (typeDetails: any) => {
        const newNodeId = `node_${Date.now()}`;
        const newNode = {
            id: newNodeId,
            type: "actionNode",
            origin: [0.5, 0] as [number, number],
            data: {
                name: typeDetails.label,
                emoji: typeDetails.emoji,
                color: typeDetails.color,
                bg: typeDetails.bg,
                text: "", // Empty so placeholder CSS shows
                waitForResponse: false,
            },
            position: { x: CENTER_X, y: 0 }, // y gets updated below
        };

        if (popover?.insertEdgeId) {
            // --- 1. INSERT IN THE MIDDLE OF AN EDGE ---
            const edge = edges.find((e) => e.id === popover.insertEdgeId);
            if (!edge) return;

            const targetNode = nodes.find((n) => n.id === edge.target);
            if (!targetNode) return;

            const insertY = targetNode.position.y;
            newNode.position.y = insertY;

            setNodes((nds) =>
                nds
                    .map((n) => {
                        if (n.position.y >= insertY) {
                            return {
                                ...n,
                                position: {
                                    ...n.position,
                                    y: n.position.y + Y_STEP,
                                },
                            };
                        }
                        return n;
                    })
                    .concat(newNode),
            );

            setEdges((eds) => {
                const next = eds.filter((e) => e.id !== edge.id);
                next.push({
                    id: `e${edge.source}-${newNodeId}`,
                    source: edge.source,
                    target: newNodeId,
                    type: "buttonEdge",
                    style: { stroke: "#2e3450", strokeWidth: 2 },
                });
                next.push({
                    id: `e${newNodeId}-${edge.target}`,
                    source: newNodeId,
                    target: edge.target,
                    type: "buttonEdge",
                    style: { stroke: "#2e3450", strokeWidth: 2 },
                });
                return next;
            });
        } else {
            // --- 2. ADD TO THE VERY END ---
            const addBtnNode = nodes.find((n) => n.id === "add-btn");
            const edgeToAddBtn = edges.find((e) => e.target === "add-btn");
            const sourceNodeId = edgeToAddBtn ? edgeToAddBtn.source : null;

            if (!addBtnNode) return;

            newNode.position.y = addBtnNode.position.y;
            const newAddBtnPos = {
                x: CENTER_X,
                y: addBtnNode.position.y + Y_STEP,
            };

            setNodes((nds) =>
                nds
                    .map((n) =>
                        n.id === "add-btn"
                            ? { ...n, position: newAddBtnPos }
                            : n,
                    )
                    .concat(newNode),
            );

            if (sourceNodeId) {
                setEdges((eds) => {
                    const filtered = eds.filter(
                        (e) => e.id !== edgeToAddBtn?.id,
                    );
                    return [
                        ...filtered,
                        {
                            id: `e${sourceNodeId}-${newNodeId}`,
                            source: sourceNodeId,
                            target: newNodeId,
                            type: "buttonEdge",
                            style: { stroke: "#2e3450", strokeWidth: 2 },
                        },
                        {
                            id: `e${newNodeId}-add-btn`,
                            source: newNodeId,
                            target: "add-btn",
                            type: "buttonEdge",
                            style: { stroke: "#2e3450", strokeWidth: 2 },
                        },
                    ];
                });
            }
        }

        setPopover(null);
        setSelectedNodeId(newNodeId); // Auto-open settings
    };

    const toggle = (key: string, def = false) =>
        setToggles((t: any) => ({ ...t, [key]: !(t[key] ?? def) }));
    const addTab = () => {
        const n = tabs.length + 1;
        const id = `sub${n}`;
        setTabs((t) => [...t, { id, label: `Subflow ${n}` }]);
        setActiveTab(id);
    };

    const nodeTypes = useMemo(() => customNodeTypes, []);
    const edgeTypes = useMemo(() => customEdgeTypes, []);
    const selectedNode = nodes.find((n) => n.id === selectedNodeId);

    return (
        <FlowActionContext.Provider value={{ onEdgeAddClick }}>
            <div className="wf-root">
                <style>{styles}</style>

                {/* ══ POPOVER OVERLAY ══ */}
                {popover && (
                    <div
                        className="wf-popover"
                        style={{ top: popover.y, left: popover.x }}
                    >
                        <div className="wf-popover-search">
                            <input
                                type="text"
                                placeholder="Search nodes..."
                                autoFocus
                            />
                        </div>
                        <div className="wf-popover-list">
                            {NODE_TYPES_MENU.map((nt) => (
                                <div
                                    key={nt.id}
                                    className="wf-popover-item"
                                    onClick={() => handleAddNode(nt)}
                                >
                                    <div
                                        className="wf-popover-icon"
                                        style={{
                                            background: nt.bg,
                                            color: nt.color,
                                        }}
                                    >
                                        {nt.icon}
                                    </div>
                                    <div className="wf-popover-text">
                                        <span className="wf-popover-title">
                                            {nt.label}
                                        </span>
                                        <span className="wf-popover-desc">
                                            {nt.desc}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ══ TOPBAR ══ */}
                <header className="wf-topbar">
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
                                fontSize: 12,
                            }}
                        >
                            ID: ba21…5567
                        </span>
                    </div>
                    <div className="wf-spacer" />
                    <div className="wf-topbar-saved">
                        <div className="wf-topbar-saved-dot" />
                        Saved 23:35
                    </div>
                    <button className="wf-icon-btn">
                        <Ic
                            d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                            size={16}
                        />
                    </button>
                    <button
                        className="wf-icon-btn"
                        onClick={() => setSelectedNodeId(null)}
                    >
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
                        <div className="wf-tabs">
                            {tabs.map((tab, i) => (
                                <div
                                    key={tab.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "100%",
                                    }}
                                >
                                    {i > 0 && <div className="wf-tab-sep" />}
                                    <div
                                        className={`wf-tab${activeTab === tab.id ? " active" : ""}`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
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

                        <div className="wf-flow-wrap">
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                nodeTypes={nodeTypes}
                                edgeTypes={edgeTypes}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onNodeClick={onNodeClick}
                                onPaneClick={onPaneClick}
                                onMoveStart={onPaneClick}
                                nodesDraggable={false}
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

                    {/* ── Right: Sidebar ── */}
                    {selectedNode && !selectedNode.data.isRoot ? (
                        <aside className="wf-right-panel">
                            <div className="ns-head">
                                <span className="ns-title">
                                    {selectedNode.data.name || "Message"}
                                </span>
                                <button
                                    className="ns-close-btn"
                                    onClick={() => setSelectedNodeId(null)}
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="ns-body">
                                <div className="ns-field">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="ns-input"
                                        placeholder="Enter a name for the node"
                                        value={selectedNode.data.name || ""}
                                        onChange={(e) =>
                                            updateNodeData(selectedNode.id, {
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="ns-field">
                                    <label>
                                        Exact Message <i>i</i>
                                    </label>
                                    <textarea
                                        className="ns-textarea"
                                        placeholder="Write the exact message to be spoken."
                                        value={selectedNode.data.text || ""}
                                        onChange={(e) =>
                                            updateNodeData(selectedNode.id, {
                                                text: e.target.value,
                                            })
                                        }
                                    />
                                    <div className="ns-hint">
                                        <span>{`{}`}</span> For Variables
                                    </div>
                                </div>
                                <div className="ns-toggle-row">
                                    <label>
                                        Wait for user to respond <i>i</i>
                                    </label>
                                    <button
                                        className={`gs-toggle ${selectedNode.data.waitForResponse ? "on" : ""}`}
                                        onClick={() =>
                                            updateNodeData(selectedNode.id, {
                                                waitForResponse:
                                                    !selectedNode.data
                                                        .waitForResponse,
                                            })
                                        }
                                    >
                                        <div className="gs-toggle-knob" />
                                    </button>
                                </div>
                            </div>
                        </aside>
                    ) : (
                        <aside className="wf-right-panel">
                            <div className="gs-head">
                                <span className="gs-title">
                                    Global Settings
                                </span>
                                <button className="gs-history-btn">
                                    <HistoryIcon />
                                </button>
                            </div>

                            <div className="gs-body">
                                <div className="gs-space">
                                    {SETTINGS.map((s) => {
                                        const open = openSetting === s.id;
                                        return (
                                            <div key={s.id}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenSetting(
                                                            open ? null : s.id,
                                                        );
                                                    }}
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
                                                        {SUBS[
                                                            s.id as keyof typeof SUBS
                                                        ].map(
                                                            (
                                                                item: any,
                                                                i: number,
                                                            ) => {
                                                                const key = `${s.id}-${i}`;
                                                                const isOn =
                                                                    toggles[
                                                                        key
                                                                    ] ??
                                                                    item.on;
                                                                return (
                                                                    <div
                                                                        key={
                                                                            key
                                                                        }
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
                    )}
                </div>
            </div>
        </FlowActionContext.Provider>
    );
}

// Wrap export in Provider so Custom Nodes can use ReactFlow hooks
export default function FlowPage() {
    return (
        <ReactFlowProvider>
            <FlowPageContent />
        </ReactFlowProvider>
    );
}

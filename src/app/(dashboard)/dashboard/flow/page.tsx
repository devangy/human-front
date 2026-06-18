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
    getSmoothStepPath,
    EdgeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Phone } from "lucide-react";

// ─── Constants & Layout Engine ───────────────────────────────────────────────
const CENTER_X = 300;
const NODE_WIDTH = 260;
const Y_STEP = 160;
const START_Y = 80;

// Context to pass edge click events down to the custom edges
const FlowActionContext = createContext<any>(null);
// Utility: Find all children, grandchildren, etc., of a specific node
const getDescendants = (nodeId: string, edges: any[]): string[] => {
    const outEdges = edges.filter((e) => e.source === nodeId);
    const children = outEdges.map((e) => e.target);
    return children.reduce(
        (acc, child) => [...acc, child, ...getDescendants(child, edges)],
        [],
    );
};

// Utility: Mathematically center and space branches so they never overlap
const recalculateBranchPositions = (
    anchorId: string,
    currentNodes: any[],
    currentEdges: any[],
) => {
    const outEdges = currentEdges.filter((e) => e.source === anchorId);
    const conditionIds = outEdges.map((e) => e.target);

    const N = conditionIds.length;
    const SPACING_X = 360; // Wide, spacious horizontal gap between branches

    const anchorNode = currentNodes.find((n) => n.id === anchorId);
    if (!anchorNode) return currentNodes;

    let updatedNodes = [...currentNodes];

    conditionIds.forEach((condId, index) => {
        const offsetX = (index - (N - 1) / 2) * SPACING_X;
        const targetX = anchorNode.position.x + offsetX;

        const condNode = updatedNodes.find((n) => n.id === condId);
        if (!condNode) return;

        const dx = targetX - condNode.position.x;

        if (dx !== 0) {
            const branchNodes = [
                condId,
                ...getDescendants(condId, currentEdges),
            ];
            updatedNodes = updatedNodes.map((n) => {
                if (branchNodes.includes(n.id)) {
                    return {
                        ...n,
                        position: { ...n.position, x: n.position.x + dx },
                    };
                }
                return n;
            });
        }
    });
    return updatedNodes;
};

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

  .wf-btn-test { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 0 16px; height: 36px; border-radius: 8px; border: 1px solid #22d3ee55; background: linear-gradient(90deg, #22d3ee22, #22d3ee11); color: var(--cyan); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.2s; }
  .wf-btn-test:hover { background: linear-gradient(90deg, #22d3ee33, #22d3ee18); box-shadow: 0 0 16px rgba(34,211,238,0.2); transform: translateY(-1px); }

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

  /* Remove Watermark */
  .react-flow__panel.react-flow__attribution { display: none !important; }

  /* Themed Controls */
  .wf-flow-wrap .react-flow__controls {
      background: var(--bg2) !important;
      border: 1px solid var(--border) !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
      overflow: hidden;
  }
  .wf-flow-wrap .react-flow__controls-button {
      background: var(--bg2) !important;
      border: none !important;
      border-bottom: 1px solid var(--border) !important;
      color: var(--text2) !important;
      fill: var(--text2) !important;
      transition: all 0.15s ease;
  }
  .wf-flow-wrap .react-flow__controls-button:hover {
      background: var(--bg3) !important;
      fill: var(--text) !important;
  }
  .wf-flow-wrap .react-flow__controls-button:last-child {
      border-bottom: none !important;
  }

  .wf-flow-wrap .react-flow__minimap { background: var(--bg2) !important; border: 1px solid var(--border) !important; border-radius: 8px !important; }
  .wf-flow-wrap .react-flow__minimap-mask { fill: rgba(15,17,23,0.7) !important; }

  /* ── Custom Node styling ──── */
  .wf-node { position: relative; transition: box-shadow 0.2s; }
  .wf-node.selected { box-shadow: 0 0 0 2px var(--accent) !important; z-index: 10; }

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

  /* ── Square Edge/Add Buttons ── */
  .wf-edge-add-btn {
      width: 24px; height: 24px; border-radius: 6px;
      background: var(--bg); border: 1px solid var(--border2);
      color: var(--text3); display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s; font-size: 16px;
  }
  .wf-edge-add-btn:hover {
      background: var(--bg2); border-color: var(--accent); color: var(--accent); box-shadow: 0 0 10px var(--accent-glow);
  }

  .wf-add-btn-node {
      width: 28px; height: 28px; border-radius: 6px;
      background: var(--bg); border: 1px solid var(--border2);
      color: var(--text2); display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s;
  }
  .wf-add-btn-node:hover { background: var(--bg2); border-color: var(--accent); color: var(--accent); box-shadow: 0 0 12px var(--accent-glow); }

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

  /* Advanced General Settings Form Elements */
  .gs-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
  .gs-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
  .gs-field-label { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: var(--text2); }
  .gs-field-label i { font-style: normal; color: var(--text3); font-size: 11px; cursor: help; border: 1px solid var(--border2); border-radius: 50%; width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center; }
  .gs-select { width: 100%; background: var(--bg); border: 1px solid var(--border2); border-radius: 8px; padding: 10px 12px; color: var(--text); font-size: 13px; outline: none; appearance: none; cursor: pointer; }
  .gs-select:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-glow); }
  .gs-select-wrap { position: relative; }
  .gs-select-wrap::after { content: '▾'; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--text3); pointer-events: none; font-size: 12px; }
  .gs-textarea { width: 100%; background: var(--bg); border: 1px solid var(--border2); border-radius: 8px; padding: 12px; color: var(--text); font-size: 13px; outline: none; min-height: 140px; resize: vertical; line-height: 1.5; font-family: inherit; }
  .gs-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-glow); }
  .gs-btn-add { width: 100%; padding: 12px; border-radius: 8px; border: 1px dashed var(--border2); background: transparent; color: var(--accent2); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .gs-btn-add:hover { border-color: var(--accent); background: rgba(124,77,255,0.05); }

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

  .wf-popover-section-label { padding: 12px 14px 4px; font-size: 11px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; }

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
const ExpandIcon = () => (
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
        <polyline points="15 3 21 3 21 9"></polyline>
        <polyline points="9 21 3 21 3 15"></polyline>
        <line x1="21" y1="3" x2="14" y2="10"></line>
        <line x1="3" y1="21" x2="10" y2="14"></line>
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
const AddIcon = () => (
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
);

// Menu Icons
const ReturnNodeIcon = () => (
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
        <polyline points="9 14 4 9 9 4"></polyline>
        <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
    </svg>
);
const ActionBoltIcon = () => (
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
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);
const ConversationIcon = () => (
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
        strokeLinecap="round"
        strokeLinejoin="round"
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
        strokeLinecap="round"
        strokeLinejoin="round"
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
        strokeLinecap="round"
        strokeLinejoin="round"
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
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
    </svg>
);
const TransferIcon = () => (
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
        <polyline points="16 3 21 8 16 13"></polyline>
        <line x1="21" y1="8" x2="3" y2="8"></line>
        <polyline points="8 21 3 16 8 11"></polyline>
        <line x1="3" y1="16" x2="21" y2="16"></line>
    </svg>
);
const BookingIcon = () => (
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
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const FLOW_NODES_MENU = [
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
    {
        id: "end",
        label: "End",
        desc: "This is the end node",
        icon: <EndCallIcon />,
        bg: "rgba(239, 68, 68, 0.1)",
        color: "#ef4444",
        emoji: "🛑",
    },
    {
        id: "return",
        label: "Return to Main Flow",
        desc: "This is the return to main flow node",
        icon: <ReturnNodeIcon />,
        bg: "rgba(56, 189, 248, 0.1)",
        color: "#38bdf8",
        emoji: "↩️",
    },
];

const ACTION_NODES_MENU = [
    {
        id: "action",
        label: "Action",
        desc: "This is the action node",
        icon: <ActionBoltIcon />,
        bg: "rgba(59, 130, 246, 0.1)",
        color: "#3b82f6",
        emoji: "⚡",
    },
    {
        id: "sms",
        label: "Send During-Call SMS",
        desc: "Send an SMS during a live call",
        icon: <MessageIcon />,
        bg: "rgba(34, 197, 94, 0.1)",
        color: "#22c55e",
        emoji: "💬",
    },
    {
        id: "whatsapp",
        label: "Send During-Call WhatsApp",
        desc: "Send a WhatsApp message during a live call",
        icon: <ConversationIcon />,
        bg: "rgba(34, 197, 94, 0.1)",
        color: "#22c55e",
        emoji: "📱",
    },
    {
        id: "transfer",
        label: "Transfer",
        desc: "Transfer the call to a human agent",
        icon: <TransferIcon />,
        bg: "rgba(234, 179, 8, 0.1)",
        color: "#eab308",
        emoji: "🔁",
    },
    {
        id: "booking",
        label: "Booking",
        desc: "Book an appointment",
        icon: <BookingIcon />,
        bg: "rgba(249, 115, 22, 0.1)",
        color: "#f97316",
        emoji: "📅",
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
    // The general settings content has a specialized layout built in the component now.
    general: [],
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

// Base straight edge for anchoring directly into the Split anchor without extra '+'
function BaseStraightEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    style,
    markerEnd,
}: EdgeProps) {
    const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
    return (
        <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
    );
}

// Standard Edge (Provides a floating + button to inject nodes perfectly)
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

    const isHiddenEdge =
        target.startsWith("addBtn") ||
        target === "add-btn" ||
        source === "1" ||
        source === "2" ||
        source.startsWith("splitAnchor") ||
        target.startsWith("splitAnchor");

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

// Custom Smooth Step Edge to force perfectly straight horizontal lines for branches
function StepButtonEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    style,
    markerEnd,
}: EdgeProps) {
    // centerY creates the sharp horizontal drop perfectly halfway creating a clean T-junction
    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        centerY: sourceY + 40,
        borderRadius: 16,
    });
    return (
        <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
    );
}

// Invisible visual anchor connecting the main flow to the branching horizontal lines
function SplitAnchorNode({ id }: any) {
    const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

    // Clicking the trash on the split anchor recursively deletes the entire branch safely
    const onDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        const allEdges = getEdges();
        const descendants = getDescendants(id, allEdges);

        setNodes((nds) =>
            nds.filter((n) => n.id !== id && !descendants.includes(n.id)),
        );
        setEdges((eds) =>
            eds.filter(
                (edge) =>
                    edge.source !== id &&
                    edge.target !== id &&
                    !descendants.includes(edge.source) &&
                    !descendants.includes(edge.target),
            ),
        );

        // Spawn a fresh + button on the parent to prevent dead-ending the flow
        const inEdge = allEdges.find((edge) => edge.target === id);
        if (inEdge) {
            const parentId = inEdge.source;
            const parentNode = getNodes().find((n) => n.id === parentId);
            if (parentNode) {
                const addBtnId = `addBtn_${Date.now()}`;
                const addBtnNode = {
                    id: addBtnId,
                    type: "addBtn",
                    origin: [0.5, 0] as [number, number],
                    position: {
                        x: parentNode.position.x,
                        y: parentNode.position.y + Y_STEP,
                    },
                    data: {},
                };
                setNodes((nds) => {
                    const remaining = nds.filter(
                        (n) => n.id !== id && !descendants.includes(n.id),
                    );
                    return [...remaining, addBtnNode];
                });
                setEdges((eds) => {
                    const remaining = eds.filter(
                        (edge) =>
                            edge.source !== id &&
                            edge.target !== id &&
                            !descendants.includes(edge.source) &&
                            !descendants.includes(edge.target),
                    );
                    remaining.push({
                        id: `e${parentId}-${addBtnId}`,
                        source: parentId,
                        target: addBtnId,
                        type: "buttonEdge",
                        style: { stroke: "#2e3450", strokeWidth: 2 },
                    });
                    return remaining;
                });
            }
        }
    };

    return (
        <div
            className="wf-node"
            style={{ width: 1, height: 1, position: "relative" }}
        >
            <Handle
                type="target"
                position={Position.Top}
                style={{ opacity: 0 }}
            />

            <div className="wf-node-actions" style={{ top: -36, right: -15 }}>
                <button
                    className="wf-node-action-btn delete"
                    onClick={onDelete}
                    title="Delete Split"
                >
                    <TrashIcon />
                </button>
            </div>

            {/* The distinct central square plus button acting as the split point */}
            <div
                className="wf-edge-add-btn nodrag nopan react-flow__node-splitAnchor"
                style={{
                    position: "absolute",
                    top: -12,
                    left: -12,
                    zIndex: 20,
                    cursor: "pointer",
                }}
            >
                +
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ opacity: 0 }}
            />
        </div>
    );
}

// Condition Node (Light purple pill with individual branch manipulation)
function ConditionNode({ id, data, selected }: any) {
    const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

    const onDeleteCondition = (e: React.MouseEvent) => {
        e.stopPropagation();
        const allEdges = getEdges();
        const inEdge = allEdges.find((edge) => edge.target === id);
        if (!inEdge) return;
        const anchorId = inEdge.source;

        const descendants = getDescendants(id, allEdges);
        const toDelete = new Set([id, ...descendants]);

        let nextNodes = getNodes().filter((n) => !toDelete.has(n.id));
        let nextEdges = allEdges.filter(
            (edge) => !toDelete.has(edge.source) && !toDelete.has(edge.target),
        );

        const remainingOutEdges = nextEdges.filter(
            (edge) => edge.source === anchorId,
        );

        if (remainingOutEdges.length === 0) {
            // Deleted the last condition! Delete the anchor too and return to a straight path
            nextNodes = nextNodes.filter((n) => n.id !== anchorId);
            const anchorInEdge = allEdges.find(
                (edge) => edge.target === anchorId,
            );
            nextEdges = nextEdges.filter(
                (edge) => edge.source !== anchorId && edge.target !== anchorId,
            );

            if (anchorInEdge) {
                const parentId = anchorInEdge.source;
                const parentNode = getNodes().find((n) => n.id === parentId);
                if (parentNode) {
                    const addBtnId = `addBtn_${Date.now()}`;
                    const addBtnNode = {
                        id: addBtnId,
                        type: "addBtn",
                        origin: [0.5, 0] as [number, number],
                        position: {
                            x: parentNode.position.x,
                            y: parentNode.position.y + Y_STEP,
                        },
                        data: {},
                    };
                    nextNodes.push(addBtnNode);
                    nextEdges.push({
                        id: `e${parentId}-${addBtnId}`,
                        source: parentId,
                        target: addBtnId,
                        type: "buttonEdge",
                        style: { stroke: "#2e3450", strokeWidth: 2 },
                    });
                }
            }
        } else {
            // Smoothly collapse remaining conditions inwards
            nextNodes = recalculateBranchPositions(
                anchorId,
                nextNodes,
                nextEdges,
            );
        }

        setNodes(nextNodes);
        setEdges(nextEdges);
    };

    const onAddCondition = (e: React.MouseEvent) => {
        e.stopPropagation();
        const allEdges = getEdges();
        const inEdge = allEdges.find((edge) => edge.target === id);
        if (!inEdge) return;
        const anchorId = inEdge.source;
        const anchorNode = getNodes().find((n) => n.id === anchorId);
        if (!anchorNode) return;

        const time = Date.now();
        const newCondId = `cond_${time}`;
        const newAddId = `addBtn_${time}`;

        const newCondNode = {
            id: newCondId,
            type: "conditionNode",
            origin: [0.5, 0] as [number, number],
            position: {
                x: anchorNode.position.x,
                y: anchorNode.position.y + 80,
            },
            data: { label: "Condition" },
        };
        const newAddNode = {
            id: newAddId,
            type: "addBtn",
            origin: [0.5, 0] as [number, number],
            position: {
                x: anchorNode.position.x,
                y: anchorNode.position.y + 80 + Y_STEP,
            },
            data: {},
        };

        let nextNodes = [...getNodes(), newCondNode, newAddNode];
        let nextEdges = [
            ...allEdges,
            {
                id: `e${anchorId}-${newCondId}`,
                source: anchorId,
                target: newCondId,
                type: "stepButtonEdge",
                style: { stroke: "#e2e8f0", strokeWidth: 2 },
            },
            {
                id: `e${newCondId}-${newAddId}`,
                source: newCondId,
                target: newAddId,
                type: "buttonEdge",
                style: { stroke: "#e2e8f0", strokeWidth: 2 },
            },
        ];

        nextNodes = recalculateBranchPositions(anchorId, nextNodes, nextEdges);
        setNodes(nextNodes);
        setEdges(nextEdges);
    };

    return (
        <div
            className={`wf-node ${selected ? "selected" : ""}`}
            style={{
                background: "#f4efff",
                border: `1.5px solid ${selected ? "#a855f7" : "#dcb8ff"}`,
                color: "#a855f7",
                padding: "8px 24px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: selected
                    ? "0 0 0 2px rgba(168, 85, 247, 0.2)"
                    : "none",
                transition: "all 0.2s",
            }}
        >
            <Handle
                type="target"
                position={Position.Top}
                style={{ opacity: 0 }}
            />

            <div className="wf-node-actions" style={{ top: -38, right: -20 }}>
                <button
                    className="wf-node-action-btn"
                    onClick={onAddCondition}
                    title="Add Condition"
                    style={{ color: "#3b82f6" }}
                >
                    <AddIcon />
                </button>
                <button
                    className="wf-node-action-btn delete"
                    onClick={onDeleteCondition}
                    title="Delete Condition"
                >
                    <TrashIcon />
                </button>
            </div>

            {data.label}
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ opacity: 0 }}
            />
        </div>
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
                x: nodeToCopy.position.x,
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
            const descendantsToShift = getDescendants(
                nodeToCopy.id,
                getEdges(),
            );
            const shifted = nds.map((n) => {
                if (
                    n.position.y > nodeToCopy.position.y &&
                    descendantsToShift.includes(n.id)
                ) {
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
        if (data.isRoot) return;

        const nodeToDelete = getNode(id);
        if (!nodeToDelete) return;

        const allEdges = getEdges();
        const inEdge = allEdges.find((edge) => edge.target === id);
        const outEdge = allEdges.find((edge) => edge.source === id);

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
            const descendantsToShift = getDescendants(id, allEdges);

            return filtered.map((n) => {
                if (
                    n.position.y > nodeToDelete.position.y &&
                    descendantsToShift.includes(n.id)
                ) {
                    return {
                        ...n,
                        position: { ...n.position, y: n.position.y - Y_STEP },
                    };
                }
                return n;
            });
        });
    };

    // Determine if actions should be shown (hide for nodes 1, 2, and 3)
    const showActions = !["1", "2", "3"].includes(id);

    const actionButtons = showActions && (
        <div className="wf-node-actions">
            <button
                className="wf-node-action-btn"
                onClick={onCopy}
                title="Duplicate Node"
            >
                <CopyIcon />
            </button>
            <button
                className="wf-node-action-btn delete"
                onClick={onDelete}
                title="Delete Node"
            >
                <TrashIcon />
            </button>
        </div>
    );

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
            <AddIcon />
        </div>
    );
};

const customNodeTypes = {
    addBtn: AddBtnNode,
    actionNode: ActionNode,
    conditionNode: ConditionNode,
    splitAnchor: SplitAnchorNode,
};
const customEdgeTypes = {
    buttonEdge: ButtonEdge,
    stepButtonEdge: StepButtonEdge,
    baseStraight: BaseStraightEdge,
};

// INITIAL DATA
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
    const [openSetting, setOpenSetting] = useState<string | null>("general"); // Open General by default
    const [toggles, setToggles] = useState<Record<string, boolean>>({});

    const [nodes, setNodes] = useState(INIT_NODES);
    const [edges, setEdges] = useState(INIT_EDGES);

    const [popover, setPopover] = useState<{
        x: number;
        y: number;
        insertEdgeId?: string;
        addBtnId?: string;
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

    const updateNodeData = useCallback((id: string, newData: any) => {
        setNodes((nds) =>
            nds.map((n) =>
                n.id === id ? { ...n, data: { ...n.data, ...newData } } : n,
            ),
        );
    }, []);

    const onNodeClick = useCallback(
        (event: any, node: any) => {
            if (node.type === "addBtn" || node.type === "splitAnchor") {
                const domNode = event.target.closest(".react-flow__node");
                const rect = domNode.getBoundingClientRect();
                let x = rect.right + 20;
                let y = rect.top - 20;
                if (x + 300 > window.innerWidth) x = rect.left - 290;

                if (node.type === "splitAnchor") {
                    const inEdge = edges.find((e) => e.target === node.id);
                    if (inEdge) setPopover({ x, y, insertEdgeId: inEdge.id });
                } else {
                    setPopover({ x, y, addBtnId: node.id });
                }
                setSelectedNodeId(null);
            } else {
                setPopover(null);
                setSelectedNodeId(node.id);
            }
        },
        [edges],
    );

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
        const time = Date.now();

        // ─── LOGIC FOR SPLIT PATH ───
        if (typeDetails.id === "split") {
            let targetY = 0;
            let targetX = CENTER_X;
            let parentNodeId = "";
            let edgeToReplace = null;

            if (popover?.insertEdgeId) {
                const edge = edges.find((e) => e.id === popover.insertEdgeId);
                if (!edge) return;
                const sourceNode = nodes.find((n) => n.id === edge.source);
                if (!sourceNode) return;

                targetY = sourceNode.position.y + Y_STEP;
                targetX = sourceNode.position.x;
                parentNodeId = edge.source;
                edgeToReplace = edge;
            } else if (popover?.addBtnId) {
                const addBtnNode = nodes.find((n) => n.id === popover.addBtnId);
                if (!addBtnNode) return;
                targetY = addBtnNode.position.y;
                targetX = addBtnNode.position.x;
                const edgeToAddBtn = edges.find(
                    (e) => e.target === popover.addBtnId,
                );
                parentNodeId = edgeToAddBtn ? edgeToAddBtn.source : "";
                edgeToReplace = edgeToAddBtn;
            }

            const splitSpacingX = 180;
            const anchorId = `splitAnchor_${time}`;
            const cond1Id = `condA_${time}`;
            const cond2Id = `condB_${time}`;
            const add1Id = `addBtnA_${time}`;
            const add2Id = `addBtnB_${time}`;

            const anchorNode = {
                id: anchorId,
                type: "splitAnchor",
                origin: [0.5, 0.5] as [number, number],
                position: { x: targetX, y: targetY },
                data: {},
            };
            const cond1Node = {
                id: cond1Id,
                type: "conditionNode",
                origin: [0.5, 0] as [number, number],
                position: { x: targetX - splitSpacingX, y: targetY + 80 },
                data: { label: "Condition" },
            };
            const cond2Node = {
                id: cond2Id,
                type: "conditionNode",
                origin: [0.5, 0] as [number, number],
                position: { x: targetX + splitSpacingX, y: targetY + 80 },
                data: { label: "Condition" },
            };
            const add1Node = {
                id: add1Id,
                type: "addBtn",
                origin: [0.5, 0] as [number, number],
                position: {
                    x: targetX - splitSpacingX,
                    y: targetY + 80 + Y_STEP,
                },
                data: {},
            };
            const add2Node = {
                id: add2Id,
                type: "addBtn",
                origin: [0.5, 0] as [number, number],
                position: {
                    x: targetX + splitSpacingX,
                    y: targetY + 80 + Y_STEP,
                },
                data: {},
            };

            let descendantsToShift: string[] = [];
            if (popover?.insertEdgeId && edgeToReplace) {
                descendantsToShift = [
                    edgeToReplace.target,
                    ...getDescendants(edgeToReplace.target, edges),
                ];
            }

            let nextEdges = edges;
            if (edgeToReplace)
                nextEdges = nextEdges.filter((e) => e.id !== edgeToReplace.id);

            nextEdges.push({
                id: `e${parentNodeId}-${anchorId}`,
                source: parentNodeId,
                target: anchorId,
                type: "baseStraight",
                style: { stroke: "#2e3450", strokeWidth: 2 },
            });
            nextEdges.push({
                id: `e${anchorId}-${cond1Id}`,
                source: anchorId,
                target: cond1Id,
                type: "stepButtonEdge",
                style: { stroke: "#e2e8f0", strokeWidth: 2 },
            });
            nextEdges.push({
                id: `e${anchorId}-${cond2Id}`,
                source: anchorId,
                target: cond2Id,
                type: "stepButtonEdge",
                style: { stroke: "#e2e8f0", strokeWidth: 2 },
            });

            if (popover?.insertEdgeId && edgeToReplace) {
                nextEdges.push({
                    id: `e${cond1Id}-${edgeToReplace.target}`,
                    source: cond1Id,
                    target: edgeToReplace.target,
                    type: "buttonEdge",
                    style: { stroke: "#e2e8f0", strokeWidth: 2 },
                });
            } else {
                nextEdges.push({
                    id: `e${cond1Id}-${add1Id}`,
                    source: cond1Id,
                    target: add1Id,
                    type: "buttonEdge",
                    style: { stroke: "#e2e8f0", strokeWidth: 2 },
                });
            }
            nextEdges.push({
                id: `e${cond2Id}-${add2Id}`,
                source: cond2Id,
                target: add2Id,
                type: "buttonEdge",
                style: { stroke: "#e2e8f0", strokeWidth: 2 },
            });

            setNodes((nds) => {
                let next = popover?.addBtnId
                    ? nds.filter((n) => n.id !== popover.addBtnId)
                    : nds;

                if (descendantsToShift.length > 0) {
                    next = next.map((n) => {
                        if (descendantsToShift.includes(n.id)) {
                            // Sub-tree gently moved down and safely onto the left-hand condition branch
                            const shiftY = 80 + Y_STEP;
                            return {
                                ...n,
                                position: {
                                    ...n.position,
                                    x: n.position.x - splitSpacingX,
                                    y: n.position.y + shiftY,
                                },
                            };
                        }
                        return n;
                    });
                }

                let insertNodes = [anchorNode, cond1Node, cond2Node, add2Node];
                if (!popover?.insertEdgeId) {
                    insertNodes.push(add1Node);
                }
                return recalculateBranchPositions(
                    anchorId,
                    [...next, ...insertNodes],
                    nextEdges,
                );
            });

            setEdges(nextEdges);
            setPopover(null);
            return;
        }

        // ─── LOGIC FOR NORMAL NODE ───
        const newNodeId = `node_${time}`;
        const newNode = {
            id: newNodeId,
            type: "actionNode",
            origin: [0.5, 0] as [number, number],
            data: {
                name: typeDetails.label,
                emoji: typeDetails.emoji,
                color: typeDetails.color,
                bg: typeDetails.bg,
                text: "",
                waitForResponse: false,
            },
            position: { x: 0, y: 0 },
        };

        if (popover?.insertEdgeId) {
            const edge = edges.find((e) => e.id === popover.insertEdgeId);
            if (!edge) return;

            const sourceNode = nodes.find((n) => n.id === edge.source);
            if (!sourceNode) return;

            const insertY = sourceNode.position.y + Y_STEP;
            newNode.position = { x: sourceNode.position.x, y: insertY };

            // Shift down the target node and ALL of its downstream descendants natively
            const descendantsToShift = [
                edge.target,
                ...getDescendants(edge.target, edges),
            ];

            setNodes((nds) =>
                nds
                    .map((n) => {
                        if (descendantsToShift.includes(n.id)) {
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
        } else if (popover?.addBtnId) {
            const addBtnNode = nodes.find((n) => n.id === popover.addBtnId);
            const edgeToAddBtn = edges.find(
                (e) => e.target === popover.addBtnId,
            );
            const sourceNodeId = edgeToAddBtn ? edgeToAddBtn.source : null;

            if (!addBtnNode) return;

            newNode.position = {
                x: addBtnNode.position.x,
                y: addBtnNode.position.y,
            };
            const newAddBtnPos = {
                x: addBtnNode.position.x,
                y: addBtnNode.position.y + Y_STEP,
            };

            setNodes((nds) =>
                nds
                    .map((n) =>
                        n.id === popover.addBtnId
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
                            id: `e${newNodeId}-${popover.addBtnId}`,
                            source: newNodeId,
                            target: popover.addBtnId,
                            type: "buttonEdge",
                            style: { stroke: "#2e3450", strokeWidth: 2 },
                        },
                    ];
                });
            }
        }

        setPopover(null);
        setSelectedNodeId(newNodeId);
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

    const { getNodes, getEdges } = useReactFlow();

    const TestFlowBtn = useCallback(async () => {
        const flowData = {
            nodes: getNodes(),
            edges: getEdges(),
        };

        console.log("React Flow JSON:", flowData);

        try {
            const response = await fetch("/api/test-flow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // 'Authorization': `Bearer YOUR_TOKEN_HERE` // Add if auth is needed
                },
                body: JSON.stringify(flowData),
            });

            if (!response.ok) {
                throw new Error(
                    `HTTP error TestFlowBtn! status: ${response.status}`,
                );
            }

            const result = await response.json();
            console.log("API Call Successful:", result);
        } catch (error) {
            console.error("API Call Failed:", error);
        }
    }, [getNodes, getEdges]);

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
                            {FLOW_NODES_MENU.map((nt) => (
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
                            <div className="wf-popover-section-label">
                                Actions
                            </div>
                            {ACTION_NODES_MENU.map((nt) => (
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
                        <div className="wf-topbar-saved-dot" /> Saved 23:35
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
                    <button
                        onClick={() => TestFlowBtn()}
                        className="wf-btn-test"
                    >
                        <PlayIcon /> Test Voice Agent
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
                                proOptions={{ hideAttribution: true }}
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
                                        Exact Message <i>?</i>
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
                                        Wait for user to respond <i>?</i>
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

                                                {/* Advanced Layout specifically for "General" matching the image */}
                                                {open && s.id === "general" && (
                                                    <div
                                                        className="gs-sub"
                                                        style={{
                                                            background:
                                                                "transparent",
                                                            padding:
                                                                "4px 0 16px",
                                                            margin: 0,
                                                        }}
                                                    >
                                                        <div className="gs-grid-2">
                                                            <div
                                                                className="gs-field"
                                                                style={{
                                                                    marginBottom: 0,
                                                                }}
                                                            >
                                                                <label className="gs-field-label">
                                                                    Language{" "}
                                                                    <i>?</i>
                                                                </label>
                                                                <div className="gs-select-wrap">
                                                                    <select className="gs-select">
                                                                        <option>
                                                                            🇺🇸
                                                                            English
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="gs-field"
                                                                style={{
                                                                    marginBottom: 0,
                                                                }}
                                                            >
                                                                <label className="gs-field-label">
                                                                    AI Model{" "}
                                                                    <i>?</i>
                                                                </label>
                                                                <div className="gs-select-wrap">
                                                                    <select className="gs-select">
                                                                        <option>
                                                                            Synthflow
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="gs-field">
                                                            <label className="gs-field-label">
                                                                Timezone{" "}
                                                                <i>?</i>
                                                            </label>
                                                            <div className="gs-select-wrap">
                                                                <select className="gs-select">
                                                                    <option>
                                                                        Europe/Berlin
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="gs-field">
                                                            <label
                                                                className="gs-field-label"
                                                                style={{
                                                                    justifyContent:
                                                                        "space-between",
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap: "6px",
                                                                    }}
                                                                >
                                                                    Global
                                                                    Prompt{" "}
                                                                    <i>?</i>
                                                                </div>
                                                                <button
                                                                    style={{
                                                                        background:
                                                                            "none",
                                                                        border: "none",
                                                                        color: "var(--text3)",
                                                                        cursor: "pointer",
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        padding:
                                                                            "4px",
                                                                    }}
                                                                >
                                                                    <ExpandIcon />
                                                                </button>
                                                            </label>
                                                            <textarea
                                                                className="gs-textarea"
                                                                defaultValue={
                                                                    "You are a friendly Starbucks host.\nYour sole task right now is to politely ask for the customer's name and ask how we can help them today.\n\nKeep it brief. For example: \"May I..."
                                                                }
                                                            />
                                                        </div>
                                                        <div
                                                            className="gs-field"
                                                            style={{
                                                                marginBottom: 0,
                                                            }}
                                                        >
                                                            <label className="gs-field-label">
                                                                Special Cases{" "}
                                                                <i>?</i>
                                                            </label>
                                                            <p
                                                                style={{
                                                                    fontSize:
                                                                        "13px",
                                                                    color: "var(--text3)",
                                                                    marginBottom:
                                                                        "10px",
                                                                    lineHeight: 1.4,
                                                                }}
                                                            >
                                                                Define how the
                                                                agent should
                                                                respond in
                                                                specific edge
                                                                cases.
                                                            </p>
                                                            <button className="gs-btn-add">
                                                                + Add Special
                                                                Case
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Standard Mapping for other Global Settings */}
                                                {open && s.id !== "general" && (
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
                        </aside>
                    )}
                </div>
            </div>
        </FlowActionContext.Provider>
    );
}

export default function FlowPage() {
    return (
        <ReactFlowProvider>
            <FlowPageContent />
        </ReactFlowProvider>
    );
}

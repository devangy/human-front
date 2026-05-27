"use client";

import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #070709;
    --bg2: #0d0d14;
    --purple: #7c3aed;
    --purple-light: #a855f7;
    --purple-glow: rgba(124,58,237,0.35);
    --white: #f0eeff;
    --muted: #8880a8;
    --border: rgba(124,58,237,0.2);
    --font-display: 'Orbitron', sans-serif;
    --font-body: 'Rajdhani', sans-serif;
  }

  .nh-root {
    background: var(--bg);
    color: var(--white);
    font-family: var(--font-body);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* NAV */
  .nh-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 60px;
    background: rgba(7,7,9,0.7);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
  }
  .nh-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--font-display); font-size: 1.15rem; font-weight: 700;
    color: var(--white); letter-spacing: -0.01em;
  }
  .nh-logo-icon {
    width: 34px; height: 34px;
  }
  .nh-nav-links {
    display: flex; align-items: center; gap: 36px;
    list-style: none;
  }
  .nh-nav-links a {
    color: var(--muted); text-decoration: none;
    font-size: 0.92rem; font-weight: 400;
    transition: color 0.2s;
  }
  .nh-nav-links a:hover { color: var(--white); }
  .nh-nav-actions { display: flex; align-items: center; gap: 16px; }
  .nh-btn-ghost {
    background: none; border: none; cursor: pointer;
    color: var(--muted); font-family: var(--font-body);
    font-size: 0.92rem; transition: color 0.2s;
  }
  .nh-btn-ghost:hover { color: var(--white); }
  .nh-btn-primary {
    background: var(--purple); color: #fff;
    border: none; border-radius: 8px; padding: 10px 22px;
    font-family: var(--font-display); font-size: 0.92rem; font-weight: 600;
    cursor: pointer; letter-spacing: 0.01em;
    box-shadow: 0 0 24px var(--purple-glow);
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  }
  .nh-btn-primary:hover {
    background: var(--purple-light);
    box-shadow: 0 0 40px rgba(168,85,247,0.5);
    transform: translateY(-1px);
  }

  /* HERO */
  .nh-hero {
    position: relative; min-height: 100vh;
    display: flex; align-items: center;
    padding: 120px 60px 80px;
    overflow: hidden;
  }
  .nh-hero-content {
    position: relative; z-index: 2;
    max-width: 520px;
    animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both;
  }
  .nh-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(124,58,237,0.15);
    border: 1px solid var(--border);
    border-radius: 100px; padding: 5px 14px;
    font-size: 0.78rem; color: var(--purple-light);
    font-weight: 500; margin-bottom: 28px;
    letter-spacing: 0.04em; text-transform: uppercase;
  }
  .nh-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--purple-light);
    box-shadow: 0 0 8px var(--purple-light);
    animation: pulse 2s infinite;
  }
  .nh-hero h1 {
    font-family: var(--font-display);
    font-size: clamp(2.8rem, 5.5vw, 4.8rem);
    font-weight: 800; line-height: 1.05;
    letter-spacing: -0.03em;
    color: var(--white);
    margin-bottom: 24px;
  }
  .nh-hero h1 span {
    background: linear-gradient(135deg, #c084fc, #7c3aed);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .nh-hero-sub {
    font-size: 1.08rem; line-height: 1.65;
    color: var(--muted); max-width: 480px;
    margin-bottom: 44px; font-weight: 300;
  }
  .nh-hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; }
  .nh-btn-large {
    background: var(--purple); color: #fff;
    border: none; border-radius: 10px; padding: 14px 32px;
    font-family: var(--font-display); font-size: 1rem; font-weight: 700;
    cursor: pointer; letter-spacing: 0.01em;
    box-shadow: 0 0 36px var(--purple-glow);
    transition: all 0.2s; display: flex; align-items: center; gap: 8px;
  }
  .nh-btn-large:hover {
    background: var(--purple-light);
    box-shadow: 0 0 56px rgba(168,85,247,0.55);
    transform: translateY(-2px);
  }
  .nh-btn-outline {
    background: transparent;
    border: 1px solid var(--border); border-radius: 10px;
    padding: 14px 32px; color: var(--white);
    font-family: var(--font-display); font-size: 1rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .nh-btn-outline:hover {
    border-color: var(--purple-light); color: var(--purple-light);
    background: rgba(124,58,237,0.08);
  }
  .nh-hero-stats {
    margin-top: 56px; display: flex; gap: 40px; flex-wrap: wrap;
  }
  .nh-stat { }
  .nh-stat-val {
    font-family: var(--font-display); font-size: 1.9rem; font-weight: 800;
    color: var(--white); letter-spacing: -0.03em;
  }
  .nh-stat-val span { color: var(--purple-light); }
  .nh-stat-label { font-size: 0.8rem; color: var(--muted); margin-top: 2px; }

  /* WAVE VISUAL */
  .nh-hero-visual {
    position: absolute; right: 40px; top: 50%;
    transform: translateY(-50%);
    width: 42%; max-width: 520px; z-index: 1;
    animation: fadeIn 1.2s ease both 0.3s;
    border-radius: 20px;
    overflow: hidden;
  }
  .nh-wave-canvas {
    width: 100%; height: 340px; display: block;
  }

  /* GLOW BLOBS */
  .nh-glow-1 {
    position: absolute; width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%);
    top: 10%; left: -100px; pointer-events: none;
    animation: blobDrift 8s ease-in-out infinite alternate;
  }
  .nh-glow-2 {
    position: absolute; width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%);
    bottom: 5%; right: 20%; pointer-events: none;
    animation: blobDrift 11s ease-in-out infinite alternate-reverse;
  }

  /* GRID LINES */
  .nh-grid-bg {
    position: absolute; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at 40% 50%, black 0%, transparent 75%);
  }

  /* HOW IT WORKS */
  .nh-section {
    padding: 100px 60px;
    position: relative;
  }
  .nh-section-label {
    font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--purple-light); font-weight: 600; margin-bottom: 12px;
  }
  .nh-section-title {
    font-family: var(--font-display); font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 800; letter-spacing: -0.03em;
    color: var(--white); margin-bottom: 16px;
  }
  .nh-section-sub {
    color: var(--muted); font-size: 1rem; max-width: 500px;
    line-height: 1.6; margin-bottom: 60px;
  }
  .nh-divider {
    width: 100%; height: 1px;
    background: linear-gradient(90deg, var(--purple) 0%, transparent 70%);
    margin-bottom: 60px;
  }
  .nh-steps {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
  .nh-step {
    padding: 32px; border-radius: 16px;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    transition: border-color 0.3s, background 0.3s, transform 0.3s;
    cursor: default;
  }
  .nh-step:hover {
    border-color: rgba(124,58,237,0.5);
    background: rgba(124,58,237,0.06);
    transform: translateY(-4px);
  }
  .nh-step-icon {
    width: 52px; height: 52px; margin-bottom: 24px;
    border-radius: 12px;
    background: rgba(124,58,237,0.15);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
  }
  .nh-step-num {
    font-family: var(--font-display); font-size: 1.15rem; font-weight: 800;
    color: var(--white); margin-bottom: 8px;
  }
  .nh-step-title {
    font-family: var(--font-display); font-size: 1.3rem; font-weight: 700;
    color: var(--white); margin-bottom: 12px; letter-spacing: -0.02em;
  }
  .nh-step-desc { color: var(--muted); font-size: 0.92rem; line-height: 1.65; }

  /* FEATURES */
  .nh-features-grid {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 2px; border: 1px solid var(--border); border-radius: 20px;
    overflow: hidden; background: var(--border);
  }
  .nh-feature {
    padding: 40px; background: var(--bg);
    transition: background 0.3s;
  }
  .nh-feature:hover { background: rgba(124,58,237,0.05); }
  .nh-feature-icon {
    font-size: 1.8rem; margin-bottom: 16px;
  }
  .nh-feature-title {
    font-family: var(--font-display); font-size: 1.1rem;
    font-weight: 700; color: var(--white);
    margin-bottom: 10px; letter-spacing: -0.01em;
  }
  .nh-feature-desc { color: var(--muted); font-size: 0.9rem; line-height: 1.6; }

  /* PRICING */
  .nh-pricing-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
  }
  .nh-plan {
    padding: 36px; border-radius: 18px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.02);
    transition: transform 0.3s;
  }
  .nh-plan:hover { transform: translateY(-4px); }
  .nh-plan.featured {
    border-color: var(--purple);
    background: rgba(124,58,237,0.08);
    box-shadow: 0 0 60px rgba(124,58,237,0.15);
    position: relative;
  }
  .nh-plan-badge {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: var(--purple); color: #fff;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; padding: 4px 14px; border-radius: 100px;
    font-family: var(--font-display);
  }
  .nh-plan-name {
    font-family: var(--font-display); font-size: 1rem; font-weight: 700;
    color: var(--muted); letter-spacing: 0.05em; text-transform: uppercase;
    margin-bottom: 16px;
  }
  .nh-plan-price {
    font-family: var(--font-display); font-size: 2.8rem; font-weight: 800;
    color: var(--white); letter-spacing: -0.04em; margin-bottom: 4px;
  }
  .nh-plan-price span { font-size: 1.1rem; color: var(--muted); font-weight: 400; }
  .nh-plan-sub { color: var(--muted); font-size: 0.85rem; margin-bottom: 28px; }
  .nh-plan-features { list-style: none; margin-bottom: 32px; }
  .nh-plan-features li {
    display: flex; align-items: center; gap: 10px;
    color: var(--muted); font-size: 0.9rem; padding: 7px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .nh-plan-features li:last-child { border-bottom: none; }
  .nh-check { color: var(--purple-light); font-size: 0.85rem; }
  .nh-plan-btn {
    width: 100%; padding: 13px;
    border-radius: 10px; font-family: var(--font-display);
    font-size: 0.95rem; font-weight: 700; cursor: pointer;
    transition: all 0.2s;
  }
  .nh-plan-btn.outline {
    background: transparent; color: var(--white);
    border: 1px solid var(--border);
  }
  .nh-plan-btn.outline:hover { border-color: var(--purple); color: var(--purple-light); }
  .nh-plan-btn.solid {
    background: var(--purple); color: #fff; border: none;
    box-shadow: 0 0 30px var(--purple-glow);
  }
  .nh-plan-btn.solid:hover { background: var(--purple-light); }

  /* CTA SECTION */
  .nh-cta-section {
    padding: 100px 60px; text-align: center;
    position: relative; overflow: hidden;
  }
  .nh-cta-glow {
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.2) 0%, transparent 65%);
    pointer-events: none;
  }
  .nh-cta-section h2 {
    font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 800; letter-spacing: -0.03em;
    color: var(--white); margin-bottom: 18px; position: relative; z-index: 1;
  }
  .nh-cta-section p {
    color: var(--muted); font-size: 1.05rem; max-width: 460px;
    margin: 0 auto 40px; line-height: 1.65; position: relative; z-index: 1;
  }
  .nh-cta-actions { display: flex; gap: 14px; justify-content: center; position: relative; z-index: 1; }

  /* FOOTER */
  .nh-footer {
    padding: 40px 60px;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 16px;
  }
  .nh-footer-copy { color: var(--muted); font-size: 0.85rem; }
  .nh-footer-links { display: flex; gap: 28px; }
  .nh-footer-links a {
    color: var(--muted); text-decoration: none;
    font-size: 0.85rem; transition: color 0.2s;
  }
  .nh-footer-links a:hover { color: var(--white); }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.4; }
  }
  @keyframes blobDrift {
    from { transform: translate(0,0) scale(1); }
    to { transform: translate(30px, 20px) scale(1.08); }
  }

  @media (max-width: 900px) {
    .nh-nav { padding: 16px 24px; }
    .nh-nav-links { display: none; }
    .nh-hero { padding: 100px 24px 60px; }
    .nh-hero-visual { display: none; }
    .nh-section { padding: 70px 24px; }
    .nh-steps { grid-template-columns: 1fr; }
    .nh-features-grid { grid-template-columns: 1fr; }
    .nh-pricing-grid { grid-template-columns: 1fr; }
    .nh-cta-section { padding: 70px 24px; }
    .nh-footer { padding: 32px 24px; flex-direction: column; align-items: flex-start; }
  }
`;

// Animated wave SVG canvas
function WaveVisual() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let frame = 0;
        let animId;
        const W = (canvas.width = canvas.offsetWidth * 2);
        const H = (canvas.height = canvas.offsetHeight * 2);
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        function drawWave(offset, color, alpha, freq, amp, yBase) {
            ctx.beginPath();
            ctx.moveTo(0, H / 2);
            for (let x = 0; x <= W; x += 4) {
                const y =
                    yBase +
                    Math.sin((x / W) * freq * Math.PI * 2 + offset) * amp +
                    Math.sin(
                        (x / W) * freq * 1.7 * Math.PI * 2 + offset * 0.7,
                    ) *
                        amp *
                        0.4;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        function drawDots() {
            const dots = [
                [W * 0.72, H * 0.18],
                [W * 0.85, H * 0.3],
                [W * 0.6, H * 0.42],
                [W * 0.9, H * 0.55],
                [W * 0.75, H * 0.7],
                [W * 0.55, H * 0.25],
                [W * 0.95, H * 0.38],
                [W * 0.65, H * 0.62],
            ];
            dots.forEach(([x, y], i) => {
                const flicker =
                    0.4 + 0.6 * Math.abs(Math.sin(frame * 0.02 + i));
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(168,85,247,${flicker * 0.8})`;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x, y, 8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(168,85,247,${flicker * 0.15})`;
                ctx.fill();
            });
        }

        function render() {
            ctx.clearRect(0, 0, W, H);
            const t = frame * 0.018;
            // Background mesh lines
            for (let i = 0; i < 12; i++) {
                drawWave(
                    t + i * 0.4,
                    "#7c3aed",
                    0.07 + i * 0.005,
                    2 + i * 0.3,
                    40 + i * 8,
                    H * 0.25 + i * (H * 0.05),
                );
            }
            // Main waves
            drawWave(t, "#a855f7", 0.9, 3, 90, H * 0.48);
            drawWave(t + 1.2, "#7c3aed", 0.75, 2.5, 70, H * 0.52);
            drawWave(t + 0.6, "#c084fc", 0.5, 4, 50, H * 0.45);
            drawWave(t * 0.8, "#6d28d9", 0.6, 2, 110, H * 0.55);
            drawDots();
            frame++;
            animId = requestAnimationFrame(render);
        }
        render();
        return () => cancelAnimationFrame(animId);
    }, []);
    return <canvas ref={canvasRef} className="nh-wave-canvas" />;
}

const steps = [
    {
        icon: (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a855f7"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <path d="M14 17h3m3 0h-3m0 0v-3m0 3v3" />
            </svg>
        ),
        num: "01",
        title: "Design",
        desc: "Visually build conversation flows with our intuitive, no-code designer. Customize every interaction and persona to match your brand voice.",
    },
    {
        icon: (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a855f7"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 2a9 9 0 0 1 9 9" />
                <path d="M3 11a9 9 0 0 1 9-9" />
                <rect x="8" y="10" width="8" height="10" rx="2" />
                <path d="M12 10V7" />
            </svg>
        ),
        num: "02",
        title: "Deploy",
        desc: "Instantly deploy your AI agent across multiple channels and integrate with your existing systems via our one-click connectors.",
    },
    {
        icon: (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a855f7"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
            </svg>
        ),
        num: "03",
        title: "Scale",
        desc: "Effortlessly scale your voice AI operations as your business grows, handling thousands of simultaneous calls without missing a beat.",
    },
];

const features = [
    {
        icon: "🎙️",
        title: "Natural Voice Synthesis",
        desc: "Ultra-realistic voice models indistinguishable from human agents, with tone, pacing, and emotion control.",
    },
    {
        icon: "⚡",
        title: "Real-Time Processing",
        desc: "Sub-200ms response latency ensures natural conversation flow without awkward pauses.",
    },
    {
        icon: "🧠",
        title: "Contextual Memory",
        desc: "Agents remember past interactions, preferences, and context across every conversation.",
    },
    {
        icon: "🔗",
        title: "Deep Integrations",
        desc: "Native connectors for Salesforce, HubSpot, Zendesk, and 200+ enterprise tools.",
    },
];

const plans = [
    {
        name: "Starter",
        price: "$49",
        period: "/month",
        sub: "For small teams",
        features: [
            "500 minutes / month",
            "3 AI voice agents",
            "Basic analytics",
            "Email support",
            "2 integrations",
        ],
        featured: false,
    },
    {
        name: "Growth",
        price: "$199",
        period: "/month",
        sub: "Most popular for scaling teams",
        features: [
            "5,000 minutes / month",
            "15 AI voice agents",
            "Advanced analytics",
            "Priority support",
            "Unlimited integrations",
            "Custom voice cloning",
        ],
        featured: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        sub: "For large organizations",
        features: [
            "Unlimited minutes",
            "Unlimited agents",
            "Dedicated infrastructure",
            "24/7 SLA support",
            "Custom model fine-tuning",
            "SSO & advanced security",
        ],
        featured: false,
    },
];

export default function Home() {
    const [activeNav, setActiveNav] = useState("");

    return (
        <div className="nh-root">
            <style>{style}</style>

            {/* NAV */}
            <nav className="nh-nav">
                <div className="nh-logo">
                    <svg
                        className="nh-logo-icon"
                        viewBox="0 0 34 34"
                        fill="none"
                    >
                        <circle
                            cx="17"
                            cy="17"
                            r="16"
                            stroke="#7c3aed"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M9 17 Q13 9 17 17 Q21 25 25 17"
                            stroke="#a855f7"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <circle cx="17" cy="17" r="2.5" fill="#a855f7" />
                    </svg>
                    NotHuman.ai
                </div>
                <ul className="nh-nav-links">
                    {["Features", "Pricing", "Resources"].map((l) => (
                        <li key={l}>
                            <a href="#" onClick={() => setActiveNav(l)}>
                                {l}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="nh-nav-actions">
                    <button className="nh-btn-ghost">Login</button>
                    <button className="nh-btn-primary">Get Started</button>
                </div>
            </nav>

            {/* HERO */}
            <section className="nh-hero">
                <div className="nh-grid-bg" />
                <div className="nh-glow-1" />
                <div className="nh-glow-2" />
                <div className="nh-hero-content">
                    <div className="nh-badge">
                        <div className="nh-badge-dot" />
                        Now in public beta
                    </div>
                    <h1>
                        The Future of Voice
                        <br />
                        is <span>Not Human</span>
                    </h1>
                    <p className="nh-hero-sub">
                        Craft powerful, no-code AI voice agents. Elevate
                        customer interactions with intelligent automation that
                        sounds and thinks like your best rep.
                    </p>
                    <div className="nh-hero-ctas">
                        <button className="nh-btn-large">
                            Start for Free
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 8h10M9 4l4 4-4 4" />
                            </svg>
                        </button>
                        <button className="nh-btn-outline">Watch Demo</button>
                    </div>
                    <div className="nh-hero-stats">
                        <div className="nh-stat">
                            <div className="nh-stat-val">
                                10M<span>+</span>
                            </div>
                            <div className="nh-stat-label">Calls handled</div>
                        </div>
                        <div className="nh-stat">
                            <div className="nh-stat-val">
                                98<span>%</span>
                            </div>
                            <div className="nh-stat-label">CSAT score</div>
                        </div>
                        <div className="nh-stat">
                            <div className="nh-stat-val">
                                200<span>ms</span>
                            </div>
                            <div className="nh-stat-label">Avg latency</div>
                        </div>
                    </div>
                </div>
                <div className="nh-hero-visual">
                    <WaveVisual />
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="nh-section">
                <div className="nh-section-label">Process</div>
                <div className="nh-section-title">How It Works</div>
                <p className="nh-section-sub">
                    Go from idea to deployed voice agent in minutes, not months.
                </p>
                <div className="nh-divider" />
                <div className="nh-steps">
                    {steps.map((s) => (
                        <div className="nh-step" key={s.title}>
                            <div className="nh-step-icon">{s.icon}</div>
                            <div
                                className="nh-step-num"
                                style={{
                                    color: "var(--purple-light)",
                                    fontSize: "0.78rem",
                                    fontFamily: "var(--font-display)",
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    marginBottom: 8,
                                }}
                            >
                                {s.num}
                            </div>
                            <div className="nh-step-title">{s.title}</div>
                            <div className="nh-step-desc">{s.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURES */}
            <section className="nh-section" style={{ paddingTop: 0 }}>
                <div className="nh-section-label">Capabilities</div>
                <div className="nh-section-title">
                    Built for enterprise scale
                </div>
                <p className="nh-section-sub">
                    Every feature you need to deploy AI voice at scale, with the
                    reliability your customers expect.
                </p>
                <div className="nh-features-grid">
                    {features.map((f) => (
                        <div className="nh-feature" key={f.title}>
                            <div className="nh-feature-icon">{f.icon}</div>
                            <div className="nh-feature-title">{f.title}</div>
                            <div className="nh-feature-desc">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* PRICING */}
            <section className="nh-section">
                <div className="nh-section-label">Pricing</div>
                <div className="nh-section-title">
                    Simple, transparent pricing
                </div>
                <p className="nh-section-sub">
                    Start free. Scale as you grow. No hidden fees.
                </p>
                <div className="nh-pricing-grid">
                    {plans.map((p) => (
                        <div
                            className={`nh-plan${p.featured ? " featured" : ""}`}
                            key={p.name}
                        >
                            {p.featured && (
                                <div className="nh-plan-badge">
                                    Most Popular
                                </div>
                            )}
                            <div className="nh-plan-name">{p.name}</div>
                            <div className="nh-plan-price">
                                {p.price}
                                <span>{p.period}</span>
                            </div>
                            <div className="nh-plan-sub">{p.sub}</div>
                            <ul className="nh-plan-features">
                                {p.features.map((f) => (
                                    <li key={f}>
                                        <span className="nh-check">✦</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                className={`nh-plan-btn ${p.featured ? "solid" : "outline"}`}
                            >
                                {p.name === "Enterprise"
                                    ? "Contact Sales"
                                    : "Get Started"}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="nh-cta-section">
                <div className="nh-cta-glow" />
                <h2>
                    Ready to transform
                    <br />
                    your customer calls?
                </h2>
                <p>
                    Join thousands of companies using NotHuman.ai to deliver
                    exceptional voice experiences at scale.
                </p>
                <div className="nh-cta-actions">
                    <button className="nh-btn-large">Start Free Trial</button>
                    <button className="nh-btn-outline">Talk to Sales</button>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="nh-footer">
                <div className="nh-footer-copy">
                    © 2026 NotHuman.ai · All rights reserved
                </div>
                <div className="nh-footer-links">
                    {["Privacy", "Terms", "Security", "Status"].map((l) => (
                        <a key={l} href="#">
                            {l}
                        </a>
                    ))}
                </div>
            </footer>
        </div>
    );
}

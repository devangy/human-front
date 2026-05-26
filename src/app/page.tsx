"use client";

import { useState } from "react";

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
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
    background: var(--white); color: var(--bg);
    border: none; border-radius: 4px; padding: 10px 22px;
    font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700;
    cursor: pointer; letter-spacing: 0.05em;
    text-transform: uppercase;
    transition: background 0.2s, transform 0.15s;
  }
  .nh-btn-primary:hover {
    background: #fff;
    transform: translateY(-1px);
  }

  /* HERO */
  .nh-hero {
    position: relative; min-height: 100vh;
    display: flex; align-items: center;
    padding: 120px 60px 80px;
    overflow: hidden;
    /* Soft light gradient matching the reference image styling for the hero */
    background: linear-gradient(135deg, #f8f5ff 0%, #e9ddff 100%);
    color: #000;
  }
  .nh-hero-content {
    position: relative; z-index: 2;
    max-width: 650px;
    animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both;
  }
  .nh-hero h1 {
    font-family: var(--font-sans);
    font-size: clamp(3rem, 5vw, 4.5rem);
    font-weight: 500; line-height: 1.1;
    letter-spacing: -0.02em;
    color: #111;
    margin-bottom: 24px;
  }
  .nh-hero-sub {
    font-family: var(--font-sans);
    font-size: 1.1rem; line-height: 1.6;
    color: #333; max-width: 550px;
    margin-bottom: 40px; font-weight: 400;
  }

  /* RIGHT IMAGE VISUAL (GEOMETRIC SHAPES) */
  .nh-hero-visual {
    position: absolute; right: 15%; top: 50%;
    transform: translateY(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 24px;
    z-index: 1;
    animation: fadeIn 1.2s ease both 0.3s;
  }
  .ref-shape {
    background: rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 32px rgba(124, 58, 237, 0.05);
    backdrop-filter: blur(8px);
  }
  .ref-pill-top {
    width: 90px; height: 260px;
    border-radius: 60px;
  }
  .ref-circle {
    width: 90px; height: 90px;
    border-radius: 50%;
  }
  .ref-pill-bottom {
    width: 90px; height: 260px;
    border-radius: 60px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent);
  }

  /* REST OF THE SECTIONS (Kept Dark Mode) */
  .nh-section {
    padding: 100px 60px;
    position: relative;
    background: var(--bg);
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

  /* FOOTER */
  .nh-footer {
    padding: 40px 60px;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 16px;
    background: var(--bg);
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

  @media (max-width: 900px) {
    .nh-nav { padding: 16px 24px; }
    .nh-nav-links { display: none; }
    .nh-hero { padding: 120px 24px 60px; }
    .nh-hero-visual { display: none; }
    .nh-section { padding: 70px 24px; }
    .nh-steps { grid-template-columns: 1fr; }
    .nh-features-grid { grid-template-columns: 1fr; }
    .nh-footer { padding: 32px 24px; flex-direction: column; align-items: flex-start; }
  }
`;

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
                    <button
                        className="nh-btn-primary"
                        style={{ background: "var(--purple)", color: "white" }}
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* HERO (Light theme to match reference image) */}
            <section className="nh-hero">
                <div className="nh-hero-content">
                    <h1>
                        The Future of AI is
                        <br />
                        Not Human
                    </h1>
                    <p className="nh-hero-sub">
                        The only end-to-end Voice AI platform with in-house
                        telephony, proven deployment framework, and ROI
                        delivered in weeks — redefining how enterprises connect
                        with customers.
                    </p>
                    <button
                        className="nh-btn-primary"
                        style={{ background: "#0a0a0a", color: "#fff" }}
                    >
                        CONTACT SALES
                    </button>
                </div>

                {/* CSS GEOMETRIC SHAPES (From reference image) */}
                <div className="nh-hero-visual">
                    <div className="ref-shape ref-pill-top" />
                    <div className="ref-shape ref-circle" />
                    <div className="ref-pill-bottom" />
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

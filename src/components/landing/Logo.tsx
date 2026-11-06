export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      fill="none"
      className="shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="34" y2="34">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="55%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
      </defs>
      <circle cx="17" cy="17" r="16" fill="url(#logo-grad)" />
      <g
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.95"
      >
        <path d="M11 15v4" stroke="#f6b73c" />
        <path d="M15.5 11v12" />
        <path d="M20 9v16" />
        <path d="M24.5 13v8" stroke="#f6b73c" />
      </g>
    </svg>
  );
}

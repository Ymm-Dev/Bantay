export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M60 14 L96 27 C96 52 88 73 60 92 C32 73 24 52 24 27 Z" strokeWidth="6" />
      <path d="M42 42 H78" strokeWidth="6" />
      <path d="M42 55 H70" strokeWidth="6" />
      <path d="M42 68 H60" strokeWidth="6" />
    </svg>
  );
}

export function EmptyNoData({ className = "mx-auto h-[108px] w-[148px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden>
      <ellipse cx="80" cy="108" rx="42" ry="5" fill="#E8EBF2" />
      <path d="M18 86c18-10 32-8 46 2 12-14 30-16 48-4 8-6 22-4 30 6" fill="none" stroke="#E4E7EE" strokeWidth="3" />
      <path d="M28 78c6-10 16-14 22-8" fill="none" stroke="#E4E7EE" strokeWidth="3" />
      <path d="M36 86c0-10 6-18 10-18s8 6 8 14" fill="#D7DCE6" />
      <rect x="108" y="86" width="16" height="10" rx="1.5" fill="#D7DCE6" />
      <path d="M54 18h52c3 0 6 3 6 6v70c0 3-3 6-6 6H54c-3 0-6-3-6-6V24c0-3 3-6 6-6Z" fill="#EEF1F6" />
      <path d="M54 18h52c3 0 6 3 6 6v8H48v-8c0-3 3-6 6-6Z" fill="#E2E6EF" />
      <rect x="62" y="40" width="36" height="3.5" rx="1.5" fill="#D5DAE4" />
      <rect x="62" y="50" width="28" height="3.5" rx="1.5" fill="#D5DAE4" />
      <rect x="62" y="60" width="32" height="3.5" rx="1.5" fill="#D5DAE4" />
      <circle cx="118" cy="34" r="7" fill="#E8EBF2" />
    </svg>
  );
}

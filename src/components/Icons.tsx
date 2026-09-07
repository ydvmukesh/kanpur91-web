import { ArrowDown, Cloud } from "lucide-react";

export function IconHome({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGift({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="10" width="18" height="11" rx="1.5" />
      <path d="M3 10h18M12 10v11M12 10c0-3-2.2-5-4.5-5S5 7.5 7.2 10M12 10c0-3 2.2-5 4.5-5S19 7.5 16.8 10" />
    </svg>
  );
}

export function IconDiamond() {
  return (
    <svg viewBox="0 0 36 36" className="h-7 w-7">
      <defs>
        <linearGradient id="dia" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9a8e" />
          <stop offset="100%" stopColor="#f95959" />
        </linearGradient>
      </defs>
      <path fill="url(#dia)" d="M18 2 34 14 18 34 2 14Z" />
      <path fill="#fff" opacity=".35" d="M18 2 26 14H10Z" />
    </svg>
  );
}

export function IconWallet({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M16 12.5h2.5" />
      <path d="M3 9h18" />
    </svg>
  );
}

export function IconUser({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c1.4-3.2 3.8-4.8 7-4.8s5.6 1.6 7 4.8" />
    </svg>
  );
}

export function IconBack() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPhone({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
      <path d="M11 18.5h2" strokeLinecap="round" />
    </svg>
  );
}

export function IconLock({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </svg>
  );
}

export function IconMail({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function IconChevronDown({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FlagUS() {
  return (
    <svg viewBox="0 0 32 32" className="h-[18px] w-[18px] rounded-full overflow-hidden">
      <rect width="32" height="32" fill="#b22234" />
      <path fill="#fff" d="M0 4h32v3H0zm0 7h32v3H0zm0 7h32v3H0zm0 7h32v3H0z" />
      <rect width="16" height="14" fill="#3c3b6e" />
    </svg>
  );
}

export function FlagIN() {
  return (
    <svg viewBox="0 0 32 32" className="h-[18px] w-[18px] rounded-full overflow-hidden">
      <rect width="32" height="11" fill="#ff9933" />
      <rect y="11" width="32" height="10" fill="#fff" />
      <rect y="21" width="32" height="11" fill="#138808" />
      <circle cx="16" cy="16" r="3.2" fill="#000088" />
    </svg>
  );
}

export function IconBell() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 16h12l-1.2-2.2V10a4.8 4.8 0 1 0-9.6 0v3.8L6 16Z" />
      <path d="M10 16a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconHeadset() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4.5 13v-1.5A7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 7.5 7.5V13" />
      <rect x="3" y="12" width="4.2" height="6.5" rx="1.4" />
      <rect x="16.8" y="12" width="4.2" height="6.5" rx="1.4" />
    </svg>
  );
}

export function IconDownload() {
  return (
    <span className="relative inline-flex h-6 w-6 items-center justify-center">
      <Cloud className="absolute inset-0 h-6 w-6" fill="currentColor" stroke="currentColor" strokeWidth={1.25} />
      <ArrowDown className="relative mt-[3px] h-3 w-3 text-white" strokeWidth={2.75} />
    </span>
  );
}

export function IconEye({ off }: { off?: boolean }) {
  return off ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4l16 16M9.9 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2.1-.9M6.1 6.6C4.4 7.8 3.1 9.4 2.4 12c1.5 5 5.4 8 9.6 8 1.6 0 3.1-.4 4.5-1.2M17.8 15.4c1.4-1 2.5-2.5 3.3-4.4C19.6 6 15.7 3 11.5 4.2" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2.5 12C4 7.5 7.7 4.5 12 4.5S20 7.5 21.5 12C20 16.5 16.3 19.5 12 19.5S4 16.5 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconCopy() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="8" y="8" width="11" height="11" rx="1.5" />
      <path d="M6 16H5a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 5 4h9A1.5 1.5 0 0 1 15.5 5.5V7" />
    </svg>
  );
}

export function IconSpeaker() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-main" fill="currentColor">
      <path d="M4 9h3l5-4v14l-5-4H4V9Zm12.2 1.2a3 3 0 0 1 0 3.6l-1.1-1a1.6 1.6 0 0 0 0-1.6l1.1-1Zm2.5-2.4a6 6 0 0 1 0 8.4l-1.1-1.1a4.5 4.5 0 0 0 0-6.2l1.1-1.1Z" />
    </svg>
  );
}

export function IconChevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function IconQuestion() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.1.8-1.1 1.6V14" />
      <circle cx="12" cy="17" r=".8" fill="currentColor" />
    </svg>
  );
}

export function IconShield({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 5 6.5v5.2c0 4.2 2.8 7.2 7 8.8 4.2-1.6 7-4.6 7-8.8V6.5L12 3Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconInvite({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="m3 8 9 6 9-6" />
    </svg>
  );
}

export function IconCheck({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3">
      <path d="m5 12 5 5 9-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconRefresh({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 12a8 8 0 1 1-2.2-5.5" strokeLinecap="round" />
      <path d="M20 5v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCoin() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
      <circle cx="10" cy="10" r="9" fill="#F5C542" />
      <circle cx="10" cy="10" r="7" fill="#FFE08A" />
      <circle cx="10" cy="10" r="7" stroke="#E0A21B" strokeWidth="1.2" />
      <text x="10" y="13.2" textAnchor="middle" fontSize="9" fontWeight="700" fill="#C48412">
        ₹
      </text>
    </svg>
  );
}

export function IconWalletMini({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M4.5 7.2A2.7 2.7 0 0 1 7.2 4.5h9.6A2.7 2.7 0 0 1 19.5 7.2V8.5h1.4A1.6 1.6 0 0 1 22.5 10.1v3.8a1.6 1.6 0 0 1-1.6 1.6H19.5v1.3a2.7 2.7 0 0 1-2.7 2.7H7.2A2.7 2.7 0 0 1 4.5 16.8V7.2Zm15 5.3h1.4a.4.4 0 0 0 .4-.4v-3.8a.4.4 0 0 0-.4-.4H19.5v4.6Z" />
    </svg>
  );
}

export function IconBook({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16.5H7.8A2.8 2.8 0 0 0 5 22.3V5.5Z" strokeLinejoin="round" />
      <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3" />
      <path d="M9 8h7M9 12h7" strokeLinecap="round" />
    </svg>
  );
}

export function IconVolume({ muted }: { muted?: boolean }) {
  return muted ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10v4h3.2L12 18.5V5.5L7.2 10H4Z" strokeLinejoin="round" />
      <path d="m16 10 5 5M21 10l-5 5" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10v4h3.2L12 18.5V5.5L7.2 10H4Z" strokeLinejoin="round" />
      <path d="M16 9.2a4.2 4.2 0 0 1 0 5.6M18.5 7a7 7 0 0 1 0 10" strokeLinecap="round" />
    </svg>
  );
}

export function IconFlame({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2s3.2 3.6 3.2 7.2c0 1.4-.5 2.6-1.3 3.5 1.6-.4 3.6-1.8 3.6-4.7 2.4 2.6 3.5 5 3.5 7.5A8 8 0 1 1 4 15.5C4 10.2 8.5 6.4 12 2Z" />
    </svg>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 min-h-0 flex flex-col bg-page-auth overflow-hidden pb-safe-b">{children}</div>;
}

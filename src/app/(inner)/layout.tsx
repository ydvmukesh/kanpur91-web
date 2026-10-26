export default function InnerLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 min-h-0 flex flex-col pb-safe-b">{children}</div>;
}

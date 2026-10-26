"use client";

export function Sheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-end">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
        {children}
      </div>
    </div>
  );
}

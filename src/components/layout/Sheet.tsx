"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function Sheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setRoot(document.getElementById("phone-root") ?? document.body);
  }, []);

  if (!root) return null;

  return createPortal(
    <div className="absolute inset-0 z-[80] flex justify-center">
      <div className="relative h-full w-full">
        <button type="button" className="absolute inset-0 bg-black/55" onClick={onClose} />
        <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] animate-[sheet-up_280ms_ease-out]">
          {children}
        </div>
      </div>
    </div>,
    root,
  );
}

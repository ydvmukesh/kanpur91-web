"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

const MS = 300;

export function Popup({
  open,
  onClose,
  children,
  className,
  placement = "center",
}: {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  placement?: "center" | "bottom";
}) {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setRoot(document.getElementById("phone-root") ?? document.body);
  }, []);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    setShown(false);
    const tmr = window.setTimeout(() => setMounted(false), MS);
    return () => window.clearTimeout(tmr);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !mounted || !root) return;
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [open, mounted, root]);

  if (!mounted || !root) return null;

  return createPortal(
    <div
      className={cn(
        "absolute inset-0 z-[70] flex justify-center",
        placement === "bottom" ? "items-end" : "items-center",
      )}
    >
      {onClose ? (
        <button
          type="button"
          className={cn("alert-modal-mask absolute inset-0 bg-black/40", shown && "is-in")}
          onClick={onClose}
        />
      ) : (
        <div className={cn("alert-modal-mask absolute inset-0 bg-black/40", shown && "is-in")} />
      )}
      <div className={cn("alert-modal relative z-10", shown && "is-in", className)}>{children}</div>
    </div>,
    root,
  );
}

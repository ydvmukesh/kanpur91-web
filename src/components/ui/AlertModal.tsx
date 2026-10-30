"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/cn";

const MS = 300;

export function AlertModal({
  open,
  message,
  confirmLabel,
  onConfirm,
}: {
  open: boolean;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
}) {
  const { t } = useI18n();
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [text, setText] = useState(message);

  useEffect(() => {
    setRoot(document.getElementById("phone-root") ?? document.body);
  }, []);

  useEffect(() => {
    if (open) setText(message);
  }, [open, message]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setShown(false);
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    setShown(false);
    const tmr = window.setTimeout(() => setMounted(false), MS);
    return () => window.clearTimeout(tmr);
  }, [open]);

  if (!mounted || !root) return null;

  return createPortal(
    <div className="absolute inset-0 z-[70] flex items-center justify-center">
      <div className={cn("alert-modal-mask absolute inset-0 bg-black/40", shown && "is-in")} />
      <div className={cn("alert-modal relative z-10 w-80 overflow-hidden rounded-[0.8125rem] bg-white", shown && "is-in")}>
        <p className="px-4 py-5 text-center text-sm text-ink">{text}</p>
        <div className="h-px bg-line" />
        <button
          type="button"
          className="flex h-[2.75rem] w-full items-center justify-center text-base font-medium text-[#007aff]"
          onClick={onConfirm}
        >
          {confirmLabel ?? t("confirm")}
        </button>
      </div>
    </div>,
    root,
  );
}

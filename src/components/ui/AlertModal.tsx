"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/hooks/useI18n";
import { Popup } from "@/components/ui/Popup";

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
  const [text, setText] = useState(message);

  useEffect(() => {
    if (open) setText(message);
  }, [open, message]);

  return (
    <Popup open={open} className="w-80 overflow-hidden rounded-[0.8125rem] bg-white">
      <p className="px-4 py-5 text-center text-sm text-ink">{text}</p>
      <div className="h-px bg-line" />
      <button
        type="button"
        className="flex h-[2.75rem] w-full items-center justify-center text-base font-medium text-[#007aff]"
        onClick={onConfirm}
      >
        {confirmLabel ?? t("confirm")}
      </button>
    </Popup>
  );
}

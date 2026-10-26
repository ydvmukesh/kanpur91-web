"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { WheelPicker } from "@/components/ui/WheelPicker";
import { useI18n } from "@/hooks/useI18n";

export type PickerOption = { id: string; label: string };

export function WheelPickerSheet({
  open,
  options,
  value,
  onChange,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  options: PickerOption[];
  value: string;
  onChange: (id: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useI18n();
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setRoot(document.getElementById("phone-root") ?? document.body);
  }, []);

  if (!open || !root) return null;

  return createPortal(
    <div className="absolute inset-0 z-[80] flex justify-center">
      <div className="relative h-full w-full">
        <button type="button" className="absolute inset-0 bg-black/55" onClick={onCancel} />
        <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white pb-safe-b animate-[sheet-up_280ms_ease-out]">
          <div className="flex h-12 items-center justify-between px-4">
            <button type="button" className="text-sm text-muted" onClick={onCancel}>
              {t("cancel")}
            </button>
            <button type="button" className="text-sm font-medium text-main" onClick={onConfirm}>
              {t("confirm")}
            </button>
          </div>
          <div className="pb-8">
            <WheelPicker options={options} value={value} onChange={onChange} />
          </div>
        </div>
      </div>
    </div>,
    root,
  );
}

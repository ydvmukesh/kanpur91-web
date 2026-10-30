"use client";

import { useI18n } from "@/hooks/useI18n";
import { Button } from "@/components/ui/Button";
import { Popup } from "@/components/ui/Popup";

export function ConfirmModal({
  open,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
}: {
  open: boolean;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const { t } = useI18n();

  return (
    <Popup
      open={open}
      onClose={onClose}
      className="w-[17.5rem] rounded-[0.75rem] bg-white px-5 pb-5 pt-6"
    >
      <div className="mx-auto mb-4 grid size-[3.75rem] place-items-center rounded-full bg-main-x text-[1.75rem] font-bold leading-none text-white">
        !
      </div>
      <p className="mb-6 text-center text-base font-semibold text-ink">{message}</p>
      <Button size="sm" onClick={onConfirm}>
        {confirmLabel ?? t("confirm")}
      </Button>
      <Button variant="outline" size="sm" className="mt-2.5" onClick={onClose}>
        {cancelLabel ?? t("cancel")}
      </Button>
    </Popup>
  );
}

"use client";

import { useStore } from "@/lib/store";

export function RuleModal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const { t } = useStore();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-center">
      <div className="relative w-full max-w-[25rem] h-full">
        <button type="button" className="absolute inset-0 bg-black/55" onClick={onClose} />
        <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-[0_0.5rem_1.875rem_rgba(0,0,0,0.28)]">
          <div className="h-12 bg-main-x grid place-items-center px-3">
            <p className="text-white text-15 font-medium">· 《{title}》 ·</p>
          </div>
          <div className="px-3 pt-3">
            <div className="bet-rule-body max-h-[15rem] overflow-y-auto pr-1 text-13 leading-[1.7] text-[#1e2637]">
              {children}
            </div>
          </div>
          <div className="p-4">
            <button
              type="button"
              className="w-full h-11 rounded-full bg-main-x text-white text-base font-semibold"
              onClick={onClose}
            >
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

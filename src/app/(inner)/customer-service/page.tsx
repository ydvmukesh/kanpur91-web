"use client";

import { InnerHeader } from "@/components/Ui";
import { useStore } from "@/lib/store";
import { IconHeadset } from "@/components/Icons";

export default function CSPage() {
  const { t, showToast } = useStore();
  const items = [
    { title: "Online service", sub: "24/7" },
    { title: "Telegram", sub: "@91club" },
    { title: "WhatsApp", sub: "+91 **** ****" },
  ];
  return (
    <div className="min-h-dvh bg-bg-l1">
      <InnerHeader title={t("customerService")} />
      <div className="p-3 space-y-2">
        {items.map((i) => (
          <button
            key={i.title}
            type="button"
            onClick={() => showToast(t("comingSoon"))}
            className="w-full bg-white rounded-xl p-4 flex items-center gap-3 text-left"
          >
            <span className="h-10 w-10 rounded-full bg-red-soft text-main grid place-items-center">
              <IconHeadset />
            </span>
            <span>
              <p className="font-semibold text-sm">{i.title}</p>
              <p className="text-xs text-l2">{i.sub}</p>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

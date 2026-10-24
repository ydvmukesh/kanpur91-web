"use client";

import { InnerShell } from "@/components/layout/InnerShell";
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
    <InnerShell title={t("customerService")}>
      <div className="p-3 space-y-2">
        {items.map((i) => (
          <button
            key={i.title}
            type="button"
            onClick={() => showToast(t("comingSoon"))}
            className="w-full bg-white rounded-xl p-4 flex items-center gap-3 text-left"
          >
            <span className="h-10 w-10 rounded-full bg-main-x text-main grid place-items-center">
              <IconHeadset />
            </span>
            <span>
              <p className="font-semibold text-sm">{i.title}</p>
              <p className="text-xs text-muted">{i.sub}</p>
            </span>
          </button>
        ))}
      </div>
    </InnerShell>
  );
}

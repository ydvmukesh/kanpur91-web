"use client";

import Link from "next/link";
import { InnerHeader } from "@/components/Ui";
import { IconChevron } from "@/components/Icons";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const { t, user } = useStore();
  if (!user) return null;
  return (
    <div className="min-h-dvh bg-bg-l1">
      <InnerHeader title={t("settings")} />
      <div className="m-3 bg-white rounded-xl overflow-hidden">
        {[
          { href: "/change-password", label: t("changePassword") },
          { href: "/bind-card", label: t("bindCard") },
          { href: "/language", label: t("language") },
        ].map((r) => (
          <Link key={r.href} href={r.href} className="flex items-center justify-between h-12 px-4 border-b border-line last:border-0 text-sm">
            {r.label}
            <span className="text-l3">
              <IconChevron />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

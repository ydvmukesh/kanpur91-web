"use client";

import Link from "next/link";
import { ChevronRight, Shield, ShieldCheck, TriangleAlert } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { useI18n } from "@/hooks/useI18n";
import { IMG, ImgIcon } from "@/lib/img";

const ROWS = [
  {
    href: "/main/About/ConfidentialityAgreement",
    labelKey: "confidentialityAgreement" as const,
    Icon: ShieldCheck,
  },
  {
    href: "/main/About/RiskDisclosureAgreement",
    labelKey: "riskDisclosure" as const,
    Icon: TriangleAlert,
  
  },
];

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <InnerShell title={t("about")} headerClassName="bg-main-x">
      <ImgIcon src={IMG.aboutBg} className="block w-full" />
      <div className="px-4">
        {ROWS.map((row) => {
          const Icon = row.Icon;
          return (
            <Link
              key={row.labelKey}
              href={row.href}
              className="flex items-center gap-1 border-b border-line py-4"
            >
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-main"
              >
                <Icon className="size-6" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 text-bse text-ink">{t(row.labelKey)}</span>
              <ChevronRight className="h-6 w-6 shrink-0 text-muted" strokeWidth={1.5} />
            </Link>
          );
        })}
      </div>
    </InnerShell>
  );
}

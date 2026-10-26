"use client";

import Link from "next/link";
import { useUpdateMeMutation } from "@/hooks/mutations/useWalletMutations";
import { useWallet } from "@/hooks/useWallet";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { IconEye } from "@/components/Icons";

const actions = [
  { href: "/wallet/deposit", labelKey: "deposit" as const, bg: "#FFEBEC", icon: "↓" },
  { href: "/wallet/withdraw", labelKey: "withdraw" as const, bg: "#DAFFEB", icon: "↑" },
  { href: "/wallet/depositHistory", labelKey: "depositHistory" as const, bg: "#FFF4E5", icon: "📄" },
  { href: "/wallet/withdrawHistory", labelKey: "withdrawHistory" as const, bg: "#EEE8FF", icon: "📑" },
];

export default function WalletPage() {
  const { t, showToast } = useStore();
  const { user, recycle } = useWallet();
  const updateMe = useUpdateMeMutation();
  if (!user) return null;
  const total = user.balance + user.thirdParty;

  return (
    <div>
      <header className="bg-main-y text-white px-4 pt-[calc(1rem+env(safe-area-inset-top,0px))] pb-10">
        <p className="text-xs text-white/80">{t("totalBalance")}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-3xl font-extrabold">₹{user.hideBalance ? "****" : formatMoney(total)}</p>
          <button type="button" onClick={() => updateMe.mutate({ hideBalance: !user.hideBalance })}>
            <IconEye off={user.hideBalance} />
          </button>
        </div>
      </header>
      <div className="-mt-6 mx-3 bg-white rounded-xl p-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-bg-l3 p-3">
            <p className="text-xs text-muted">{t("mainWallet")}</p>
            <p className="font-bold text-lg mt-1">₹{formatMoney(user.balance)}</p>
          </div>
          <div className="rounded-xl bg-bg-l3 p-3">
            <p className="text-xs text-muted">{t("thirdWallet")}</p>
            <p className="font-bold text-lg mt-1">₹{formatMoney(user.thirdParty)}</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-3 w-full h-10 rounded-full bg-main-x text-white text-sm font-semibold"
          onClick={() => {
            recycle();
            showToast(t("recycled"));
          }}
        >
          {t("recycle")}
        </button>
        <div className="grid grid-cols-4 gap-2 mt-4">
          {actions.map((a) => (
            <Link key={a.href} href={a.href} className="flex flex-col items-center gap-1.5">
              <span className="h-12 w-12 rounded-xl grid place-items-center text-lg" style={{ background: a.bg }}>
                {a.icon}
              </span>
              <span className="text-10 text-center text-muted leading-tight">{t(a.labelKey)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

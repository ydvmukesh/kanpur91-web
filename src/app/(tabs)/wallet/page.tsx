"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { IconEye } from "@/components/Icons";

const actions = [
  { href: "/deposit", labelKey: "deposit" as const, bg: "#FFEBEC", icon: "↓" },
  { href: "/withdraw", labelKey: "withdraw" as const, bg: "#DAFFEB", icon: "↑" },
  { href: "/deposit-history", labelKey: "depositHistory" as const, bg: "#FFF4E5", icon: "📄" },
  { href: "/withdraw-history", labelKey: "withdrawHistory" as const, bg: "#EEE8FF", icon: "📑" },
];

export default function WalletPage() {
  const { t, user, updateUser, recycle, showToast } = useStore();
  if (!user) return null;
  const total = user.balance + user.thirdParty;

  return (
    <div>
      <header className="bg-main-y text-white px-4 pt-4 pb-10">
        <p className="text-xs text-white/80">{t("totalBalance")}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-3xl font-extrabold">₹{user.hideBalance ? "****" : formatMoney(total)}</p>
          <button type="button" onClick={() => updateUser({ hideBalance: !user.hideBalance })}>
            <IconEye off={user.hideBalance} />
          </button>
        </div>
      </header>
      <div className="-mt-6 mx-3 bg-white rounded-xl p-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-bg-l3 p-3">
            <p className="text-xs text-l2">{t("mainWallet")}</p>
            <p className="font-bold text-lg mt-1">₹{formatMoney(user.balance)}</p>
          </div>
          <div className="rounded-xl bg-bg-l3 p-3">
            <p className="text-xs text-l2">{t("thirdWallet")}</p>
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
              <span className="text-[10px] text-center text-l2 leading-tight">{t(a.labelKey)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

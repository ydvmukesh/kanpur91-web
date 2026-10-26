"use client";

import Link from "next/link";
import { Circle, CircleCheck, Plus } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { useUpdateMeMutation } from "@/hooks/mutations/useWalletMutations";
import { useI18n } from "@/hooks/useI18n";
import { useWallet } from "@/hooks/useWallet";
import { listBanks, selectedBank } from "@/lib/banks";
import { maskAccount, maskPhone } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { BankAccount } from "@/lib/api/models";

export default function WithdrawBankcardPage() {
  const { t } = useI18n();
  const { user } = useWallet();
  const updateUser = useUpdateMeMutation();
  if (!user) return null;

  const cards = listBanks(user);
  const current = selectedBank(user);

  function select(card: BankAccount) {
    updateUser.mutate({ selectedBankId: card.id, bank: card });
  }

  return (
    <InnerShell title={t("bankAccount")} variant="light" className="bg-page">
      <div className="mx-3.5 mt-4 pb-8">
        <div className="space-y-3">
          {cards.map((card) => {
            const on = current?.id === card.id;
            const rows = [
              { k: t("bankName"), v: card.bankName },
              { k: t("bankAccountNumber"), v: maskAccount(card.account) },
              { k: t("phone"), v: maskPhone(user.phone) },
              { k: t("ifsCode"), v: card.ifsc },
            ];
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => select(card)}
                className="w-full text-left bg-white rounded-lg overflow-hidden"
              >
                <div className="h-10 bg-main-x" />
                <div className="space-y-1 p-2">
                  {rows.map((row) => (
                    <div key={row.k} className="flex items-center justify-between px-3 py-2 bg-bg-l3 text-xs font-medium">
                      <span className="text-muted">{row.k}</span>
                      <span className="text-ink">{row.v}</span>
                    </div>
                  ))}
                </div>
                <p className="flex items-center gap-1.5 px-3 py-3.5 text-[13px] text-ink">
                  {on ? (
                    <CircleCheck className="size-5.5 fill-main text-inverse" />
                  ) : (
                    <Circle className="size-5.5 text-faint" />
                  )}
                  {t("selectable")}
                </p>
              </button>
            );
          })}
        </div>

        <Link
          href="/wallet/withdraw/addbankcard"
          className={cn("bg-white rounded-lg min-h-[120px] grid place-items-center text-center px-4", cards.length > 0 && "mt-3")}
        >
          <span>
            <span className="mx-auto h-11 w-11 rounded-md border border-dashed border-disabled grid place-items-center">
              <Plus className="h-5 w-5 text-disabled" />
            </span>
            <span className="mt-3 block text-[13px] text-faint">{t("addBankAccount")}</span>
          </span>
        </Link>
      </div>
    </InnerShell>
  );
}

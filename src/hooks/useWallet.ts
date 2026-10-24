"use client";

import { useMe } from "@/hooks/queries/useMe";
import {
  useDepositMutation,
  useRecycleMutation,
  useRedeemGiftMutation,
  useWithdrawMutation,
} from "@/hooks/mutations/useWalletMutations";
import { errMsg } from "@/lib/query/sync";

export function useWallet() {
  const me = useMe();
  const depositMut = useDepositMutation();
  const withdrawMut = useWithdrawMutation();
  const recycleMut = useRecycleMutation();
  const giftMut = useRedeemGiftMutation();

  async function deposit(amount: number, method: string) {
    try {
      await depositMut.mutateAsync({ amount, method });
      return null;
    } catch (e) {
      return errMsg(e);
    }
  }

  async function withdraw(amount: number, method: string) {
    try {
      await withdrawMut.mutateAsync({ amount, method });
      return null;
    } catch (e) {
      return errMsg(e);
    }
  }

  function recycle() {
    recycleMut.mutate();
  }

  async function redeemGift(code: string) {
    try {
      await giftMut.mutateAsync(code);
      return null;
    } catch (e) {
      return errMsg(e);
    }
  }

  return { user: me.data ?? null, deposit, withdraw, recycle, redeemGift };
}

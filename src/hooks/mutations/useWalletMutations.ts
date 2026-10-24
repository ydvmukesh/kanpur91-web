"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/api/keys";
import { meApi } from "@/lib/api/resources/me";
import { walletApi } from "@/lib/api/resources/wallet";
import { prependTxn, writeUserCache } from "@/lib/query/sync";

export function useDepositMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ amount, method }: { amount: number; method: string }) =>
      walletApi.deposit(amount, method),
    onSuccess: ({ user, txn }) => {
      writeUserCache(qc, user);
      prependTxn(qc, txn);
      void qc.invalidateQueries({ queryKey: qk.txns("deposit") });
      void qc.invalidateQueries({ queryKey: qk.notifs });
    },
  });
}

export function useWithdrawMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ amount, method }: { amount: number; method: string }) =>
      walletApi.withdraw(amount, method),
    onSuccess: ({ user, txn }) => {
      writeUserCache(qc, user);
      prependTxn(qc, txn);
      void qc.invalidateQueries({ queryKey: qk.txns("withdraw") });
    },
  });
}

export function useRecycleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => walletApi.recycle(),
    onSuccess: (user) => writeUserCache(qc, user),
  });
}

export function useRedeemGiftMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => walletApi.redeemGift(code),
    onSuccess: (user) => writeUserCache(qc, user),
  });
}

export function useUpdateMeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: meApi.update,
    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: qk.me });
      const prev = qc.getQueryData(qk.me);
      qc.setQueryData(qk.me, (old: typeof prev) => (old && typeof old === "object" ? { ...old, ...patch } : old));
      return { prev };
    },
    onError: (_e, _p, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.me, ctx.prev);
    },
    onSuccess: (user) => writeUserCache(qc, user),
  });
}

export function useCheckInMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => meApi.checkIn(),
    onSuccess: (user) => writeUserCache(qc, user),
  });
}

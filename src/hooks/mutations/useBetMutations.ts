"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/api/keys";
import type { StoredBet, User } from "@/lib/api/models";
import { betsApi } from "@/lib/api/resources/bets";
import { writeBetsCache, writeUserCache } from "@/lib/query/sync";
import type { FiveBet } from "@/lib/fived";
import type { K3Bet } from "@/lib/k3";
import type { WinGoBetValue } from "@/lib/wingo";

function patchBetLists(qc: ReturnType<typeof useQueryClient>, bet: StoredBet) {
  const game = bet.game;
  const curGame = qc.getQueryData<StoredBet[]>(qk.bets(game)) ?? [];
  qc.setQueryData(qk.bets(game), [bet, ...curGame.filter((b) => b.id !== bet.id)]);
  const all = qc.getQueryData<StoredBet[]>(qk.bets()) ?? [];
  qc.setQueryData(qk.bets(), [bet, ...all.filter((b) => b.id !== bet.id)]);
}

export function usePlaceWinGoMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: {
      interval: number;
      period: string;
      bet: WinGoBetValue;
      amount: number;
      game?: "wingo" | "trx";
    }) => betsApi.placeWinGo(p.interval, p.period, p.bet, p.amount, p.game),
    onMutate: async (p) => {
      await qc.cancelQueries({ queryKey: qk.me });
      const prevMe = qc.getQueryData<User>(qk.me);
      if (prevMe) {
        writeUserCache(qc, { ...prevMe, balance: Number((prevMe.balance - p.amount).toFixed(2)) });
      }
      return { prevMe };
    },
    onError: (_e, _p, ctx) => {
      if (ctx?.prevMe) writeUserCache(qc, ctx.prevMe);
    },
    onSuccess: ({ user, bet }) => {
      writeUserCache(qc, user);
      patchBetLists(qc, bet);
    },
  });
}

export function usePlaceK3Mutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { interval: number; period: string; bet: K3Bet; amount: number }) =>
      betsApi.placeK3(p.interval, p.period, p.bet, p.amount),
    onMutate: async (p) => {
      const prevMe = qc.getQueryData<User>(qk.me);
      if (prevMe) writeUserCache(qc, { ...prevMe, balance: Number((prevMe.balance - p.amount).toFixed(2)) });
      return { prevMe };
    },
    onError: (_e, _p, ctx) => {
      if (ctx?.prevMe) writeUserCache(qc, ctx.prevMe);
    },
    onSuccess: ({ user, bet }) => {
      writeUserCache(qc, user);
      patchBetLists(qc, bet);
    },
  });
}

export function usePlaceFiveDMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { interval: number; period: string; bet: FiveBet; amount: number }) =>
      betsApi.placeFiveD(p.interval, p.period, p.bet, p.amount),
    onMutate: async (p) => {
      const prevMe = qc.getQueryData<User>(qk.me);
      if (prevMe) writeUserCache(qc, { ...prevMe, balance: Number((prevMe.balance - p.amount).toFixed(2)) });
      return { prevMe };
    },
    onError: (_e, _p, ctx) => {
      if (ctx?.prevMe) writeUserCache(qc, ctx.prevMe);
    },
    onSuccess: ({ user, bet }) => {
      writeUserCache(qc, user);
      patchBetLists(qc, bet);
    },
  });
}

export function applySettleCache(
  qc: ReturnType<typeof useQueryClient>,
  result: { changed: boolean; user: User | null; bets: StoredBet[] },
) {
  if (!result.changed) return;
  writeUserCache(qc, result.user);
  writeBetsCache(qc, result.bets);
}

import { apiFetch } from "@/lib/api/client";
import { USE_MOCK } from "@/lib/api/env";
import type { StoredBet, User } from "@/lib/api/models";
import { mockBets, mockPlaceFiveD, mockPlaceK3, mockPlaceWinGo, mockSettleDue } from "@/lib/api/mock/ops";
import type { FiveBet } from "@/lib/fived";
import type { K3Bet } from "@/lib/k3";
import type { WinGoBetValue } from "@/lib/wingo";

export const betsApi = {
  list(game?: "wingo" | "k3" | "5d" | "trx") {
    if (USE_MOCK) return Promise.resolve(mockBets(game));
    const q = game ? `?game=${game}` : "";
    return apiFetch<StoredBet[]>(`/bets${q}`);
  },
  placeWinGo(
    interval: number,
    period: string,
    bet: WinGoBetValue,
    amount: number,
    game: "wingo" | "trx" = "wingo",
  ) {
    if (USE_MOCK) return Promise.resolve(mockPlaceWinGo(interval, period, bet, amount, game));
    return apiFetch<{ user: User; bet: StoredBet }>("/bets/wingo", {
      method: "POST",
      body: JSON.stringify({ interval, period, bet, amount, game }),
    });
  },
  placeK3(interval: number, period: string, bet: K3Bet, amount: number) {
    if (USE_MOCK) return Promise.resolve(mockPlaceK3(interval, period, bet, amount));
    return apiFetch<{ user: User; bet: StoredBet }>("/bets/k3", {
      method: "POST",
      body: JSON.stringify({ interval, period, bet, amount }),
    });
  },
  placeFiveD(interval: number, period: string, bet: FiveBet, amount: number) {
    if (USE_MOCK) return Promise.resolve(mockPlaceFiveD(interval, period, bet, amount));
    return apiFetch<{ user: User; bet: StoredBet }>("/bets/5d", {
      method: "POST",
      body: JSON.stringify({ interval, period, bet, amount }),
    });
  },
  settleDue() {
    if (USE_MOCK) return Promise.resolve(mockSettleDue());
    return apiFetch<{ changed: boolean; user: User | null; bets: StoredBet[] }>("/bets/settle", {
      method: "POST",
    });
  },
};

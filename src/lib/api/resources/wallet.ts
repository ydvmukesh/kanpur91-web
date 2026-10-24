import { apiFetch } from "@/lib/api/client";
import { USE_MOCK } from "@/lib/api/env";
import type { Txn, User } from "@/lib/api/models";
import { mockDeposit, mockRecycle, mockRedeemGift, mockTxns, mockWithdraw } from "@/lib/api/mock/ops";

export const walletApi = {
  txns(type?: "deposit" | "withdraw") {
    if (USE_MOCK) return Promise.resolve(mockTxns(type));
    const q = type ? `?type=${type}` : "";
    return apiFetch<Txn[]>(`/txns${q}`);
  },
  deposit(amount: number, method: string) {
    if (USE_MOCK) return Promise.resolve(mockDeposit(amount, method));
    return apiFetch<{ user: User; txn: Txn }>("/wallet/deposit", {
      method: "POST",
      body: JSON.stringify({ amount, method }),
    });
  },
  withdraw(amount: number, method: string) {
    if (USE_MOCK) return Promise.resolve(mockWithdraw(amount, method));
    return apiFetch<{ user: User; txn: Txn }>("/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify({ amount, method }),
    });
  },
  recycle() {
    if (USE_MOCK) return Promise.resolve(mockRecycle());
    return apiFetch<User>("/wallet/recycle", { method: "POST" });
  },
  redeemGift(code: string) {
    if (USE_MOCK) return Promise.resolve(mockRedeemGift(code));
    return apiFetch<User>("/wallet/gift", { method: "POST", body: JSON.stringify({ code }) });
  },
};

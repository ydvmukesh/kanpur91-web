import { apiFetch } from "@/lib/api/client";
import { USE_MOCK } from "@/lib/api/env";
import type { User, WalletSnapshot } from "@/lib/api/models";
import { mockCheckIn, mockMe, mockUpdateMe, mockWallet } from "@/lib/api/mock/ops";

export const meApi = {
  get() {
    if (USE_MOCK) return Promise.resolve(mockMe());
    return apiFetch<User>("/me");
  },
  wallet() {
    if (USE_MOCK) return Promise.resolve(mockWallet());
    return apiFetch<WalletSnapshot>("/wallet");
  },
  update(patch: Partial<User>) {
    if (USE_MOCK) return Promise.resolve(mockUpdateMe(patch));
    return apiFetch<User>("/me", { method: "PATCH", body: JSON.stringify(patch) });
  },
  checkIn() {
    if (USE_MOCK) return Promise.resolve(mockCheckIn());
    return apiFetch<User>("/me/check-in", { method: "POST" });
  },
};

import { apiFetch } from "@/lib/api/client";
import { USE_MOCK } from "@/lib/api/env";
import type { Session } from "@/lib/api/models";
import { mockLogin, mockLogout, mockRegister, mockResetPassword } from "@/lib/api/mock/ops";

export const authApi = {
  login(account: string, password: string) {
    if (USE_MOCK) return Promise.resolve(mockLogin(account, password));
    return apiFetch<Session>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ account, password }),
    });
  },
  register(payload: { phone?: string; email?: string; password: string; invite?: string }) {
    if (USE_MOCK) return Promise.resolve(mockRegister(payload));
    return apiFetch<Session>("/auth/register", { method: "POST", body: JSON.stringify(payload) });
  },
  resetPassword(account: string, password: string) {
    if (USE_MOCK) {
      mockResetPassword(account, password);
      return Promise.resolve();
    }
    return apiFetch<void>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ account, password }),
    });
  },
  logout() {
    if (USE_MOCK) {
      mockLogout();
      return Promise.resolve();
    }
    return apiFetch<void>("/auth/logout", { method: "POST" });
  },
};

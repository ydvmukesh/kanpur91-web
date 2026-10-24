import { apiFetch } from "@/lib/api/client";
import { USE_MOCK } from "@/lib/api/env";
import type { AppNotification } from "@/lib/api/models";
import { mockMarkRead, mockNotifs } from "@/lib/api/mock/ops";

export const notifsApi = {
  list() {
    if (USE_MOCK) return Promise.resolve(mockNotifs());
    return apiFetch<AppNotification[]>("/notifications");
  },
  markRead() {
    if (USE_MOCK) return Promise.resolve(mockMarkRead());
    return apiFetch<AppNotification[]>("/notifications/read", { method: "POST" });
  },
};

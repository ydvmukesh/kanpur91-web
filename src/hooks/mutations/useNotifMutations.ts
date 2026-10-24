"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/api/keys";
import { notifsApi } from "@/lib/api/resources/notifs";

export function useMarkReadMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notifsApi.markRead(),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: qk.notifs });
      const prev = qc.getQueryData(qk.notifs);
      qc.setQueryData(qk.notifs, (old: typeof prev) =>
        Array.isArray(old) ? old.map((n) => ({ ...n, read: true })) : old,
      );
      return { prev };
    },
    onError: (_e, _p, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.notifs, ctx.prev);
    },
    onSuccess: (list) => qc.setQueryData(qk.notifs, list),
  });
}

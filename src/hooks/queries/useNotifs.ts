"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/keys";
import { notifsApi } from "@/lib/api/resources/notifs";
import { useToken } from "@/hooks/useToken";

export function useNotifs() {
  const token = useToken();
  return useQuery({
    queryKey: qk.notifs,
    queryFn: () => notifsApi.list(),
    enabled: Boolean(token),
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/keys";
import { betsApi } from "@/lib/api/resources/bets";
import { useToken } from "@/hooks/useToken";

export function useBets(game?: "wingo" | "k3" | "5d" | "trx") {
  const token = useToken();
  return useQuery({
    queryKey: qk.bets(game),
    queryFn: () => betsApi.list(game),
    enabled: Boolean(token),
  });
}

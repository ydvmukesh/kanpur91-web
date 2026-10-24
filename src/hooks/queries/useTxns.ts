"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/keys";
import { walletApi } from "@/lib/api/resources/wallet";
import { useToken } from "@/hooks/useToken";

export function useTxns(type?: "deposit" | "withdraw") {
  const token = useToken();
  return useQuery({
    queryKey: qk.txns(type),
    queryFn: () => walletApi.txns(type),
    enabled: Boolean(token),
  });
}

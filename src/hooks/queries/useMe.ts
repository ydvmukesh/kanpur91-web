"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/api/keys";
import { meApi } from "@/lib/api/resources/me";
import { useToken } from "@/hooks/useToken";

export function useMe() {
  const token = useToken();
  return useQuery({
    queryKey: qk.me,
    queryFn: () => meApi.get(),
    enabled: Boolean(token),
  });
}

export function useWalletBalance() {
  const token = useToken();
  return useQuery({
    queryKey: qk.wallet,
    queryFn: () => meApi.wallet(),
    enabled: Boolean(token),
  });
}

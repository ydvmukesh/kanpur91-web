"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/resources/auth";
import { clearToken, setToken } from "@/lib/api/token";
import { writeUserCache } from "@/lib/query/sync";
import { useStore } from "@/lib/store";

export function useLoginMutation() {
  const qc = useQueryClient();
  const { remember } = useStore();
  return useMutation({
    mutationFn: ({ account, password }: { account: string; password: string }) =>
      authApi.login(account, password),
    onSuccess: (session) => {
      setToken(session.token, remember ? "local" : "session");
      writeUserCache(qc, session.user);
    },
  });
}

export function useRegisterMutation() {
  const qc = useQueryClient();
  const { remember } = useStore();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (session) => {
      setToken(session.token, remember ? "local" : "session");
      writeUserCache(qc, session.user);
    },
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: ({ account, password }: { account: string; password: string }) =>
      authApi.resetPassword(account, password),
  });
}

export function useLogoutMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearToken();
      qc.clear();
    },
  });
}

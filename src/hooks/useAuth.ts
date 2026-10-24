"use client";

import { useEffect } from "react";
import { useMe } from "@/hooks/queries/useMe";
import { useToken } from "@/hooks/useToken";
import { ApiError } from "@/lib/api/client";
import { clearToken } from "@/lib/api/token";
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResetPasswordMutation,
} from "@/hooks/mutations/useAuthMutations";
import { errMsg } from "@/lib/query/sync";
import { useStore } from "@/lib/store";

export function useAuth() {
  const token = useToken();
  const { hydrated: storeReady } = useStore();
  const me = useMe();
  const loginMut = useLoginMutation();
  const registerMut = useRegisterMutation();
  const resetMut = useResetPasswordMutation();
  const logoutMut = useLogoutMutation();

  const user = me.data ?? null;
  const hydrated = storeReady && (!token || me.isFetched || me.isError);

  useEffect(() => {
    if (me.error instanceof ApiError && me.error.status === 401) clearToken();
  }, [me.error]);

  async function login(account: string, password: string) {
    try {
      await loginMut.mutateAsync({ account, password });
      return null;
    } catch (e) {
      return errMsg(e);
    }
  }

  async function register(payload: { phone?: string; email?: string; password: string; invite?: string }) {
    try {
      await registerMut.mutateAsync(payload);
      return null;
    } catch (e) {
      return errMsg(e);
    }
  }

  async function resetPassword(account: string, password: string) {
    try {
      await resetMut.mutateAsync({ account, password });
      return null;
    } catch (e) {
      return errMsg(e);
    }
  }

  function logout() {
    logoutMut.mutate();
  }

  return { user, hydrated, login, register, logout, resetPassword };
}

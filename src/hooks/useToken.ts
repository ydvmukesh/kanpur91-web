"use client";

import { useSyncExternalStore } from "react";
import { getToken, subscribeToken } from "@/lib/api/token";

export function useToken() {
  return useSyncExternalStore(subscribeToken, getToken, () => "");
}

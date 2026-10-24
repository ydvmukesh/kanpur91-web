"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { WS_URL } from "@/lib/api/env";
import { qk } from "@/lib/api/keys";
import type { AppNotification, StoredBet, Txn, User } from "@/lib/api/models";
import { getToken } from "@/lib/api/token";
import { writeBetsCache, writeUserCache } from "@/lib/query/sync";
import { useToken } from "./useToken";

type RealtimeEvent =
  | { type: "wallet.updated"; user: User }
  | { type: "bet.settled"; user: User; bets: StoredBet[] }
  | { type: "txn.updated"; txn: Txn }
  | { type: "notify.new"; notification: AppNotification };

export function useRealtime() {
  const qc = useQueryClient();
  const token = useToken();

  useEffect(() => {
    if (!WS_URL || !token) return;
    let socket: WebSocket | null = null;
    try {
      socket = new WebSocket(`${WS_URL}?token=${encodeURIComponent(getToken())}`);
    } catch {
      return;
    }

    socket.onmessage = (ev) => {
      try {
        const data = JSON.parse(String(ev.data)) as RealtimeEvent;
        if (data.type === "wallet.updated") writeUserCache(qc, data.user);
        if (data.type === "bet.settled") {
          writeUserCache(qc, data.user);
          writeBetsCache(qc, data.bets);
        }
        if (data.type === "txn.updated") {
          void qc.invalidateQueries({ queryKey: qk.txns(data.txn.type) });
        }
        if (data.type === "notify.new") {
          void qc.invalidateQueries({ queryKey: qk.notifs });
        }
      } catch {
        /* ignore bad frames */
      }
    };

    socket.onclose = () => {
      void qc.invalidateQueries({ queryKey: qk.me });
      void qc.invalidateQueries({ queryKey: qk.wallet });
    };

    return () => socket?.close();
  }, [qc, token]);
}

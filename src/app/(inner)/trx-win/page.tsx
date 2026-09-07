"use client";

import { WinGoGame } from "@/components/games/WinGoGame";
import { useStore } from "@/lib/store";

export default function TrxWinPage() {
  const { t } = useStore();
  return <WinGoGame title={t("trxWin")} trx />;
}

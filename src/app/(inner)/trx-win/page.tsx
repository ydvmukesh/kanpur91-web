"use client";

import dynamic from "next/dynamic";
import { GameLoading } from "@/components/games/GameLoading";
import { useI18n } from "@/hooks/useI18n";

const WinGoGame = dynamic(
  () => import("@/components/games/WinGoGame").then((m) => ({ default: m.WinGoGame })),
  { ssr: false, loading: GameLoading },
);

export default function TrxWinPage() {
  const { t } = useI18n();
  return <WinGoGame title={t("trxWin")} trx />;
}

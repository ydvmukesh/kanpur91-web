"use client";

import { WinGoGame } from "@/components/games/WinGoGame";
import { useStore } from "@/lib/store";

export default function WinGoPage() {
  const { t } = useStore();
  return <WinGoGame title={t("winGo")} />;
}

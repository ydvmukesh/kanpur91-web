import type { DictKey } from "@/lib/i18n";

export type LaundryTabId = "all" | "lottery" | "casino" | "rummy" | "slots";

export type LaundryTab = {
  id: LaundryTabId;
  label: DictKey;
  icon: "all" | "lottery" | "video" | "chess" | "slot";
  pending: number;
};

export const LAUNDRY_TABS: LaundryTab[] = [
  { id: "all", label: "all", icon: "all", pending: 97 },
  { id: "lottery", label: "lottery", icon: "lottery", pending: 0 },
  { id: "casino", label: "casino", icon: "video", pending: 0 },
  { id: "rummy", label: "rummy", icon: "chess", pending: 0 },
  { id: "slots", label: "slots", icon: "slot", pending: 0 },
];

export const LAUNDRY_TODAY = 0;
export const LAUNDRY_TOTAL = 0;

export type LaundryRecord = {
  id: string;
  tab: LaundryTabId;
  amount: number;
  time: string;
};

export const LAUNDRY_RECORDS: LaundryRecord[] = [];

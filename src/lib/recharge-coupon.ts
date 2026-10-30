export type CouponTab = "unused" | "used" | "expired";

export type RechargeCoupon = {
  id: string;
  tab: CouponTab;
  percent: number;
  cap: number;
  code: string;
  channels: number;
  validUntil: string;
};

export const RECHARGE_COUPONS: RechargeCoupon[] = [
  {
    id: "c1",
    tab: "unused",
    percent: 2,
    cap: 2000,
    code: "AY9D3YG5WJLG",
    channels: 8,
    validUntil: "2026-10-27",
  },
  {
    id: "c2",
    tab: "used",
    percent: 2,
    cap: 2000,
    code: "AY9D3YG5WJLG",
    channels: 8,
    validUntil: "2026-10-27",
  },
  {
    id: "c3",
    tab: "expired",
    percent: 2,
    cap: 2000,
    code: "AY9D3YG5WJLG",
    channels: 8,
    validUntil: "2026-10-27",
  },
];

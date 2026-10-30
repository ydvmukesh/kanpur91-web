import { IMG } from "@/lib/img";

export const AVATARS = Array.from({ length: 20 }, (_, i) => `/main/avatar/${i + 1}.png`);

export function userAvatar(user: { avatar?: string }) {
  return user.avatar || IMG.vipAvatar;
}

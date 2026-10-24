import { z } from "zod";

export const phoneSchema = z.string().regex(/^\d{10}$/);
export const passwordSchema = z.string().min(6);
export const emailSchema = z.string().email();

export const depositAmountSchema = z.number().finite().min(100);
export const withdrawAmountSchema = z.number().finite().min(110).max(99_999_999_999);

export function isPhone(value: string) {
  return phoneSchema.safeParse(value.trim()).success;
}

export function isEmail(value: string) {
  return emailSchema.safeParse(value.trim()).success;
}

export function isPassword(value: string) {
  return passwordSchema.safeParse(value).success;
}

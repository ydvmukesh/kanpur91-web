import { cn } from "@/lib/cn";

export type FieldVariant = "sheet" | "pill" | "line";

export const FIELD_H = "h-[var(--field-h)]";

export function fieldSurface(variant: FieldVariant = "sheet") {
  if (variant === "line") {
    return "flex items-center gap-3 h-12 px-3 rounded-lg bg-bg-l3 border border-transparent focus-within:border-main/40";
  }
  return cn(
    FIELD_H,
    "bg-white text-13 text-ink placeholder:text-faint outline-none shadow-field",
    variant === "pill" ? "rounded-full" : "rounded-[10px]",
  );
}

export function fieldInput(variant: FieldVariant = "sheet", extra?: string) {
  if (variant === "line") {
    return cn("flex-1 min-w-0 bg-transparent outline-none text-sm text-ink placeholder:text-faint", extra);
  }
  return cn(fieldSurface(variant), "w-full min-w-0 px-4", extra);
}

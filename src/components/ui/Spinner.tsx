import { cn } from "@/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-10 w-10 rounded-full border-2 border-main/25 border-t-main animate-spin",
        className,
      )}
      aria-label="Loading"
    />
  );
}

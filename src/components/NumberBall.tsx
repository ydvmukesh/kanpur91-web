"use client";

import { WINGO_BALLS, ImgIcon } from "@/lib/img";
import { cn } from "@/lib/cn";

export function NumberBall({
  n,
  size = 36,
  className,
}: {
  n: number;
  size?: number;
  className?: string;
}) {
  const src = WINGO_BALLS[((n % 10) + 10) % 10];
  return (
    <span className={cn("inline-block shrink-0", className)} style={{ width: size, height: size }}>
      <ImgIcon src={src} alt={String(n)} className="h-full w-full object-contain" />
    </span>
  );
}

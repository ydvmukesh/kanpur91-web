"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Circle, CircleCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import type { GameVendor } from "@/lib/games/catalog";
import { ImgIcon } from "@/lib/img";

export function VendorPicker({
  vendors,
  value,
  onChange,
}: {
  vendors: GameVendor[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = vendors.find((v) => v.id === value) ?? vendors[0];
  if (!current) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-3 h-10 w-full rounded-lg bg-white px-4 flex items-center justify-between text-sm text-ink"
      >
        <span className="font-medium">{current.name}</span>
        <ChevronDown className="size-5 text-muted shrink-0" />
      </button>

      {open && mounted
        ? createPortal(
        <div className="fixed inset-0 z-50 flex justify-center">
          <div className="relative w-full max-w-[25rem] h-full">
            <button type="button" className="absolute inset-0 bg-black/55" onClick={() => setOpen(false)} />
            <div className="absolute inset-x-0 bottom-0 max-h-[80%] bg-white rounded-t-2xl animate-[sheet-up_280ms_ease-out] flex flex-col">
              <div className="phone-scroll overflow-y-auto">
                {vendors.map((v) => {
                  const on = v.id === current.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onChange(v.id);
                        setOpen(false);
                      }}
                      className="w-full h-14 px-4 flex items-center gap-3 border-b border-line last:border-0"
                    >
                      {on ? (
                        <CircleCheck className="size-6 fill-main text-inverse shrink-0" />
                      ) : (
                        <Circle className="size-5 text-faint shrink-0" />
                      )}
                      <span className={cn("flex-1 text-left text-sm", on ? "text-ink font-medium" : "text-ink")}>
                        {v.name}
                      </span>
                      <ImgIcon src={v.logo} alt="" className="h-7 w-auto max-w-16 object-contain" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )
        : null}
    </>
  );
}

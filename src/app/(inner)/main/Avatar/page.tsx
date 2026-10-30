"use client";

import { CircleCheck } from "lucide-react";
import { InnerShell } from "@/components/layout/InnerShell";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { useUpdateMeMutation } from "@/hooks/mutations/useWalletMutations";
import { cn } from "@/lib/cn";
import { AVATARS, userAvatar } from "@/lib/avatars";
import { ImgIcon } from "@/lib/img";

export default function AvatarPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const updateUser = useUpdateMeMutation();
  if (!user) return null;
  const current = userAvatar(user);

  return (
    <InnerShell title={t("changeAvatar")} variant="light">
      <div className="grid grid-cols-3 gap-2.5 px-3 pb-10 pt-3">
        {AVATARS.map((src) => {
          const on = current === src;
          return (
            <button
              key={src}
              type="button"
              onClick={() => updateUser.mutate({ avatar: src })}
              className={cn(
                "relative overflow-hidden rounded-lg border-2",
                on ? "border-main" : "border-transparent",
              )}
            >
              <ImgIcon src={src} className="aspect-square w-full object-cover" />
              {on ? (
                <CircleCheck className="absolute right-1 bottom-1 size-5 fill-main text-inverse" />
              ) : null}
            </button>
          );
        })}
      </div>
    </InnerShell>
  );
}

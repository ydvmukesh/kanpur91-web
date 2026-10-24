"use client";

import { useState } from "react";
import { IconEye } from "@/components/Icons";
import { TextField } from "@/components/ui/TextField";
import type { FieldVariant } from "@/components/ui/styles";

export function PasswordField({
  label,
  icon,
  variant = "sheet",
  className,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label?: string;
  icon?: React.ReactNode;
  variant?: FieldVariant;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [hide, setHide] = useState(true);

  return (
    <TextField
      label={label}
      icon={icon}
      variant={variant}
      className={className}
      type={hide ? "password" : "text"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      suffix={
        <button type="button" onClick={() => setHide((v) => !v)} aria-label="Toggle password">
          <IconEye off={hide} />
        </button>
      }
    />
  );
}

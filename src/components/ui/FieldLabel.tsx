export function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="h-[18px] w-[18px] rounded-[4px] text-main grid place-items-center shrink-0">
      {children}
    </span>
  );
}

export function FieldLabel({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-1.5 text-13 text-ink font-medium mb-2">
      {icon ? <span className="text-main">{icon}</span> : null}
      {children}
    </label>
  );
}

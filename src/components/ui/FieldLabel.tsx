export function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="h-[1.125rem] w-[1.125rem] rounded-[0.25rem] text-main grid place-items-center shrink-0">
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
    <label className="flex items-center gap-1.5 text-sm text-ink font-medium mb-2">
      {icon ? <span className="inline-flex shrink-0 text-main [&_svg]:size-5">{icon}</span> : null}
      {children}
    </label>
  );
}

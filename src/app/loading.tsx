import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="min-h-dvh grid place-items-center bg-bg-l1">
      <Spinner />
    </div>
  );
}

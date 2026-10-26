"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-dvh bg-page grid place-items-center px-6">
      <div className="text-center">
        <p className="text-lg font-semibold text-ink">Something went wrong</p>
        <p className="text-sm text-muted mt-2">Please try again.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 h-11 px-6 rounded-sm bg-main-x text-white text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

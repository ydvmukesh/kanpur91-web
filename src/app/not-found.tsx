import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-page grid place-items-center px-6">
      <div className="text-center">
        <p className="text-lg font-semibold text-ink">Page not found</p>
        <Link
          href="/"
          className="mt-5 inline-flex h-11 px-6 items-center rounded-full bg-main-x text-white text-sm font-semibold"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

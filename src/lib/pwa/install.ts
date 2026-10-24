type BeforeInstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferred: BeforeInstallPrompt | null = null;
let booted = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

function onBeforeInstall(event: Event) {
  event.preventDefault();
  deferred = event as BeforeInstallPrompt;
  emit();
}

export function subscribePwa(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function canPromptPwa() {
  return Boolean(deferred);
}

export function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

export function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function bootPwa() {
  if (booted || typeof window === "undefined") return;
  booted = true;

  window.addEventListener("beforeinstallprompt", onBeforeInstall);
  window.addEventListener("appinstalled", () => {
    deferred = null;
    emit();
  });

  if ("serviceWorker" in navigator) {
    void navigator.serviceWorker.register("/sw.js");
  }
}

if (typeof window !== "undefined") {
  bootPwa();
}

export async function promptPwaInstall() {
  if (isStandalone()) return "installed" as const;
  if (isIos()) return "ios" as const;
  if (!deferred) return "unavailable" as const;
  await deferred.prompt();
  const { outcome } = await deferred.userChoice;
  deferred = null;
  emit();
  return outcome;
}

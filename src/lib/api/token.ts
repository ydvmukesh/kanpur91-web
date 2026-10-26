const LS = "kanpur91-token";
const SS = "kanpur91-token";

let memory = "";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function getToken() {
  if (memory) return memory;
  if (typeof window === "undefined") return "";
  memory = window.localStorage.getItem(LS) || window.sessionStorage.getItem(SS) || "";
  return memory;
}

export function setToken(token: string, persist: "local" | "session") {
  memory = token;
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LS);
  window.sessionStorage.removeItem(SS);
  if (persist === "local") window.localStorage.setItem(LS, token);
  else window.sessionStorage.setItem(SS, token);
  emit();
}

export function clearToken() {
  memory = "";
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LS);
    window.sessionStorage.removeItem(SS);
  }
  emit();
}

export function subscribeToken(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

const expireListeners = new Set<() => void>();
let expireLock = false;

export function notifyTokenExpired() {
  if (expireLock) return;
  expireLock = true;
  clearToken();
  expireListeners.forEach((fn) => fn());
  if (typeof window !== "undefined") {
    window.setTimeout(() => {
      expireLock = false;
    }, 2500);
  } else {
    expireLock = false;
  }
}

export function subscribeTokenExpired(fn: () => void) {
  expireListeners.add(fn);
  return () => {
    expireListeners.delete(fn);
  };
}

export function formatMoney(n: number, digits = 2) {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function uidFromPhone(phone: string) {
  const n = phone.replace(/\D/g, "").slice(-8).padStart(8, "0");
  return `91${n}`;
}

export function copyText(text: string) {
  return navigator.clipboard.writeText(text);
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function nowStamp() {
  const d = new Date();
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  const h = pad2(d.getHours());
  const min = pad2(d.getMinutes());
  const s = pad2(d.getSeconds());
  return `${y}-${m}-${day} ${h}:${min}:${s}`;
}

export function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

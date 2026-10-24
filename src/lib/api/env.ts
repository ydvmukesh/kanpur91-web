export const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL?.replace(/\/+$/, "") ?? "";
export const USE_MOCK = !API_URL;

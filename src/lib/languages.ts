import type { Lang } from "@/lib/i18n";

export const LANGUAGES: { id: Lang; name: string; flag: "us" | "in" }[] = [
  { id: "en", name: "English", flag: "us" },
  { id: "hd", name: "हिंदी", flag: "in" },

];

export function languageName(lang: Lang) {
  return LANGUAGES.find((item) => item.id === lang)?.name ?? LANGUAGES[0].name;
}

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar/public.json";
import en from "./locales/en/public.json";
import arSupplemental from "./locales/ar/supplemental.generated.json";
import enSupplemental from "./locales/en/supplemental.generated.json";

export const supportedLocales = ["ar", "en"] as const;
export type Locale = (typeof supportedLocales)[number];

export function isLocale(value: string | undefined): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function localeFromPath(pathname = window.location.pathname): Locale {
  const candidate = pathname.split("/").filter(Boolean)[0];
  return isLocale(candidate) ? candidate : "ar";
}

void i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: { ...ar, ...arSupplemental } },
    en: { translation: { ...en, ...enSupplemental } },
  },
  lng: localeFromPath(),
  fallbackLng: "ar",
  supportedLngs: supportedLocales,
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export function tr(key: string, values?: Record<string, unknown>): string {
  return i18n.t(key, values);
}

export default i18n;

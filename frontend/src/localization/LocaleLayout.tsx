import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import i18n, { isLocale, type Locale } from "@/i18n";
import SeoManager from "./SeoManager";

interface LocaleContextValue {
  locale: Locale;
  direction: "rtl" | "ltr";
  localePath: (path: string) => string;
  switchLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleLayout");
  return context;
}

function prefixPath(path: string, locale: Locale): string {
  if (!path || path === "/") return `/${locale}`;
  if (/^\/(ar|en)(?:\/|$)/.test(path)) {
    return path.replace(/^\/(ar|en)(?=\/|$)/, `/${locale}`);
  }
  if (path.startsWith("#")) return `/${locale}${path}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function LocaleLayout({ children }: { children: ReactNode }) {
  const { locale: localeParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const invalidLocale = !isLocale(localeParam);
  const locale: Locale = isLocale(localeParam) ? localeParam : "ar";
  const direction: "rtl" | "ltr" = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    document.body.dir = direction;
    localStorage.setItem("preferredLocale", locale);
    const manifest = document.head.querySelector('link[rel="manifest"]');
    manifest?.setAttribute("href", locale === "en" ? "/manifest-en.json" : "/manifest.json");
  }, [direction, locale]);

  const localePath = useCallback(
    (path: string) => prefixPath(path, locale),
    [locale],
  );

  const switchLocale = useCallback(() => {
    const nextLocale: Locale = locale === "ar" ? "en" : "ar";
    const nextPath = prefixPath(location.pathname, nextLocale);
    localStorage.setItem("preferredLocale", nextLocale);
    void i18n.changeLanguage(nextLocale).then(() => {
      navigate(`${nextPath}${location.search}${location.hash}`);
    });
  }, [locale, location.hash, location.pathname, location.search, navigate]);

  // Keep legacy absolute links inside components on the active locale.
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const anchor = (event.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (/^\/(ar|en)(?:\/|$)/.test(url.pathname) || url.pathname.startsWith("/admin")) return;
      if (!url.pathname.startsWith("/")) return;

      event.preventDefault();
      navigate(`${prefixPath(url.pathname, locale)}${url.search}${url.hash}`);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [locale, navigate]);

  const value = useMemo(
    () => ({ locale, direction, localePath, switchLocale }),
    [direction, locale, localePath, switchLocale],
  );

  if (invalidLocale) {
    return <Navigate to="/ar" replace />;
  }

  return (
    <LocaleContext.Provider key={locale} value={value}>
      <SeoManager />
      {children}
    </LocaleContext.Provider>
  );
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLocale } from "./LocaleLayout";

const siteUrl = (import.meta.env.VITE_SITE_URL || "https://smartagency-ye.com").replace(/\/$/, "");

const seoCopy = {
  ar: {
    home: ["وكالة سمارت للحلول الرقمية والتسويقية", "حلول رقمية متكاملة لتطوير المواقع والتطبيقات والتسويق الرقمي والتصميم الإبداعي."],
    about: ["من نحن | وكالة سمارت", "تعرف على وكالة سمارت ورؤيتنا وقصتنا في تقديم الحلول الرقمية المبتكرة."],
    projects: ["أعمالنا | وكالة سمارت", "استكشف مشاريع وكالة سمارت ومنتجاتها الرقمية."],
    blog: ["المدونة | وكالة سمارت", "مقالات ورؤى عملية في التقنية والتصميم والمنتجات الرقمية."],
    quote: ["اطلب عرض سعر | وكالة سمارت", "ابدأ مشروعك الرقمي واحصل على استشارة وعرض سعر مناسب."],
    contact: ["تواصل معنا | وكالة سمارت", "تواصل مع فريق وكالة سمارت لمناقشة مشروعك الرقمي."],
    bot: ["Smart Bot | وكالة سمارت", "مساعد ذكي لأعمالك وخدمة عملائك."],
  },
  en: {
    home: ["Smart Agency | Digital Solutions", "Integrated digital solutions for websites, apps, digital marketing, and creative design."],
    about: ["About Us | Smart Agency", "Meet Smart Agency and learn about our vision, story, and innovative digital solutions."],
    projects: ["Our Work | Smart Agency", "Explore Smart Agency projects and digital products."],
    blog: ["Blog | Smart Agency", "Practical insights on technology, design, and digital products."],
    quote: ["Request a Quote | Smart Agency", "Start your digital project with a tailored consultation and quote."],
    contact: ["Contact Us | Smart Agency", "Contact the Smart Agency team to discuss your digital project."],
    bot: ["Smart Bot | Smart Agency", "An intelligent assistant for your business and customers."],
  },
} as const;

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
}

function upsertLink(hreflang: string, href: string, canonical = false) {
  const selector = canonical
    ? 'link[rel="canonical"]'
    : `link[rel="alternate"][hreflang="${hreflang}"]`;
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }
  element.rel = canonical ? "canonical" : "alternate";
  if (!canonical) element.hreflang = hreflang;
  element.href = href;
}

export default function SeoManager() {
  const { locale } = useLocale();
  const { pathname } = useLocation();

  useEffect(() => {
    const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, "") || "/";
    const segment = pathWithoutLocale.split("/").filter(Boolean)[0] || "home";
    const key = (segment in seoCopy[locale] ? segment : segment === "projects" ? "projects" : segment === "blog" ? "blog" : "home") as keyof typeof seoCopy.ar;
    const [title, description] = seoCopy[locale][key];
    const canonical = `${siteUrl}/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
    const arUrl = `${siteUrl}/ar${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
    const enUrl = `${siteUrl}/en${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;

    document.title = title;
    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: locale === "ar" ? "ar_YE" : "en_US" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertLink("", canonical, true);
    upsertLink("ar", arUrl);
    upsertLink("en", enUrl);
    upsertLink("x-default", arUrl);

    const schemaId = "localized-organization-schema";
    let schema = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!schema) {
      schema = document.createElement("script");
      schema.id = schemaId;
      schema.type = "application/ld+json";
      document.head.appendChild(schema);
    }
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: locale === "ar" ? "وكالة سمارت" : "Smart Agency",
      url: canonical,
      description,
    });
  }, [locale, pathname]);

  return null;
}

export const SUPPORTED_LOCALES = ['ar', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

interface LocaleRequest {
  query?: { lang?: unknown };
  headers?: { 'accept-language'?: string | string[] };
}

const hasContent = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return (
    typeof value === 'string' &&
    SUPPORTED_LOCALES.includes(value as SupportedLocale)
  );
}

export function resolveLocale(request: LocaleRequest): SupportedLocale {
  const queryLocale = Array.isArray(request.query?.lang)
    ? request.query.lang[0]
    : request.query?.lang;

  if (isSupportedLocale(queryLocale)) return queryLocale;

  const acceptLanguage = request.headers?.['accept-language'];
  const requested = (
    Array.isArray(acceptLanguage) ? acceptLanguage[0] : acceptLanguage
  )
    ?.split(',')
    .map((part) => part.trim().split(';')[0].toLowerCase().split('-')[0])
    .find(isSupportedLocale);

  return requested ?? 'ar';
}

function toPlainObject(value: unknown): unknown {
  if (value && typeof value === 'object') {
    const toObject = (value as Record<string, unknown>).toObject;
    if (typeof toObject === 'function') {
      return (toObject as () => unknown).call(value);
    }
  }
  return value;
}

/** Converts Arabic + `*En` CMS records into the stable public response shape. */
export function localizePublicData<T>(input: T, locale: SupportedLocale): T {
  const plain = toPlainObject(input);

  if (Array.isArray(plain)) {
    const items = plain as unknown[];
    return items.map((item) =>
      localizePublicData(item, locale),
    ) as unknown as T;
  }

  if (!plain || typeof plain !== 'object' || plain instanceof Date) {
    return plain as T;
  }

  const source = plain as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, rawValue] of Object.entries(source)) {
    if (key.endsWith('En')) continue;

    const englishValue = source[`${key}En`];
    const preferred = locale === 'en' ? englishValue : rawValue;
    const fallback = locale === 'en' ? rawValue : englishValue;
    const selected = hasContent(preferred) ? preferred : fallback;
    result[key] = localizePublicData(selected, locale);
  }

  for (const [key, value] of Object.entries(source)) {
    if (!key.endsWith('En')) continue;
    const baseKey = key.slice(0, -2);
    if (!(baseKey in result) && hasContent(value)) {
      result[baseKey] = localizePublicData(value, locale);
    }
  }

  return result as T;
}

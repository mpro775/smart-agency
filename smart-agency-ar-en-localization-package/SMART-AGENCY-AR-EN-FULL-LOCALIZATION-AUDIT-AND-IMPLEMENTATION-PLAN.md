# Smart Agency — Full Arabic / English Localization Audit & Implementation Plan

**Project:** Smart Agency Website  
**Scope reviewed:** React/Vite frontend + Admin frontend + NestJS/Mongoose backend + exported MongoDB data  
**Target locales:** `ar`, `en`  
**Decision:** Arabic remains the current/default content baseline for backward compatibility; English is added as explicit `*En` content fields. UI literals move to locale resources. Machine codes, relations, media, numbers, booleans, and URLs remain shared unless the URL itself is locale-specific SEO metadata.

---

## 1. Executive summary

The current project is **not localized at the architecture level**. Arabic exists in all of the following layers:

1. Public React UI as hard-coded strings.
2. Admin UI as hard-coded strings.
3. Database-backed public CMS content.
4. DTO/Swagger examples in the backend.
5. A legacy `frontend/src/data` content layer.
6. Some user-entered / operational records such as leads and names.

The public frontend also hard-codes RTL in multiple components, while the router currently has non-localized routes such as `/about`, `/projects`, `/blog`, `/quote`, and `/contact`. The homepage query is cached under a language-neutral key (`["public-homepage"]`) and calls `/public/homepage` without locale context. Therefore, adding only a language switcher would be insufficient and could produce stale/mixed Arabic/English content.

### Audit inventory

| Source type | Unique Arabic text items | Required treatment |
|---|---:|---|
| Public frontend static UI | 444 | Move to public i18n resources |
| Admin frontend static UI | 687 | Move to admin i18n resources if admin is bilingual |
| Legacy `frontend/src/data` | 95 | Verify unused → remove; otherwise localize/move to CMS |
| Backend source examples | 75 | Translate examples only where exposed/documented |
| Public CMS/database content | 981 | Add English content fields and migrate translations |
| Operational/user-entered DB data | 38 | Preserve original input; do **not** create translated copies |
| **Total** | **2,320** | **2,320 English proposals completed** |

The attached CSV and JSON inventory contain every extracted item, its source, context/field, Arabic source text, proposed English translation, and the appropriate treatment.

---

## 2. Important findings from the source code

### 2.1 No i18n framework currently exists

Neither the frontend nor backend package configuration contains a localization layer such as `i18next` / `react-i18next`. The public interface is built as a single-language Arabic experience.

### 2.2 Routing is language-neutral today

`frontend/src/main.tsx` defines routes including:

- `/about`
- `/projects`
- `/projects/:id`
- `/blog`
- `/blog/:slug`
- `/quote`
- `/contact`

For complete bilingual support, locale must become part of the route identity.

### 2.3 RTL is hard-coded in many public components

Examples include:

- `frontend/src/components/Navbar.tsx`
- `frontend/src/components/Technologies.tsx`
- `frontend/src/components/Team.tsx`
- multiple `frontend/src/components/blog/*` components
- multiple `frontend/src/components/about/*` components

Many elements explicitly use `dir="rtl"`. This must be replaced with document-level locale direction and only overridden locally when genuinely required.

### 2.4 Homepage API/cache is not locale-aware

Current public homepage flow:

- `frontend/src/App.tsx` uses `queryKey: ["public-homepage"]`
- `frontend/src/services/homepage.service.ts` requests `/public/homepage`
- `backend/src/public-homepage/public-homepage.controller.ts` calls `getHomepage()` without locale context

This must change so Arabic and English responses are isolated in both HTTP requests and frontend caches.

### 2.5 Largest public hard-coded UI sources

The highest-density files include:

- `frontend/src/pages/quote.tsx` — ~100 unique Arabic literals
- `frontend/src/pages/contact.tsx` — ~42
- `frontend/src/components/FAQs.tsx` — ~37
- `frontend/src/components/Services.tsx` — ~34
- `frontend/src/components/HostingPackages.tsx` — ~33
- `frontend/src/components/Technologies.tsx` — ~33
- `frontend/src/components/Footer.tsx` — ~17

### 2.6 Largest admin hard-coded sources

The main admin localization hotspots include:

- `frontend/src/admin/pages/about/AboutForm.tsx` — ~138 unique Arabic literals
- `frontend/src/admin/components/shared/RichTextEditor.tsx` — ~102
- `frontend/src/admin/pages/leads/LeadsList.tsx` — ~93
- `frontend/src/admin/pages/blog/BlogForm.tsx` — ~48
- `frontend/src/admin/pages/team/TeamForm.tsx` — ~41
- `frontend/src/admin/pages/hosting/HostingForm.tsx` — ~34
- `frontend/src/admin/pages/projects/ProjectForm.tsx` — ~32

### 2.7 Legacy duplicate content layer

`frontend/src/data/` contains:

- `allProjects.ts`
- `blog-data.ts`
- `projects-data.ts`

The scan found 95 Arabic strings in these files and found no imports referencing them from `frontend/src`. They should be verified and removed if truly unused, rather than becoming a third localization source beside CMS + i18n resources.

---

## 3. Final localization architecture

### 3.1 Public routes

Use locale-prefixed routes:

```text
/ar
/en
/ar/about
/en/about
/ar/projects
/en/projects
/ar/projects/:slug
/en/projects/:slug
/ar/blog
/en/blog
/ar/blog/:slug
/en/blog/:slug
/ar/quote
/en/quote
/ar/contact
/en/contact
```

**Do not duplicate entity slugs only for translation.** Keep current locale-neutral slugs as stable identifiers. The locale prefix is what determines the content language.

Backward compatibility:

```text
/                  -> /ar
/about             -> /ar/about
/projects          -> /ar/projects
/projects/:slug    -> /ar/projects/:slug
/blog              -> /ar/blog
/blog/:slug        -> /ar/blog/:slug
/quote             -> /ar/quote
/contact           -> /ar/contact
```

Redirects should preserve query strings and hashes.

### 3.2 Locale resolution

Use this priority:

1. Route locale (`/ar` or `/en`) — authoritative.
2. Persisted user preference (cookie/localStorage) — used only for root redirect.
3. Browser language — optional for first visit.
4. Default: `ar`.

Never allow stored preference to silently override a locale explicitly present in the URL.

### 3.3 Direction and document language

At locale change:

```ts
document.documentElement.lang = locale;
document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
```

Remove component-level `dir="rtl"` wherever direction should naturally inherit.

Prefer CSS logical properties and direction-safe patterns:

- `margin-inline-*`
- `padding-inline-*`
- `inset-inline-*`
- `text-start` / `text-end`
- locale-aware arrow icons

Do not mirror logos, photos, screenshots, or icons that have intrinsic direction unless intentionally required.

---

## 4. Frontend i18n implementation

### 4.1 Library

Add:

- `i18next`
- `react-i18next`
- browser language detector only if needed for the first root redirect; the URL remains the source of truth

### 4.2 Recommended namespaces

```text
locales/
  ar/
    common.json
    nav.json
    home.json
    about.json
    services.json
    projects.json
    blog.json
    technologies.json
    team.json
    testimonials.json
    hosting.json
    faq.json
    quote.json
    contact.json
    bot.json
    errors.json
    admin.json
  en/
    ...same namespaces
```

Static interface text belongs here, not in MongoDB.

### 4.3 What belongs in i18n resources

Examples:

- navigation labels
- buttons
- loading/error/empty states
- form labels/placeholders/help text
- filters and sort labels
- enum display labels
- modal text
- validation presentation text
- table headers
- pagination labels
- accessibility labels where static

### 4.4 What belongs in MongoDB

Editorial/business-managed content:

- projects
- services
- About content
- blog content
- FAQs
- hosting marketing copy
- team biographies
- testimonials
- company address/working-hours display copy
- SEO copy

### 4.5 React Query cache isolation

Every public content query whose response changes by locale must include locale in its key.

Bad:

```ts
["public-homepage"]
["company-info"]
["blogs", page]
```

Required:

```ts
["public-homepage", locale]
["company-info", locale]
["blogs", locale, page, filters]
["project", locale, slug]
```

This prevents Arabic cache entries from being displayed after switching to English and vice versa.

### 4.6 API locale parameter

Public requests should send an explicit locale:

```http
GET /public/homepage?lang=en
GET /projects/:slug?lang=en
GET /blogs?lang=en
GET /faqs?lang=en
```

The explicit query parameter is recommended because the frontend controls the route locale and the API request should be deterministic. `Accept-Language` may be supported as a fallback, but it should not override `?lang=`.

### 4.7 Locale-aware formatting

Use `Intl` instead of hard-coded Arabic formatting:

```ts
new Intl.DateTimeFormat(locale === 'ar' ? 'ar-YE' : 'en-US', options)
new Intl.NumberFormat(...)
new Intl.RelativeTimeFormat(...)
```

Currency values remain numeric and shared. Only their formatting changes by locale.

---

## 5. Database decision: keep Arabic fields + add `*En`

For this project, the safest architecture is additive and backward-compatible:

```ts
@Prop({ required: true })
title: string;       // current Arabic content

@Prop()
titleEn?: string;    // English content
```

Do **not** rename all existing fields to `titleAr` during the first localization rollout. That would create a much wider breaking change across schemas, DTOs, services, admin forms, seeds, and public APIs.

Once the bilingual rollout is stable, the existing fields can remain the documented Arabic baseline indefinitely.

A full 58-row field matrix is attached separately. The important model changes are summarized below.

---

## 6. Exact database additions by model

### 6.1 About

Add English equivalents for all display/editorial fields:

- `hero.titleEn`
- `hero.subtitleEn`
- `hero.badgeEn`
- `hero.primaryButtonTextEn`
- `hero.secondaryButtonTextEn`
- `hero.trustBadgesEn[]`
- `visionEn`
- `missionEn`
- `approachEn`
- `story.titleEn`
- `story.descriptionEn`
- `story.painPointsEn[]`
- `story.closingStatementEn`
- `thinking[].titleEn`
- `thinking[].descriptionEn`
- `thinking[].resultEn`
- `differentiators[].titleEn`
- `differentiators[].descriptionEn`
- `differentiators[].badgeEn`
- `process[].titleEn`
- `process[].descriptionEn`
- `process[].deliverableEn`
- `values[].titleEn`
- `values[].descriptionEn`
- `values[].exampleEn`
- `stats[].labelEn`
- `stats[].suffixEn`
- `stats[].descriptionEn`
- `teamNote.titleEn`
- `teamNote.descriptionEn`
- `teamNote.highlightsEn[]`
- `cta.titleEn`
- `cta.descriptionEn`
- `cta.buttonTextEn`
- `cta.secondaryButtonTextEn`
- `seo.metaTitleEn`
- `seo.metaDescriptionEn`
- `seo.keywordsEn[]`

Shared: images, icons, numeric stat values, steps, button URLs, OG image, status flags.

### 6.2 Blog

Add:

- `titleEn`
- `contentEn`
- `excerptEn`
- `coverAltEn`
- `authorNameEn`
- `authorRoleEn`
- `tagsEn[]`
- `categoryEn`
- `categoryKey` as a stable non-localized filter code
- `summaryPointsEn[]`
- `ctaTitleEn`
- `ctaDescriptionEn`
- `ctaButtonTextEn`
- `readingTimeEn` computed from `contentEn`
- `seo.metaTitleEn`
- `seo.metaDescriptionEn`
- `seo.keywordsEn[]`
- `seo.canonicalUrlEn`
- `seo.ogTitleEn`
- `seo.ogDescriptionEn`
- `seo.twitterTitleEn`
- `seo.twitterDescriptionEn`

Shared: slug, images, author relation, contentType enum, publish flags, dates, numeric metrics, CTA URL.

The current text index must include English searchable fields as well.

### 6.3 CompanyInfo

Add:

- `addressEn`
- `workingHoursEn`

Shared:

- map URL
- email
- phone
- WhatsApp URL
- social URLs

### 6.4 FAQ

Add:

- `questionEn`
- `answerEn`
- `categoryEn`
- `categoryKey`

Use `categoryKey` for filtering. Do not use the Arabic or English display label as the database identity.

### 6.5 HostingPackage

Add:

- `nameEn`
- `descriptionEn`
- `featuresEn[]`
- `storageEn`
- `bandwidthEn`
- `ramEn`
- `cpuEn`
- `domainsEn`
- `benefitHintsEn`

Immediate implementation should use the fields above for compatibility. A later cleanup can normalize storage/bandwidth/RAM/CPU/domain limits into structured numeric/unlimited values so labels are generated by locale.

Shared: prices, currency, billing cycle, package category, active/popular/best-value flags, sort order, dates, package relationships.

### 6.6 ProjectCategory

Keep `value` as a **machine code**, not display content.

Normalize values to codes such as:

```text
website
mobile
 ecommerce
 automation
 other
 saas
```

Add:

- `labelEn`
- `descriptionEn`

The current exported value `ٍSaaS` should be corrected to `saas`.

### 6.7 Project

Add:

- `titleEn`
- `summaryEn`
- `challengeEn`
- `solutionEn`
- `results[].labelEn`
- `results[].valueEn`
- `featuresEn[]`
- `clientNameEn`
- `industryEn`
- `durationEn`
- `stats[].labelEn`
- `stats[].valueEn`
- `stats[].descriptionEn`
- `seo.metaTitleEn`
- `seo.metaDescriptionEn`
- `seo.keywordsEn[]`

Shared:

- `slug`
- technology relations
- category relations
- images/gallery
- project URL
- year
- logos
- video URL
- sort/featured orders
- boolean states

### 6.8 Service

Add:

- `titleEn`
- `descriptionEn`
- `featuresEn[]`
- `shortDescriptionEn`

Shared: slug, icon, icon type, gradient, active flag, sort order.

### 6.9 TeamMember

Add:

- `fullNameEn`
- `roleEn`
- `bioEn`
- `funFactEn`
- `specializationsEn[]`

Names must use the team member’s approved Latin spelling where possible rather than blind transliteration.

Shared: department enum, image, email, social URLs, visibility flags, order, project count, join date.

### 6.10 Technology

Technology names such as NestJS, React, PostgreSQL, Docker, etc. are canonical and should remain shared.

Add only:

- `descriptionEn`
- `tooltipEn`

Translate category labels in static i18n resources because the category itself is an enum/code.

### 6.11 Testimonial

Add:

- `clientNameEn`
- `positionEn`
- `companyNameEn`
- `contentEn`

Shared: logo/photo, rating, project relation, flags, order.

### 6.12 Leads, newsletter, users

Do **not** create translated duplicates of user input.

Do not add fields such as:

- `lead.fullNameEn`
- `lead.messageEn`
- `lead.notesEn`
- `user.nameEn`

Instead add:

```ts
locale: 'ar' | 'en'
```

for lead/newsletter submission context.

For admin users, optionally add:

```ts
preferredLocale: 'ar' | 'en'
```

only if the internal admin UI is bilingual.

---

## 7. Critical form-data correction in the quotation flow

`frontend/src/pages/quote.tsx` currently stores some project answers as literal Arabic strings:

```ts
updateProjectAnswer(q.key, "نعم")
updateProjectAnswer(q.key, "لا")
```

This creates language-dependent business data.

Required change:

- booleans → store `true` / `false`
- enumerated answers → store stable codes such as `android`, `ios`, `both`, `mvp`, `full_product`
- UI renders translated labels through i18n
- backend and admin render the code using the active UI language

This is essential for a genuinely bilingual system.

---

## 8. Backend implementation

### 8.1 Locale parser

Create one centralized locale resolver, for example:

```ts
export type SupportedLocale = 'ar' | 'en';
```

Resolution:

1. `?lang=` if valid
2. `Accept-Language` fallback
3. `ar`

Reject/normalize unsupported values; do not allow arbitrary locale strings to affect field selection.

### 8.2 Public serializers/mappers

Admin APIs should return both Arabic and English fields. Public APIs should return a **locale-normalized response** so frontend components can continue consuming `title`, `description`, etc.

Example:

```ts
function localizedValue<T>(ar: T, en: T | undefined, locale: 'ar' | 'en'): T {
  if (locale === 'en') return en ?? ar;
  return ar ?? en as T;
}
```

Public English response:

```json
{
  "title": "Web Design and Development",
  "description": "Integrated web solutions..."
}
```

not:

```json
{
  "title": "...Arabic...",
  "titleEn": "...English..."
}
```

This keeps public frontend components simple and prevents duplicated locale-selection logic in every component.

### 8.3 Fallback policy

During migration:

- `en` request: use English field; fallback to Arabic if English is empty
- `ar` request: use Arabic field; fallback to English only if Arabic is unexpectedly empty

After migration is complete, admin publish validation should prevent public records from being considered bilingual-complete if required English content is missing.

### 8.4 Homepage aggregation

`PublicHomepageService.getHomepage()` must accept locale and localize every aggregated entity before returning it.

Do not fetch Arabic data first and translate it in React.

### 8.5 Search and indexes

Current blog text index includes Arabic/base fields such as title, excerpt, content, tags, category. Extend relevant indexes/search logic to include English fields:

- `titleEn`
- `excerptEn`
- `contentEn`
- `tagsEn`
- `categoryEn`

Project/service/admin search should search both language fields where content managers expect cross-language search.

### 8.6 Validation and DTOs

Every admin create/update DTO needs its `*En` fields with matching validation constraints.

Examples:

- same max lengths for Arabic/English titles
- English rich text allowed wherever Arabic rich text is allowed
- English arrays validated as arrays of strings
- nested About/Project DTOs updated recursively

### 8.7 Error contracts

Prefer stable backend error codes and let the frontend render localized user-facing messages.

Example:

```json
{
  "code": "BLOG_NOT_FOUND",
  "message": "Blog not found"
}
```

Frontend maps `BLOG_NOT_FOUND` to Arabic/English copy. This avoids mixing API language with presentation language.

---

## 9. Admin panel changes

The admin panel needs two separate localization concerns:

1. The **admin UI itself** can support Arabic/English using the 687 translated static strings from the inventory.
2. Every CMS form must allow editors to manage **both Arabic and English content**.

### 9.1 Form design

Use a reusable locale editing pattern:

```text
[ العربية ✓ ] [ English ⚠ missing ]
```

Put shared fields outside locale tabs:

- media
- URLs
- dates
- prices
- currencies
- booleans
- sort order
- relations
- enums/codes

Put localized fields inside locale tabs.

### 9.2 Translation completeness

Each list page should display a completeness state:

```text
AR ✓   EN ✓
AR ✓   EN Missing
```

Add filters:

- All
- English missing
- Arabic missing
- Fully translated

This is much more useful than discovering missing translations only on the public website.

### 9.3 Publishing rule

During migration, English fields may be optional so existing Arabic publishing is not blocked.

After the translation migration is complete, introduce a bilingual publish rule for content expected on the English website:

- required Arabic fields complete
- required English fields complete
- locale-specific SEO complete where applicable

Optionally keep a per-item `availableLocales` flag only if the business intentionally wants some content to be Arabic-only. Otherwise, do not add extra state; completeness can be derived.

### 9.4 Rich text editor

`frontend/src/admin/components/shared/RichTextEditor.tsx` must accept locale/direction:

```ts
locale="ar" -> dir="rtl"
locale="en" -> dir="ltr"
```

Default paragraph alignment should follow the active editing locale, but content blocks should still be able to contain mixed English/Arabic technical terms.

### 9.5 SEO editor

For Blog, Projects, and About:

- Arabic SEO tab/section
- English SEO tab/section
- preview per locale
- canonical URL preview per locale
- character counters per locale

---

## 10. SEO requirements

A bilingual public site is incomplete without bilingual SEO.

Each indexable page needs:

- locale-specific `<title>`
- locale-specific meta description
- canonical URL for the active locale URL
- `hreflang="ar"`
- `hreflang="en"`
- `hreflang="x-default"` pointing to the chosen default/root strategy
- Open Graph locale/content
- Twitter title/description
- localized structured data where textual fields are involved

Example:

```html
<link rel="alternate" hreflang="ar" href="https://smartagency-ye.com/ar/about" />
<link rel="alternate" hreflang="en" href="https://smartagency-ye.com/en/about" />
```

Sitemap must include both locale URLs and their alternate-language relationships.

---

## 11. Data migration strategy

### Phase 1 — Additive schema/backend

1. Add all `*En` fields as optional.
2. Add `locale` to leads/newsletter.
3. Add stable taxonomy/category codes where currently needed.
4. Update DTOs and TypeScript types.
5. Keep all current Arabic fields and endpoints backward-compatible.

### Phase 2 — Admin editing capability

1. Add Arabic/English tabs to forms.
2. Support both values in create/update requests.
3. Add translation-completeness indicators.
4. Make rich text direction locale-aware.

### Phase 3 — Migrate existing content

1. Back up MongoDB.
2. Apply the English translations from the attached inventory to the matching documents/field paths.
3. Do not write translated copies for `database_operational` rows.
4. Manually review proper names, client names, brand language, and the content-quality flags.
5. Compute derived English reading time after blog content is populated.

### Phase 4 — Locale-aware public API

1. Add `lang` to public endpoints.
2. Add localized serializers.
3. Apply fallback policy.
4. Make search/query behavior bilingual.
5. Include locale in any backend cache keys if caching is introduced/used for localized responses.

### Phase 5 — Frontend routes/i18n

1. Add locale provider/i18n resources.
2. Introduce `/:locale` routing.
3. Add language switcher in desktop and mobile navigation.
4. Persist preference only for future root redirects.
5. Make API calls/query keys locale-aware.
6. Replace hard-coded `dir="rtl"`.
7. Move all 444 public static strings into translation files.
8. Optionally localize all 687 admin static strings as well.

### Phase 6 — SEO, QA, cleanup

1. Add canonical/hreflang/locale metadata.
2. Generate locale-aware sitemap.
3. Verify RTL/LTR layout visually.
4. Verify every public route in both languages.
5. Verify admin create/edit/load for both languages.
6. Verify search/filter behavior in both languages.
7. Remove unused `frontend/src/data` legacy content after confirmation.
8. Enable bilingual completeness enforcement.

---

## 12. Content-quality issues found during the audit

These should be corrected independently from localization:

1. **Tajaddod project feature text is corrupted** in `projects .json` around the maintenance workflow. The intended journey appears to be: create request → receive engineer offers → accept offer → track execution → complete → rate.
2. **Eman Jameel bio contains a corrupted Arabic phrase**: `تُحسن قِيَل أن تُرى`; confirm the intended Arabic copy before final production translation.
3. **Project category machine value contains an invalid/stray Arabic mark:** `ٍSaaS`; normalize to `saas`.
4. **Technology name `Garfana`** should be verified/corrected to `Grafana` if that is the intended technology.
5. Some media object URLs contain mojibake Arabic filename fragments. Do not rename production R2 objects blindly; use ASCII/UUID keys for future uploads and store localized alt text separately.

A separate CSV of these flags is attached.

---

## 13. Definition of done

Localization should not be considered complete until all of the following are true:

### Public UI

- No user-facing Arabic literal remains in public TSX/TS files outside Arabic locale resources or intentional proper nouns/content.
- No user-facing English literal remains outside English locale resources unless it is a brand/technical identifier.
- All routes work under `/ar` and `/en`.
- Language switching preserves the equivalent current page when possible.
- `<html lang>` and `dir` are correct after navigation and refresh.

### CMS/API

- All public CMS records required on the English site contain English content.
- Public APIs return locale-normalized content.
- Frontend caches are locale-isolated.
- Admin APIs return both language variants.
- Search works with both Arabic and English content.

### Admin

- Editors can create/edit both languages without overwriting the other language.
- Shared fields are edited once.
- Translation-completeness state is visible.
- Rich text works correctly in RTL and LTR.

### Forms/data

- Quote/contact/newsletter requests store submission locale.
- Business form values are stable codes/booleans, not translated labels.
- User-entered names/messages remain exactly as submitted.

### SEO

- Canonical, hreflang, OpenGraph, Twitter, structured data, and sitemap are correct for both locales.
- Old non-prefixed URLs redirect to Arabic without creating duplicate indexable content.

### QA

- Responsive visual QA passes in Arabic RTL and English LTR.
- No mixed-language stale cache after switching locales.
- No missing translations in production-visible records.
- English proper-name spellings are manually verified.

---

## 14. Recommended implementation rule

Use this rule throughout the project:

> **UI wording goes to i18n resources. Business-managed editorial content goes to Arabic + `*En` CMS fields. Machine values remain language-neutral. User-generated data is never translated or duplicated automatically. The active route locale drives direction, API language, caching, formatting, and SEO.**

This gives Smart Agency a complete bilingual architecture rather than a cosmetic language toggle.

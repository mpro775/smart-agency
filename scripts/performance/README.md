# Performance checks

Run these checks against a production build served by Nginx with a working public API. Do not use Vite's development server for performance comparisons.

```powershell
npm ci --prefix scripts/performance
npx --prefix scripts/performance playwright install chromium
node scripts/performance/audit.mjs final https://your-staging-host.example
$env:AUDIT_ORIGIN='https://your-staging-host.example'
node scripts/performance/smoke.mjs
node scripts/performance/interactions.mjs
node scripts/performance/headers.mjs https://your-staging-host.example
node scripts/performance/hero-ab.mjs https://your-baseline-host.example
```

The default audit runs Arabic and English three times each on mobile and desktop, clearing browser storage between navigations. It saves HTML, Lighthouse JSON, DevTools trace, CDP network log and HAR under `performance-artifacts/<stage>/`. Compare medians under identical conditions. `AUDIT_LOCALES`, `AUDIT_DEVICES`, and `AUDIT_RUNS` can narrow diagnostics; acceptance uses the defaults. `/` is checked separately by the smoke test because its redirect depends on browser/storage language.

The Hero A/B helper is a diagnostic against the original build: it changes only the H1/paragraph visibility, uses CPU/network throttling and records observed LCP/CLS and HAR. It is not a Lighthouse score. Missing LCP is saved as `null` with `validLcp: false`, never as zero. The mobile dashboard demo is loaded when half its measured box is visible; the smoke check verifies that loading preserves the reserved height in both languages.

Smoke checks cover `/`, `/ar`, `/en`, `/admin/login`, `/admin`, `/ar/projects`, `/en/blog`, `/ar/quote`, slow homepage API, section anchors, namespace isolation, newsletter, reduced motion and the mobile menu. The editor check uses mocked authentication and API responses and edits a local document without saving it. Newsletter submission is intercepted in the browser. No credentials are needed and these checks do not send form writes to the server.

Use `SOURCE_COMMIT` as a Docker build argument so `/build-info.json` identifies the deployed SHA. For custom R2 domains set the frontend build argument `VITE_IMAGE_ORIGIN` to the backend's `R2_PUBLIC_DOMAIN`. Native `*.r2.dev` URLs are recognized automatically. The public derivative endpoint fetches only the backend's configured R2 origin and path, accepts four widths, returns cached WebP, and the browser falls back to the original asset if transformation is unavailable.

Existing unversioned images retain their original URLs. New local fonts and the optimized logo use versioned filenames; change the version when changing their content. Existing TTF files remain as source assets and are not requested by the active stylesheet. Font conversions retain the original OFL license in `frontend/public/fonts/OFL.txt`.

`llms.txt` provides public discovery links. No `ai-catalog.json` is generated without a specified schema/test standard; missing JSON/TXT assets return 404. These experimental discovery files are independent of Google SEO scores.

The lazy administration editor may still exceed Vite's default 500 kB chunk warning. This warning is intentionally retained. Acceptance checks verify that its module is absent from the public network graph.

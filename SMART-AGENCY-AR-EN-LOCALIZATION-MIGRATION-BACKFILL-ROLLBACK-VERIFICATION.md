# Smart Agency — AR/EN Localization Migration, Backfill, Rollback & Verification

**Project:** Smart Agency Website  
**Stage:** Localization Data Migration / Backfill  
**Migration ID:** `smart-agency-ar-en-localization-v1`  
**Database:** MongoDB / Mongoose  
**Expected DB name:** `smart-agency`  
**Production API base:** `https://api.smartagency-ye.com/api`  
**Status before this stage:** Code-level AR/EN implementation CLOSED and ready for data migration.

---

# 1. الهدف

هذه المرحلة تقوم بترحيل **المحتوى الحالي الموجود فعلياً في MongoDB** إلى البنية الثنائية اللغة التي أصبحت مدعومة في الـBackend والـFrontend.

المطلوب:

1. تعبئة حقول `*En` من ملف الترجمات المعتمد.
2. عدم تغيير المحتوى العربي إلا في Normalizations آمنة ومحددة.
3. عدم الاعتماد على ترتيب السجلات.
4. كل كتابة تتم باستخدام `_id`.
5. وجود `Dry Run` إلزامي قبل أي كتابة.
6. عدم الكتابة فوق ترجمة إنجليزية موجودة ومختلفة.
7. التحقق من عدم تغير قاعدة البيانات بين Dry Run وApply.
8. إنشاء Rollback Journal قبل أول كتابة.
9. استخدام MongoDB Transaction افتراضياً.
10. Verification بعد التنفيذ.
11. إثبات Idempotency بإعادة Dry Run بعد التنفيذ.
12. إمكانية Rollback آمن يعيد **فقط الحقول التي غيّرها هذا Migration**.

---

# 2. الملفات التنفيذية

ضع الملفين التاليين داخل المشروع:

```text
backend/
└── scripts/
    └── localization-ar-en/
        ├── localization-migration.js
        └── translations.database.json
```

الملفات مرفقة مع هذه الخطة داخل الحزمة التنفيذية.

## `localization-migration.js`

السكربت التنفيذي.

يدعم:

```text
--dry-run
--apply
--verify
--rollback
```

ويحتوي على:

- بناء Plan بدون كتابة.
- Conflict detection.
- Translation coverage validation.
- Translation completeness validation.
- Stable-code normalization.
- MongoDB transaction.
- Apply journal.
- Post-apply exact verification.
- Safe rollback.
- Post-rollback exact verification.

## `translations.database.json`

نسخة مخصصة للـMigration من ملف:

```text
smart-agency-ar-en-text-inventory.json
```

تحتوي فقط على:

```text
source_type = database_public_cms
```

وبعدد:

```text
981 translation entries
```

لا يحتوي هذا الملف على Leads أو بيانات مستخدمين خاصة.

---

# 3. Checksums للنسخة المرفقة

استخدمها للتأكد أن الملفات لم تتغير قبل التشغيل:

```text
localization-migration.js
SHA256:
33facbfb830c4d32cae0ba6bb449298a4e68a701447e85d2feb9b414e2650efc

translations.database.json
SHA256:
85bc50fdeb9ca7f042a1dea5baf84847589027a5cc5eef7fc7a09517dcf78e7d
```

بعد نسخ الملفات:

```bash
cd backend

sha256sum \
  scripts/localization-ar-en/localization-migration.js \
  scripts/localization-ar-en/translations.database.json
```

يجب أن تتطابق القيم إذا كنت تستخدم الملفات المرفقة كما هي.

---

# 4. Collections التي يعالجها Migration

الـMigration يدعم محتوى الموقع الحالي:

```text
abouts
blogs
companyinfos
faqs
hostingpackages
projectcategories
projects
services
teammembers
technologies
testimonials
leads
newsletters
```

لا يلمس:

```text
users
```

ولا يعدل كلمات مرور أو حسابات أو صلاحيات.

---

# 5. Baseline الحالي من Snapshot المرفق

Snapshot الذي تم بناء خطة الترجمة عليه كان يحتوي:

| Collection | Count |
|---|---:|
| abouts | 1 |
| blogs | 4 |
| companyinfos | 1 |
| faqs | 6 |
| hostingpackages | 4 |
| leads | 8 |
| newsletters | 0 |
| projectcategories | 6 |
| projects | 15 |
| services | 7 |
| teammembers | 3 |
| technologies | 22 |
| testimonials | 4 |

السكربت يعرض Warning إذا تغير العدد.

**اختلاف العدد ليس خطأ تلقائياً** لأن Leads أو المحتوى قد يتغير بعد الـSnapshot.

لكن:

- أي محتوى عربي Public جديد بدون ترجمة معتمدة سيظهر كـ`missingTranslations` أو `completeness failure`.
- عند وجود ذلك يتم منع `--apply`.

---

# 6. ماذا يترجم السكربت؟

## About

يملأ النسخ الإنجليزية لـ:

```text
hero.title
hero.subtitle
hero.badge
hero.primaryButtonText
hero.secondaryButtonText
hero.trustBadges[]

vision
mission
approach

story.title
story.description
story.painPoints[]
story.closingStatement

thinking[].title
thinking[].description
thinking[].result

differentiators[].title
differentiators[].description
differentiators[].badge

process[].title
process[].description
process[].deliverable

values[].title
values[].description
values[].example

stats[].label
stats[].suffix
stats[].description

teamNote.title
teamNote.description
teamNote.highlights[]

cta.title
cta.description
cta.buttonText
cta.secondaryButtonText

seo.metaTitle
seo.metaDescription
seo.keywords[]
```

إلى الحقول `*En` المقابلة.

---

## Blogs

يملأ:

```text
titleEn
contentEn
excerptEn
coverAltEn

authorNameEn
authorRoleEn

tagsEn[]
categoryEn
categoryKey

summaryPointsEn[]

ctaTitleEn
ctaDescriptionEn
ctaButtonTextEn

seo.metaTitleEn
seo.metaDescriptionEn
seo.keywordsEn[]
seo.ogTitleEn
seo.ogDescriptionEn
seo.twitterTitleEn
seo.twitterDescriptionEn
```

### Legacy Blog categories

السجلات القديمة التي لا تحتوي:

```text
category
categoryKey
```

تحصل على:

```text
category    = عام
categoryEn  = General
categoryKey = general
```

أما:

```text
الذكاء الاصطناعي
```

فيتم تثبيت:

```text
categoryKey = artificial-intelligence
```

### Legacy Canonical

إذا وجد الحقل القديم:

```text
seo.canonicalUrl
```

يتم حذفه.

السبب:

الـCanonical أصبح يولد Runtime من:

```text
locale + slug + production origin
```

ولا نريد Canonical قديم مثل:

```text
smartagency.com/...
```

داخل MongoDB.

هذا الحذف مسجل في Journal ويمكن Rollback له.

---

## Company Info

يملأ:

```text
addressEn
workingHoursEn
```

ولا يكرر:

```text
email
phone
googleMapsUrl
whatsappUrl
socialLinks
```

---

## FAQs

يملأ:

```text
questionEn
answerEn
categoryEn
```

ويثبت `categoryKey`:

```text
عام     → general
تقني    → technical
خدمات   → services
استضافة → hosting
```

---

## Hosting Packages

يملأ:

```text
nameEn
descriptionEn
featuresEn[]

storageEn
bandwidthEn
ramEn
cpuEn
domainsEn

benefitHintsEn
```

إذا كانت قيمة تقنية أصلاً مثل:

```text
10GB SSD
4GB
2 vCPU
```

ولا تحتوي عربية، يسمح السكربت أن تكون النسخة الإنجليزية هي نفس القيمة.

أما:

```text
غير محدود
نطاق واحد
5 نطاقات
```

فتستخدم الترجمة المعتمدة.

---

## Project Categories

يملأ:

```text
labelEn
descriptionEn
```

ويحول `value` إلى Stable Codes:

```text
Web App    → website
Mobile App → mobile
E-Commerce → ecommerce
Automation → automation
Other      → other
ٍSaaS      → saas
SaaS       → saas
```

هذا آمن في البنية الحالية لأن المشاريع مرتبطة بالفئات بواسطة:

```text
categoryIds / ObjectId
```

وليس بواسطة نص `value`.

---

## Projects

يملأ:

```text
titleEn
summaryEn
challengeEn
solutionEn

results[].labelEn
results[].valueEn

featuresEn[]

clientNameEn
industryEn
durationEn

stats[].labelEn
stats[].valueEn
stats[].descriptionEn

seo.metaTitleEn
seo.metaDescriptionEn
seo.keywordsEn[]
```

ولا يكرر:

```text
slug
technologies
categoryIds
images
projectUrl
year
clientLogo
videoUrl
sortOrder
featuredOrder
flags
```

---

## Services

يملأ:

```text
titleEn
descriptionEn
shortDescriptionEn
featuresEn[]
```

---

## Team Members

يملأ:

```text
fullNameEn
roleEn
bioEn
funFactEn
specializationsEn[]
```

ولا يكرر:

```text
photo
email
department
social URLs
joinedAt
flags
```

---

## Technologies

يملأ:

```text
descriptionEn
tooltipEn
```

ولا ينشئ:

```text
nameEn
```

لأن أسماء التقنيات Canonical مشتركة.

كما يصحح typo الآمن:

```text
Garfana → Grafana
```

إذا وجد بنفس القيمة القديمة.

---

## Testimonials

يملأ:

```text
clientNameEn
positionEn
companyNameEn
contentEn
```

ولا يكرر:

```text
companyLogo
clientPhoto
linkedProject
rating
flags
```

---

# 7. Legacy Leads Backfill

لا تتم ترجمة أي نص كتبه العميل.

لا ينشئ السكربت:

```text
fullNameEn
companyNameEn
messageEn
projectGoalEn
currentWebsiteEn
```

## Locale

أي Lead تاريخي بدون:

```text
locale
```

يحصل على:

```text
locale = ar
```

والسبب أن الموقع التاريخي كان Arabic-first.

السجلات الجديدة بعد نشر الكود الحالي تحفظ Locale مباشرة من الطلب.

---

## Stable answers

السجلات القديمة التي تحتوي:

```text
projectAnswers.platforms = "Android first"
```

تتحول إلى:

```text
android
```

و:

```text
Android & iOS
```

إلى:

```text
both
```

و:

```text
projectAnswers.productScope = "MVP"
```

إلى:

```text
mvp
```

و:

```text
Full Product
```

إلى:

```text
full_product
```

القيم Boolean الموجودة أصلاً لا تتغير.

---

# 8. Content Quality — ما لا يتم تعديله تلقائياً

هناك حالات رصدناها أثناء الفحص لا يجب أن يخمن Migration نصها العربي.

السكربت يعرضها تحت:

```text
manualQualityWarnings
```

ولا يمنع الترحيل بسببها.

## إيمان جميل

الـBio العربي يحتوي العبارة المكسورة:

```text
... تُحسن قِيَل أن تُرى.
```

الترجمة الإنجليزية المعتمدة موجودة ويمكن ترحيلها.

لكن **النص العربي نفسه لا يتغير آلياً** حتى يتم اعتماد الصيغة الصحيحة من صاحبة الملف/الإدارة.

---

## مشروع تجدد

يوجد Feature عربي متضرر حول مسار الصيانة:

```text
... تقييمتقبال ...
```

الترجمة الإنجليزية المعتمدة موجودة.

لكن النص العربي لا يتم إعادة صياغته داخل Migration.

---

## R2 mojibake URLs

أي رابط R2 يحتوي اسم ملف قديم مشوهاً مثل:

```text
Ù...
Ø...
```

لا يتم تغييره.

لا تغير Object Key بدون التحقق أن الملف الجديد موجود في R2.

---

# 9. قاعدة الأمان الأساسية

السكربت **لن يكتب فوق ترجمة إنجليزية موجودة ومختلفة**.

مثال:

قاعدة البيانات:

```text
titleEn = "Custom human-approved translation"
```

وملف Migration يقترح:

```text
titleEn = "Another translation"
```

النتيجة:

```text
CONFLICT
APPLY BLOCKED
```

ولا يتم استبدال القيمة.

يجب مراجعة Conflict يدوياً.

---

# 10. لا يوجد اعتماد على ترتيب السجلات

ممنوع:

```text
doc#1
doc#2
array order of Mongo export
```

في الكتابة.

السكربت:

1. يقرأ السجل الحي.
2. يبني Plan.
3. يسجل `_id`.
4. كل Apply يتم بواسطة:

```text
collection + _id
```

5. قبل Apply يعيد قراءة السجل ويتأكد أن كل `before` ما زال كما كان وقت Dry Run.

إذا تغير المحتوى بين Dry Run وApply:

```text
DATABASE DRIFT
APPLY REFUSED
```

وهذا مقصود.

---

# 11. بنية التشغيل

أنشئ:

```text
backend/migration-runs/
backend/backups/
```

ويفضل إضافتهما إلى `.gitignore`:

```gitignore
migration-runs/
backups/
```

**لا ترفع Plan أو Journal أو Database Backup إلى GitHub.**

الـJournal قد يحتوي نسخاً من الحقول التي تغيرت، ومنها بعض بيانات Leads.

---

# 12. المتطلبات قبل التشغيل

يجب أن تكون النسخة التي أغلقت AR/EN منشورة أو جاهزة للنشر.

تم سابقاً إثبات:

```text
frontend lint PASS
frontend build PASS
backend lint PASS
backend build PASS
git diff --check PASS
```

قبل بدء هذه المرحلة.

في جهاز التنفيذ:

```bash
cd backend
npm ci
```

لا تستخدم:

```bash
npm update
npm audit fix --force
```

---

# 13. إعداد ملفات Migration

من جذر Backend:

```bash
mkdir -p scripts/localization-ar-en
mkdir -p migration-runs
mkdir -p backups
```

ضع:

```text
localization-migration.js
translations.database.json
```

داخل:

```text
scripts/localization-ar-en/
```

ثم:

```bash
node --check scripts/localization-ar-en/localization-migration.js
```

المتوقع:

```text
exit code 0
```

---

# 14. لا تضع Mongo URI في الأمر

استخدم متغير بيئة.

مثال Linux:

```bash
read -rsp "MongoDB URI: " MONGODB_URI
echo
export MONGODB_URI

export EXPECTED_DB_NAME=smart-agency
```

تحقق من اسم قاعدة البيانات فقط:

```bash
echo "$EXPECTED_DB_NAME"
```

لا تطبع:

```bash
echo "$MONGODB_URI"
```

ولا تحفظ URI داخل:

```text
migration script
plan
journal
Git
README
```

---

# 15. Backup إلزامي قبل Apply

## الخيار الأول — MongoDB Atlas Backup

إذا لديك Atlas Backup / Snapshot:

1. أنشئ On-demand snapshot قبل Migration.
2. سجل:
   - Snapshot ID
   - الوقت
   - Cluster
   - Database
3. لا تبدأ Apply حتى تصبح النسخة مكتملة.

هذا الخيار ممتاز للإنتاج.

---

## الخيار الثاني — `mongodump`

إذا MongoDB Database Tools مثبتة:

```bash
RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)"

BACKUP="backups/pre-ar-en-${RUN_ID}.archive.gz"

mongodump \
  --uri="$MONGODB_URI" \
  --archive="$BACKUP" \
  --gzip
```

ثم:

```bash
test -s "$BACKUP"
```

ثم احسب Hash:

```bash
sha256sum "$BACKUP" | tee "${BACKUP}.sha256"
```

يجب أن يكون الملف غير فارغ.

**الـRollback Journal ليس بديلاً عن Full Backup.**

---

# 16. التشغيل الصحيح — STAGING أولاً

لا تبدأ Production مباشرة.

نفذ دورة كاملة على Staging.

إذا اسم قاعدة Staging مختلف:

```bash
export EXPECTED_DB_NAME=smart-agency-staging
```

أو الاسم الفعلي.

---

# 17. المرحلة A — Dry Run

أنشئ Run ID:

```bash
RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)"

PLAN="migration-runs/localization-plan-${RUN_ID}.json"
JOURNAL="migration-runs/localization-journal-${RUN_ID}.json"
```

ثم:

```bash
node scripts/localization-ar-en/localization-migration.js \
  --dry-run \
  --expected-db="$EXPECTED_DB_NAME" \
  --plan-out="$PLAN"
```

## مهم

`--dry-run`:

```text
لا ينفذ أي update
لا ينفذ insert
لا ينفذ delete
```

فقط يقرأ قاعدة البيانات ويكتب Plan محلي.

---

# 18. نتيجة Dry Run المقبولة

يجب أن ترى:

```text
Conflicts: 0
Missing translations: 0
Completeness failures: 0
```

يمكن وجود:

```text
Warnings
Manual quality warnings
```

إذا كانت مفهومة ومراجعة.

---

# 19. ما الذي يعتبر Blocker؟

أي قيمة أكبر من صفر في:

```text
conflicts
missingTranslations
completenessFailures
```

تعني:

```text
DO NOT APPLY
```

السكربت نفسه يعيد Exit Code غير ناجح عند وجود Blockers.

---

# 20. فحص الـPlan قبل Apply

يمكن استخدام Node بدون `jq`:

```bash
node - "$PLAN" <<'NODE'
const fs = require("fs");
const file = process.argv[2];
const p = JSON.parse(fs.readFileSync(file, "utf8"));

console.log(JSON.stringify({
  databaseName: p.databaseName,
  generatedAt: p.generatedAt,
  inventoryHash: p.inventoryHash,
  counts: p.counts,
  summary: p.summary,
  issues: {
    conflicts: p.issues.conflicts,
    missingTranslations: p.issues.missingTranslations,
    completeness: p.issues.completeness,
    warnings: p.issues.warnings,
  },
  manualQualityWarnings: p.manualQualityWarnings,
}, null, 2));
NODE
```

راجع:

```text
databaseName
counts
documentsChanged
fieldChanges
byCollection
warnings
manualQualityWarnings
```

---

# 21. مراجعة Baseline Counts

إذا ظهر مثلاً:

```text
leads baseline 8
live count 12
```

هذا طبيعي إذا دخلت طلبات جديدة.

لكن إذا ظهر:

```text
projects baseline 15
live count 16
```

راجع المشروع رقم 16.

إذا كان مشروعاً عربياً جديداً بدون ترجمة، يجب أن يظهر ضمن:

```text
missingTranslations / completeness
```

ويوقف Apply.

---

# 22. Freeze قبل Apply

على Production:

من لحظة إنشاء الـDry Run النهائي إلى انتهاء Apply:

**أوقف تعديل محتوى الـCMS من لوحة الإدارة**:

```text
Projects
Blogs
About
Services
FAQ
Hosting
Team
Technologies
Testimonials
Project Categories
Company Info
```

لا تحتاج بالضرورة لإيقاف الموقع العام.

Leads الجديدة يمكن استقبالها لأن الكود الجديد يحفظ `locale` بنفسه.

لكن الأفضل جعل الفترة قصيرة جداً:

```text
Fresh Dry Run
→ Review
→ Apply
→ Verify
```

---

# 23. Apply

لا تستخدم Plan قديماً.

استخدم نفس Plan الذي راجعته.

الأمر:

```bash
node scripts/localization-ar-en/localization-migration.js \
  --apply \
  --expected-db="$EXPECTED_DB_NAME" \
  --plan="$PLAN" \
  --journal-out="$JOURNAL" \
  --confirm=LOCALIZATION_AR_EN_V1
```

---

# 24. ماذا يحدث داخل Apply؟

قبل أي Write:

1. يتحقق من DB name.
2. يتحقق من نسخة Migration.
3. يتحقق من SHA256 لملف الترجمات.
4. يتأكد أن Plan ليس به Blockers.
5. يعيد قراءة كل Document.
6. يقارن كل قيمة حالية مع `before` الموجودة في الـPlan.
7. إذا تغير Field:
   ```text
   APPLY REFUSED
   ```
8. ينشئ Journal على القرص **قبل أول كتابة**.
9. يبدأ MongoDB Transaction.
10. ينفذ updates بواسطة `_id`.
11. يعمل Exact Verification.
12. إذا نجح:
    ```text
    APPLIED_AND_VERIFIED
    ```

---

# 25. Transaction Policy

الإنتاج يجب أن يعمل بـTransaction.

لا تستخدم:

```text
--allow-nontransactional
```

في Production.

إذا ظهر:

```text
Transactional apply failed
```

توقف.

لا تحاول تجاوزها مباشرة.

تحقق أن MongoDB يعمل على Replica Set / Atlas configuration التي تدعم Transactions.

---

# 26. Non-transactional Mode

السكربت يحتوي:

```text
--allow-nontransactional
```

فقط للطوارئ أو بيئة محلية/Staging بعد فهم السبب.

لا تستخدمه في Production إلا بقرار واعٍ جداً وبعد وجود Full Backup.

---

# 27. Journal

قبل الكتابة ينشأ:

```text
migration-runs/localization-journal-....json
```

الـJournal يحتوي:

- Plan المستخدم.
- SHA للـPlan.
- SHA للترجمات.
- DB name.
- كل Field تغير.
- `beforeExists`.
- `before`.
- `afterExists`.
- `after`.
- حالة التنفيذ.

بعد النجاح:

```text
status = APPLIED_AND_VERIFIED
```

احسب Hash:

```bash
sha256sum "$JOURNAL" | tee "${JOURNAL}.sha256"
```

لا تعدل Journal يدوياً.

---

# 28. Verification رقم 1 — Exact DB State

بعد Apply:

```bash
node scripts/localization-ar-en/localization-migration.js \
  --verify \
  --expected-db="$EXPECTED_DB_NAME" \
  --plan="$PLAN"
```

المطلوب:

```text
VERIFY PASS
```

السكربت يقارن **كل Field تغير** مع `after` في Plan.

---

# 29. Verification رقم 2 — Idempotency Proof

هذه خطوة مهمة جداً.

بعد نجاح Apply/Verify، شغل Dry Run جديد:

```bash
POST_PLAN="migration-runs/localization-post-verify-${RUN_ID}.json"

node scripts/localization-ar-en/localization-migration.js \
  --dry-run \
  --expected-db="$EXPECTED_DB_NAME" \
  --plan-out="$POST_PLAN"
```

المطلوب تقريباً:

```text
Documents changed: 0
Field changes: 0
Conflicts: 0
Missing translations: 0
Completeness failures: 0
```

إذا أصبح:

```text
0 changes
```

فهذا إثبات أن Migration:

```text
IDEMPOTENT
```

وأن تشغيله مرة ثانية لا يفعل شيئاً.

قد يظهر Warning Counts إذا أضيف Lead جديد أثناء العملية؛ هذا لا يفسد Idempotency طالما السجلات الجديدة صحيحة.

---

# 30. Verification رقم 3 — API AR

Production:

```bash
API_BASE="https://api.smartagency-ye.com/api"
```

اختبر:

```bash
curl -fsS "$API_BASE/public/homepage?lang=ar" > /tmp/smart-home-ar.json
curl -fsS "$API_BASE/about?lang=ar" > /tmp/smart-about-ar.json
curl -fsS "$API_BASE/services?lang=ar" > /tmp/smart-services-ar.json
curl -fsS "$API_BASE/projects?lang=ar" > /tmp/smart-projects-ar.json
curl -fsS "$API_BASE/blog?lang=ar" > /tmp/smart-blog-ar.json
curl -fsS "$API_BASE/faqs?lang=ar" > /tmp/smart-faq-ar.json
curl -fsS "$API_BASE/hosting-packages?lang=ar" > /tmp/smart-hosting-ar.json
curl -fsS "$API_BASE/team?lang=ar" > /tmp/smart-team-ar.json
curl -fsS "$API_BASE/technologies?lang=ar" > /tmp/smart-tech-ar.json
curl -fsS "$API_BASE/testimonials?lang=ar" > /tmp/smart-testimonials-ar.json
curl -fsS "$API_BASE/project-categories?lang=ar" > /tmp/smart-categories-ar.json
curl -fsS "$API_BASE/company-info?lang=ar" > /tmp/smart-company-ar.json
```

كل الأوامر يجب أن تعيد Exit Code `0`.

---

# 31. Verification رقم 4 — API EN

```bash
curl -fsS "$API_BASE/public/homepage?lang=en" > /tmp/smart-home-en.json
curl -fsS "$API_BASE/about?lang=en" > /tmp/smart-about-en.json
curl -fsS "$API_BASE/services?lang=en" > /tmp/smart-services-en.json
curl -fsS "$API_BASE/projects?lang=en" > /tmp/smart-projects-en.json
curl -fsS "$API_BASE/blog?lang=en" > /tmp/smart-blog-en.json
curl -fsS "$API_BASE/faqs?lang=en" > /tmp/smart-faq-en.json
curl -fsS "$API_BASE/hosting-packages?lang=en" > /tmp/smart-hosting-en.json
curl -fsS "$API_BASE/team?lang=en" > /tmp/smart-team-en.json
curl -fsS "$API_BASE/technologies?lang=en" > /tmp/smart-tech-en.json
curl -fsS "$API_BASE/testimonials?lang=en" > /tmp/smart-testimonials-en.json
curl -fsS "$API_BASE/project-categories?lang=en" > /tmp/smart-categories-en.json
curl -fsS "$API_BASE/company-info?lang=en" > /tmp/smart-company-en.json
```

---

# 32. Accept-Language Verification

اختبر أن API لا يعتمد فقط على Query Param.

مثال:

```bash
curl -fsS \
  -H "Accept-Language: en" \
  "$API_BASE/blog/tags"
```

وقارن مع:

```bash
curl -fsS \
  "$API_BASE/blog/tags?lang=en"
```

ونفس الشيء:

```bash
curl -fsS \
  -H "Accept-Language: en" \
  "$API_BASE/blog/categories"
```

---

# 33. فحص وجود Arabic leakage في EN

للمراجعة السريعة:

```bash
grep -nP '[\x{0600}-\x{06FF}]' /tmp/smart-home-en.json || true
grep -nP '[\x{0600}-\x{06FF}]' /tmp/smart-projects-en.json || true
grep -nP '[\x{0600}-\x{06FF}]' /tmp/smart-blog-en.json || true
```

أي Result يجب مراجعته.

لا تفترض أن كل Arabic character يعني خطأ، لكن في Public CMS English output يفترض ألا تبقى النصوص العربية القابلة للترجمة.

---

# 34. Project Details Verification

من استجابة:

```text
/api/projects?lang=en
```

خذ `slug` لمشروع منشور.

ثم:

```bash
curl -fsS \
  "$API_BASE/projects/slug/PROJECT_SLUG?lang=en"
```

وتحقق من:

```text
title
summary
challenge
solution
features
results
clientName
industry
duration
stats
seo
technologies.description
technologies.tooltip
```

كلها باللغة الإنجليزية عندما يكون لها محتوى لغوي.

---

# 35. Blog Details Verification

خذ Blog `slug` منشور ثم:

```bash
curl -fsS \
  "$API_BASE/blog/slug/BLOG_SLUG?lang=en"
```

تحقق من:

```text
title
content
excerpt
tags
category
CTA
SEO
```

ولا تعتمد على fallback عربي.

---

# 36. Admin Verification

بعد الترحيل افتح لوحة الإدارة.

اختبر Record واحد على الأقل من كل:

```text
About
Project
Blog
Service
FAQ
Hosting Package
Project Category
Team Member
Technology
Testimonial
Company Info
```

تحقق:

```text
AR ✓
EN ✓
```

ثم افتح Edit.

تأكد من:

1. العربية موجودة كما كانت.
2. الإنجليزية موجودة.
3. لا تختلط الحقول.
4. الحقول المشتركة تظهر مرة واحدة.
5. Save يعمل.
6. أعد فتح Record.
7. الإنجليزية لم تختف.
8. لا يوجد `400 BILINGUAL_CONTENT_INCOMPLETE`.

---

# 37. عدم تعديل العربية

باستثناء Normalizations المحددة في هذا الملف، لا يجب أن تتغير العربية.

التغييرات المصدرية المسموحة تلقائياً فقط:

```text
ProjectCategory.value stable codes
FAQ.categoryKey
Blog.category/categoryKey legacy backfill
remove old Blog seo.canonicalUrl
Technology Garfana → Grafana
Lead.locale backfill
Lead.projectAnswers legacy codes
```

غير ذلك:

```text
Arabic CMS source text remains untouched.
```

---

# 38. Sitemap بعد Migration

بعد أن أصبحت بيانات MongoDB مترجمة فعلاً:

```bash
cd ../frontend
```

وتأكد:

```bash
export SITEMAP_API_URL="https://api.smartagency-ye.com/api"
```

ثم:

```bash
npm ci
npm run build
```

يجب أن ينجح.

بعد البناء:

```bash
grep -n "/ar/projects/" dist/sitemap.xml | head
grep -n "/en/projects/" dist/sitemap.xml | head
grep -n "/ar/blog/" dist/sitemap.xml | head
grep -n "/en/blog/" dist/sitemap.xml | head
```

يجب أن تظهر المشاريع والمقالات الديناميكية.

---

# 39. Sitemap hreflang

تحقق:

```bash
grep -n 'hreflang="ar"' dist/sitemap.xml | head
grep -n 'hreflang="en"' dist/sitemap.xml | head
grep -n 'hreflang="x-default"' dist/sitemap.xml | head
```

---

# 40. Visual QA

بعد Staging Migration:

اختبر:

```text
/ar
/en
```

على:

```text
Desktop
Mobile
```

على الأقل:

```text
Home
About
Services
Projects
Project Details
Blog
Blog Details
Hosting
FAQ
Contact
Quote
```

تحقق:

- RTL صحيح.
- LTR صحيح.
- English لا يحتوي Arabic fallback.
- Text wrapping.
- Cards.
- Buttons.
- Navbar.
- Footer.
- Modals.
- Forms.
- Dates.
- SEO titles.
- Images.
- Dynamic content.

---

# 41. Rollback — متى نستخدمه؟

استخدم Rollback إذا:

- Migration نفذ لكن API verification فشل.
- محتوى EN ظهر بشكل خاطئ جوهري.
- اكتشفت mapping غير صحيح.
- مشكلة Contract لم تظهر قبل الترحيل.
- تقرر الرجوع فوراً قبل تعديلات تحريرية جديدة.

---

# 42. Rollback Command

استخدم Journal الناتج من نفس Apply:

```bash
node scripts/localization-ar-en/localization-migration.js \
  --rollback \
  --expected-db="$EXPECTED_DB_NAME" \
  --journal="$JOURNAL" \
  --confirm=ROLLBACK_LOCALIZATION_AR_EN_V1
```

---

# 43. كيف يعمل Rollback؟

لا يعيد Database Dump كاملاً.

بل يعيد فقط Paths التي غيرها Migration.

لكل Field يعرف:

```text
هل كان موجوداً قبل Migration؟
ما قيمته؟
ما القيمة التي كتبها Migration؟
```

إذا Field لم يكن موجوداً قبل:

```text
Rollback → $unset
```

إذا كان موجوداً:

```text
Rollback → restore exact old value
```

---

# 44. حماية Rollback من تدمير تعديلات جديدة

مثال:

Migration كتب:

```text
titleEn = A
```

وبعده عدل الأدمن:

```text
titleEn = B
```

ثم حاولت Rollback.

السكريبت يرى:

```text
Current B != Migration After A
```

ويوقف:

```text
ROLLBACK SAFETY CONFLICT
```

ولا يكتب فوق تعديل الأدمن.

هذه حماية مقصودة.

---

# 45. لا تستخدم Force Rollback عادة

يوجد:

```text
--force-rollback
```

لكنه **ليس الإجراء الطبيعي**.

لا تستخدمه إلا بعد فحص قائمة Conflicts Field-by-Field.

Production:

```text
Default = NO FORCE
```

---

# 46. Rollback Verification

بعد نجاح Rollback السكربت تلقائياً يقارن الحقول مع:

```text
before
```

ويجب أن يعطي:

```text
ROLLBACK PASS
```

و:

```text
all migration-touched fields restored
```

---

# 47. Full Database Backup Restore

Full Backup هو آخر خط دفاع فقط.

لا تستخدم Full DB Restore لمجرد وجود مشكلة في 2–3 Fields.

السبب:

قد يحذف أو يعيد للخلف:

```text
new Leads
new content edits
new admin changes
```

التي حدثت بعد Backup.

الأولوية:

```text
1. Journal rollback
2. targeted manual correction
3. Full backup restore only for disaster
```

Full restore يتم فقط:

- Maintenance window.
- مع إيقاف الكتابات.
- بعد التأكد من الزمن الذي ستعود له DB.
- ويفضل أولاً Restore إلى Database/Cluster معزول للمقارنة.

---

# 48. Staging Rollback Drill

قبل Production أنصح بإثبات Rollback على Staging.

التسلسل:

```text
Dry Run
→ Apply
→ Verify
→ Post-Dry-Run (0 changes)
→ Rollback
→ Rollback Verify
→ Dry Run مرة ثانية
```

بعد Rollback، الـDry Run يجب أن يقترح نفس Migration مرة أخرى تقريباً.

ثم يمكنك إعادة Apply على Staging وإكمال Visual QA.

---

# 49. Production Runbook

بعد نجاح Staging بالكامل:

## 49.1 تأكد من Code Deployment

يجب نشر النسخة التي تدعم:

```text
AR/EN schemas
locale-aware APIs
admin bilingual forms
fallback logic
guards
routing
SEO
```

قبل أو بالتزامن مع Migration.

لا تشغل بيانات `*En` على نسخة Backend قديمة غير متوافقة.

---

## 49.2 Backup

خذ:

```text
Atlas snapshot
or
mongodump
```

وسجل Hash/ID.

---

## 49.3 Freeze Admin CMS Editing

أوقف تعديل المحتوى مؤقتاً.

---

## 49.4 Fresh Dry Run

لا تستخدم Plan Staging.

ولا تستخدم Plan Production عمره ساعات.

اعمل Plan جديد:

```bash
PROD_RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)"

PROD_PLAN="migration-runs/prod-localization-plan-${PROD_RUN_ID}.json"
PROD_JOURNAL="migration-runs/prod-localization-journal-${PROD_RUN_ID}.json"

node scripts/localization-ar-en/localization-migration.js \
  --dry-run \
  --expected-db=smart-agency \
  --plan-out="$PROD_PLAN"
```

---

## 49.5 Gate

لا تكمل إذا لم تكن:

```text
Conflicts             0
Missing translations  0
Completeness failures 0
```

---

## 49.6 Apply

```bash
node scripts/localization-ar-en/localization-migration.js \
  --apply \
  --expected-db=smart-agency \
  --plan="$PROD_PLAN" \
  --journal-out="$PROD_JOURNAL" \
  --confirm=LOCALIZATION_AR_EN_V1
```

---

## 49.7 Verify

```bash
node scripts/localization-ar-en/localization-migration.js \
  --verify \
  --expected-db=smart-agency \
  --plan="$PROD_PLAN"
```

---

## 49.8 Idempotency

```bash
node scripts/localization-ar-en/localization-migration.js \
  --dry-run \
  --expected-db=smart-agency \
  --plan-out="migration-runs/prod-post-localization-${PROD_RUN_ID}.json"
```

المطلوب:

```text
0 planned changes
0 conflicts
0 missing translations
0 completeness failures
```

---

## 49.9 API Smoke

نفذ AR + EN API checks.

---

## 49.10 Unfreeze Admin

بعد نجاح:

```text
DB Verify
API Verify
Admin quick check
```

يمكن إعادة فتح تعديل المحتوى.

---

# 50. Logs يجب حفظها

احفظ:

```text
Full backup / Atlas snapshot ID
Backup SHA256 if file
Dry Run Plan
Plan SHA256
Apply Journal
Journal SHA256
Verify output
Post-apply Dry Run
API smoke output
Sitemap build proof
```

لا تحفظ Secrets.

---

# 51. Git Policy

يمكن Commit:

```text
scripts/localization-ar-en/localization-migration.js
scripts/localization-ar-en/translations.database.json
this implementation document
```

لا Commit:

```text
migration-runs/*.json
backups/*
.env
Mongo URI
Atlas credentials
Production dumps
```

---

# 52. Optional package.json scripts

ليس إلزامياً.

إذا أردت تسهيل التشغيل يمكن إضافة:

```json
{
  "scripts": {
    "localization:dry-run": "node scripts/localization-ar-en/localization-migration.js --dry-run",
    "localization:apply": "node scripts/localization-ar-en/localization-migration.js --apply",
    "localization:verify": "node scripts/localization-ar-en/localization-migration.js --verify",
    "localization:rollback": "node scripts/localization-ar-en/localization-migration.js --rollback"
  }
}
```

وعند تمرير args:

```bash
npm run localization:dry-run -- \
  --expected-db=smart-agency \
  --plan-out=migration-runs/plan.json
```

لكن الأوامر المباشرة بـ`node` أوضح وأقل التباساً لهذه العملية الحساسة.

---

# 53. لماذا لا يستخدم Migration Mongoose Models؟

السكريبت يستخدم MongoDB Collections مباشرة عبر اتصال Mongoose.

السبب:

- Migration مستقل عن Nest Application boot.
- لا يشغل hooks غير مقصودة.
- لا يشغل API logic.
- لا يتأثر بـDTO validation.
- يمكن التحكم بالـ`$set/$unset` بدقة.
- Rollback يعرف Paths الدقيقة.

لكنه ما زال يستخدم:

```text
mongoose
```

الموجود أصلاً في Backend dependencies.

---

# 54. Timestamps

هذا Backfill منخفض المستوى **لا يغير `updatedAt` تلقائياً**.

السبب:

نريد الاحتفاظ بـ`updatedAt` كتاريخ تعديل Business Content، ولا نريد أن يبدو أن كل محتوى الموقع تم تحريره يدوياً في يوم Migration.

الـAudit الحقيقي للعملية موجود في:

```text
Plan
Journal
Git
Backup
Migration logs
```

---

# 55. Dry Run Conflict Example

إذا خرج:

```json
{
  "collection": "projects",
  "id": "...",
  "path": "titleEn",
  "current": "Human Translation",
  "proposed": "Inventory Translation"
}
```

لا تعدل السكربت ليكتب فوقها.

اختر يدوياً:

- اعتماد Human Translation وإعادة بناء inventory/plan.
- أو اعتماد Inventory Translation بعد موافقة المترجم وتعديل الحقل بشكل صريح.

ثم:

```text
Re-run Dry Run
```

حتى:

```text
conflicts = 0
```

---

# 56. Missing Translation Example

إذا أضيف مشروع جديد بعد تجهيز ملف الترجمة:

```text
title = مشروع جديد
titleEn = empty
```

وليس موجوداً في `translations.database.json`:

```text
missingTranslations > 0
```

الصح:

1. ترجم النص.
2. أضفه إلى inventory المعتمد.
3. أعد توليد `translations.database.json`.
4. Dry Run جديد.
5. راجع SHA الجديد.
6. لا تستخدم Plan القديم.

---

# 57. Inventory Hash Protection

الـPlan يحتوي:

```text
inventoryHash
```

عند Apply يقوم السكربت بحساب Hash الحالي.

إذا تغير ملف الترجمات بعد Dry Run:

```text
APPLY REFUSED
```

ويطلب:

```text
Re-run Dry Run
```

وهذا يمنع:

```text
Plan reviewed against translation version A
Apply using translation version B
```

---

# 58. Database Drift Protection

مثال:

Dry Run رأى:

```text
industry = تجارة إلكترونية
industryEn = missing
```

بعد Dry Run قام Admin بتعديل:

```text
industry = حلول تجارة رقمية
```

Apply لن يكتب ترجمة النص القديم.

بل يوقف:

```text
Database drift since dry-run
```

الحل:

```text
Fresh Dry Run
```

---

# 59. Expected final DB state

بعد نجاح Migration:

## Public CMS

الحقول العربية الحالية تبقى موجودة.

وتوجد حقول الإنجليزية اللازمة:

```text
*En
```

وفق Schema الحالي.

## Shared data

تبقى نسخة واحدة:

```text
URLs
IDs
images
relations
codes
numbers
flags
```

## Leads

تبقى رسائل المستخدم كما أدخلها.

ويضاف فقط:

```text
locale
```

مع normalization للقيم القديمة المحددة.

---

# 60. Final Acceptance Checklist

## Backup

- [ ] Atlas snapshot أو `mongodump` مكتمل.
- [ ] Backup ID/filename محفوظ.
- [ ] SHA محفوظ إذا كان dump file.

## Dry Run

- [ ] `databaseName` صحيح.
- [ ] Counts تمت مراجعتها.
- [ ] `conflicts = 0`.
- [ ] `missingTranslations = 0`.
- [ ] `completenessFailures = 0`.
- [ ] Manual warnings تمت قراءتها.
- [ ] Plan SHA محفوظ.

## Apply

- [ ] Admin CMS editing مجمد مؤقتاً.
- [ ] Apply استخدم نفس Plan.
- [ ] Inventory hash مطابق.
- [ ] Transaction نجحت.
- [ ] Journal أنشئ قبل الكتابة.
- [ ] Apply انتهى `APPLIED_AND_VERIFIED`.

## Verification

- [ ] `--verify` PASS.
- [ ] Post-migration Dry Run = 0 changes.
- [ ] AR APIs PASS.
- [ ] EN APIs PASS.
- [ ] `Accept-Language` PASS.
- [ ] Project Details EN PASS.
- [ ] Blog Details EN PASS.
- [ ] Admin AR/EN fields PASS.
- [ ] Save/reopen Admin PASS.

## Frontend / SEO

- [ ] `/ar` PASS.
- [ ] `/en` PASS.
- [ ] RTL PASS.
- [ ] LTR PASS.
- [ ] SITEMAP_API_URL uses `https://api.smartagency-ye.com/api`.
- [ ] Frontend production build PASS.
- [ ] Sitemap includes dynamic AR projects.
- [ ] Sitemap includes dynamic EN projects.
- [ ] Sitemap includes dynamic AR blogs.
- [ ] Sitemap includes dynamic EN blogs.
- [ ] hreflang AR/EN/x-default PASS.

## Audit

- [ ] Plan/Journals NOT committed.
- [ ] Backup NOT committed.
- [ ] No secret stored.
- [ ] Rollback command documented.
- [ ] Staging rollback drill completed before Production.

---

# 61. Required Closure Report

بعد التنفيذ أعطني:

```md
# Smart Agency AR/EN Localization Migration Closure Report

## Status
PASS / FAIL

## Environment
- Staging / Production:
- DB name:
- Migration version:
- Code SHA:
- Execution date UTC:

## Backup
- Method:
- Snapshot ID / dump filename:
- SHA256:
- Backup completed before apply: YES/NO

## Translation Inventory
- Entries: 981
- SHA256:

## Dry Run
- Plan file:
- Plan SHA256:
- Documents changed:
- Field changes:
- Conflicts:
- Missing translations:
- Completeness failures:
- Warnings:
- Manual quality warnings:

## Counts
- abouts:
- blogs:
- companyinfos:
- faqs:
- hostingpackages:
- leads:
- newsletters:
- projectcategories:
- projects:
- services:
- teammembers:
- technologies:
- testimonials:

## Apply
- Transaction: PASS/FAIL
- Journal created before write: YES/NO
- Journal file:
- Journal SHA256:
- Status:

## Database Verification
- --verify:
- Post-migration dry-run:
- Remaining planned changes:
- Idempotency:

## API Verification
- AR homepage:
- EN homepage:
- AR projects:
- EN projects:
- EN project details:
- AR blog:
- EN blog:
- EN blog details:
- FAQ:
- Hosting:
- About:
- Team:
- Technologies:
- Testimonials:
- Company info:
- Accept-Language:

## Admin Verification
- About:
- Project:
- Blog:
- Service:
- FAQ:
- Hosting:
- Project Category:
- Team:
- Technology:
- Testimonial:
- Company Info:

## Sitemap
- Build:
- AR project URLs:
- EN project URLs:
- AR blog URLs:
- EN blog URLs:
- hreflang:

## Manual Content Quality Items
- Eman bio:
- Tajaddod Arabic feature:
- R2 mojibake URLs:

## Rollback
- Staging rollback drill:
- Rollback verification:
- Production rollback required: YES/NO

## Final Decision
LOCALIZATION MIGRATION CLOSED
or
ROLLBACK / FIX REQUIRED
```

---

# 62. Definition of Done

المرحلة لا تعتبر مكتملة بمجرد نجاح `updateMany`.

يجب أن تكون:

```text
Backup                         PASS
Dry Run                       PASS
Translation coverage          PASS
No conflicts                  PASS
English completeness          PASS
Transactional apply           PASS
Exact DB verify               PASS
Idempotency                   PASS
AR API                        PASS
EN API                        PASS
Admin read/save               PASS
Sitemap dynamic routes        PASS
Visual AR                     PASS
Visual EN                     PASS
Rollback proven on Staging    PASS
```

والقرار النهائي:

```text
LOCALIZATION MIGRATION CLOSED
```

---

# 63. أسرع تسلسل أوامر — نسخة Copy/Paste

> نفذ على Staging أولاً. غير `EXPECTED_DB_NAME` حسب البيئة.

```bash
cd backend

npm ci

mkdir -p migration-runs backups

read -rsp "MongoDB URI: " MONGODB_URI
echo
export MONGODB_URI

export EXPECTED_DB_NAME=smart-agency

RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)"
PLAN="migration-runs/localization-plan-${RUN_ID}.json"
JOURNAL="migration-runs/localization-journal-${RUN_ID}.json"
BACKUP="backups/pre-ar-en-${RUN_ID}.archive.gz"

node --check scripts/localization-ar-en/localization-migration.js

sha256sum \
  scripts/localization-ar-en/localization-migration.js \
  scripts/localization-ar-en/translations.database.json

mongodump \
  --uri="$MONGODB_URI" \
  --archive="$BACKUP" \
  --gzip

test -s "$BACKUP"

sha256sum "$BACKUP" | tee "${BACKUP}.sha256"

node scripts/localization-ar-en/localization-migration.js \
  --dry-run \
  --expected-db="$EXPECTED_DB_NAME" \
  --plan-out="$PLAN"

node - "$PLAN" <<'NODE'
const fs = require("fs");
const p = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
console.log(JSON.stringify({
  databaseName: p.databaseName,
  counts: p.counts,
  summary: p.summary,
  issues: p.issues,
  manualQualityWarnings: p.manualQualityWarnings,
}, null, 2));
NODE
```

**توقف هنا وراجع النتيجة.**

لا تكمل إلا إذا:

```text
conflicts = 0
missingTranslations = 0
completenessFailures = 0
```

بعد المراجعة:

```bash
node scripts/localization-ar-en/localization-migration.js \
  --apply \
  --expected-db="$EXPECTED_DB_NAME" \
  --plan="$PLAN" \
  --journal-out="$JOURNAL" \
  --confirm=LOCALIZATION_AR_EN_V1

sha256sum "$JOURNAL" | tee "${JOURNAL}.sha256"

node scripts/localization-ar-en/localization-migration.js \
  --verify \
  --expected-db="$EXPECTED_DB_NAME" \
  --plan="$PLAN"

POST_PLAN="migration-runs/localization-post-${RUN_ID}.json"

node scripts/localization-ar-en/localization-migration.js \
  --dry-run \
  --expected-db="$EXPECTED_DB_NAME" \
  --plan-out="$POST_PLAN"
```

المطلوب في Post Plan:

```text
documentsChanged = 0
fieldChanges = 0
conflicts = 0
missingTranslations = 0
completenessFailures = 0
```

---

# 64. أسرع Rollback Command

إذا احتجت الرجوع مباشرة:

```bash
cd backend

node scripts/localization-ar-en/localization-migration.js \
  --rollback \
  --expected-db="$EXPECTED_DB_NAME" \
  --journal="$JOURNAL" \
  --confirm=ROLLBACK_LOCALIZATION_AR_EN_V1
```

لا تضف:

```text
--force-rollback
```

إلا بعد مراجعة يدوية لأي Field تغير بعد Migration.

---

# 65. ملاحظة أخيرة

لا تعدل `translations.database.json` بعد إنشاء Dry Run Plan.

إذا عدل المترجم أي ترجمة:

```text
update translations.database.json
→ create NEW dry run
→ review NEW plan
→ apply NEW plan
```

ولا تستخدم Plan قديم مع Inventory جديد.

#!/usr/bin/env node
'use strict';

/**
 * Smart Agency AR/EN Localization Migration v1
 *
 * Modes:
 *   --dry-run   Build an immutable plan. NO database writes. (default)
 *   --apply     Apply a previously reviewed plan.
 *   --verify    Verify DB matches plan after state.
 *   --rollback  Restore only fields changed by a journal.
 *
 * Safety:
 * - Uses _id for all writes.
 * - Never overwrites a non-empty English field with different content.
 * - Apply verifies every planned "before" value is still current.
 * - Transactions are required by default.
 * - Rollback refuses to overwrite post-migration manual edits.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

const APPLY_CONFIRM = 'LOCALIZATION_AR_EN_V1';
const ROLLBACK_CONFIRM = 'ROLLBACK_LOCALIZATION_AR_EN_V1';
const VERSION = 'smart-agency-ar-en-localization-v1';

const BASELINE_COUNTS = {
  abouts: 1,
  blogs: 4,
  companyinfos: 1,
  faqs: 6,
  hostingpackages: 4,
  leads: 8,
  newsletters: 0,
  projectcategories: 6,
  projects: 15,
  services: 7,
  teammembers: 3,
  technologies: 22,
  testimonials: 4,
};

function parseArgs(argv) {
  const out = {};
  for (const arg of argv.slice(2)) {
    if (!arg.startsWith('--')) continue;
    const raw = arg.slice(2);
    const eq = raw.indexOf('=');
    if (eq === -1) out[raw] = true;
    else out[raw.slice(0, eq)] = raw.slice(eq + 1);
  }
  const modes = ['dry-run', 'apply', 'verify', 'rollback'].filter((m) => out[m]);
  if (modes.length > 1) throw new Error(`Choose one mode only: ${modes.join(', ')}`);
  if (modes.length === 0) out['dry-run'] = true;
  return out;
}

function timestampForFile() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function normalizeLookupText(value) {
  return String(value)
    .normalize('NFC')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasArabic(value) {
  return /[\u0600-\u06FF]/u.test(String(value));
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function isNonEmpty(value) {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.some((x) => isNonEmpty(x));
  if (value && typeof value === 'object') return Object.keys(value).length > 0;
  return value !== null && value !== undefined;
}

function getPathState(obj, dottedPath) {
  const parts = dottedPath.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur === null || cur === undefined || typeof cur !== 'object') {
      return { exists: false, value: undefined };
    }
    if (!Object.prototype.hasOwnProperty.call(cur, p)) {
      return { exists: false, value: undefined };
    }
    cur = cur[p];
  }
  return { exists: true, value: cur };
}

function setPath(obj, dottedPath, value) {
  const parts = dottedPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    const next = parts[i + 1];
    if (cur[p] === null || cur[p] === undefined || typeof cur[p] !== 'object') {
      cur[p] = /^\d+$/.test(next) ? [] : {};
    }
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

function unsetPath(obj, dottedPath) {
  const parts = dottedPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (cur === null || cur === undefined || typeof cur !== 'object') return;
    cur = cur[p];
  }
  if (cur && typeof cur === 'object') delete cur[parts[parts.length - 1]];
}

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function loadTranslationData(file) {
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const source = raw.entries || raw;
  const normalized = new Map();
  for (const [arabic, english] of Object.entries(source)) {
    const key = normalizeLookupText(arabic);
    const existing = normalized.get(key);
    if (existing !== undefined && existing !== english) {
      throw new Error(`Conflicting translations after normalization: ${arabic}`);
    }
    normalized.set(key, english);
  }
  return { raw, normalized };
}

function translateText(value, translations, context, issues) {
  if (typeof value !== 'string') return value;
  if (value.trim() === '') return value;
  const found = translations.get(normalizeLookupText(value));
  if (found !== undefined && String(found).trim() !== '') return found;
  if (!hasArabic(value)) return value; // Technical/brand copy can be identical in EN.
  issues.missingTranslations.push({ context, source: value });
  return undefined;
}

function translateArray(values, translations, context, issues) {
  if (!Array.isArray(values)) return undefined;
  const out = [];
  let failed = false;
  values.forEach((value, index) => {
    if (typeof value !== 'string') {
      out[index] = value;
      return;
    }
    const translated = translateText(value, translations, `${context}[${index}]`, issues);
    if (translated === undefined && value.trim() !== '') failed = true;
    out[index] = translated === undefined ? '' : translated;
  });
  return failed ? undefined : out;
}

function newIssues() {
  return {
    conflicts: [],
    missingTranslations: [],
    completeness: [],
    warnings: [],
  };
}

function addChange(op, doc, targetPath, after, reason, options = {}) {
  const before = getPathState(doc, targetPath);
  const afterExists = options.afterExists !== false;

  if (afterExists && before.exists && deepEqual(before.value, after)) return;
  if (!afterExists && !before.exists) return;

  if (!options.allowSourceRewrite && afterExists && before.exists && isNonEmpty(before.value)) {
    op.issues.conflicts.push({
      collection: op.collection,
      id: op.id,
      label: op.label,
      path: targetPath,
      current: clone(before.value),
      proposed: clone(after),
      reason,
    });
    return;
  }

  op.changes.push({
    path: targetPath,
    reason,
    beforeExists: before.exists,
    before: clone(before.value),
    afterExists,
    after: afterExists ? clone(after) : undefined,
  });
}

function addTranslatedScalar(op, doc, sourcePath, targetPath, translations) {
  const source = getPathState(doc, sourcePath);
  if (!source.exists || !isNonEmpty(source.value)) return;
  if (typeof source.value !== 'string') {
    op.issues.warnings.push({ collection: op.collection, id: op.id, path: sourcePath, message: 'Expected string source' });
    return;
  }
  const translated = translateText(source.value, translations, `${op.collection}:${op.id}:${sourcePath}`, op.issues);
  if (translated !== undefined) addChange(op, doc, targetPath, translated, `translate ${sourcePath}`);
}

function addTranslatedArray(op, doc, sourcePath, targetPath, translations) {
  const source = getPathState(doc, sourcePath);
  if (!source.exists || !Array.isArray(source.value) || source.value.length === 0) return;
  const translated = translateArray(source.value, translations, `${op.collection}:${op.id}:${sourcePath}`, op.issues);
  if (translated !== undefined) addChange(op, doc, targetPath, translated, `translate ${sourcePath}`);
}

function addTranslatedObjectValues(op, doc, sourcePath, targetPath, translations) {
  const source = getPathState(doc, sourcePath);
  if (!source.exists || !source.value || typeof source.value !== 'object' || Array.isArray(source.value)) return;
  const translated = {};
  let failed = false;
  for (const [key, value] of Object.entries(source.value)) {
    if (typeof value !== 'string') {
      translated[key] = value;
      continue;
    }
    const next = translateText(value, translations, `${op.collection}:${op.id}:${sourcePath}.${key}`, op.issues);
    if (next === undefined && value.trim() !== '') failed = true;
    else translated[key] = next;
  }
  if (!failed) addChange(op, doc, targetPath, translated, `translate ${sourcePath} values`);
}

function addNestedArrayCompanions(op, doc, arrayPath, pairs, translations) {
  const state = getPathState(doc, arrayPath);
  if (!state.exists || !Array.isArray(state.value)) return;
  state.value.forEach((item, index) => {
    if (!item || typeof item !== 'object') return;
    for (const [sourceField, targetField] of pairs) {
      const value = item[sourceField];
      if (!isNonEmpty(value) || typeof value !== 'string') continue;
      const translated = translateText(value, translations, `${op.collection}:${op.id}:${arrayPath}.${index}.${sourceField}`, op.issues);
      if (translated !== undefined) {
        addChange(op, doc, `${arrayPath}.${index}.${targetField}`, translated, `translate ${arrayPath}.${index}.${sourceField}`);
      }
    }
  });
}

const SPECS = {
  abouts: {
    model: 'about',
    scalars: [
      ['hero.title', 'hero.titleEn'], ['hero.subtitle', 'hero.subtitleEn'], ['hero.badge', 'hero.badgeEn'],
      ['hero.primaryButtonText', 'hero.primaryButtonTextEn'], ['hero.secondaryButtonText', 'hero.secondaryButtonTextEn'],
      ['vision', 'visionEn'], ['mission', 'missionEn'], ['approach', 'approachEn'],
      ['story.title', 'story.titleEn'], ['story.description', 'story.descriptionEn'], ['story.closingStatement', 'story.closingStatementEn'],
      ['teamNote.title', 'teamNote.titleEn'], ['teamNote.description', 'teamNote.descriptionEn'],
      ['cta.title', 'cta.titleEn'], ['cta.description', 'cta.descriptionEn'], ['cta.buttonText', 'cta.buttonTextEn'], ['cta.secondaryButtonText', 'cta.secondaryButtonTextEn'],
      ['seo.metaTitle', 'seo.metaTitleEn'], ['seo.metaDescription', 'seo.metaDescriptionEn'],
    ],
    arrays: [
      ['hero.trustBadges', 'hero.trustBadgesEn'], ['story.painPoints', 'story.painPointsEn'],
      ['teamNote.highlights', 'teamNote.highlightsEn'], ['seo.keywords', 'seo.keywordsEn'],
    ],
    nested: [
      ['thinking', [['title', 'titleEn'], ['description', 'descriptionEn'], ['result', 'resultEn']]],
      ['differentiators', [['title', 'titleEn'], ['description', 'descriptionEn'], ['badge', 'badgeEn']]],
      ['process', [['title', 'titleEn'], ['description', 'descriptionEn'], ['deliverable', 'deliverableEn']]],
      ['values', [['title', 'titleEn'], ['description', 'descriptionEn'], ['example', 'exampleEn']]],
      ['stats', [['label', 'labelEn'], ['suffix', 'suffixEn'], ['description', 'descriptionEn']]],
    ],
  },
  blogs: {
    model: 'blog',
    scalars: [
      ['title', 'titleEn'], ['content', 'contentEn'], ['excerpt', 'excerptEn'], ['coverAlt', 'coverAltEn'],
      ['authorName', 'authorNameEn'], ['authorRole', 'authorRoleEn'], ['category', 'categoryEn'],
      ['ctaTitle', 'ctaTitleEn'], ['ctaDescription', 'ctaDescriptionEn'], ['ctaButtonText', 'ctaButtonTextEn'],
      ['seo.metaTitle', 'seo.metaTitleEn'], ['seo.metaDescription', 'seo.metaDescriptionEn'],
      ['seo.ogTitle', 'seo.ogTitleEn'], ['seo.ogDescription', 'seo.ogDescriptionEn'],
      ['seo.twitterTitle', 'seo.twitterTitleEn'], ['seo.twitterDescription', 'seo.twitterDescriptionEn'],
    ],
    arrays: [['tags', 'tagsEn'], ['summaryPoints', 'summaryPointsEn'], ['seo.keywords', 'seo.keywordsEn']],
  },
  companyinfos: { model: 'companyInfo', scalars: [['address', 'addressEn'], ['workingHours', 'workingHoursEn']] },
  faqs: { model: 'faq', scalars: [['question', 'questionEn'], ['answer', 'answerEn'], ['category', 'categoryEn']] },
  hostingpackages: {
    model: 'hosting',
    scalars: [
      ['name', 'nameEn'], ['description', 'descriptionEn'], ['storage', 'storageEn'], ['bandwidth', 'bandwidthEn'],
      ['ram', 'ramEn'], ['cpu', 'cpuEn'], ['domains', 'domainsEn'],
    ],
    arrays: [['features', 'featuresEn']],
    objects: [['benefitHints', 'benefitHintsEn']],
  },
  projectcategories: { model: 'projectCategory', scalars: [['label', 'labelEn'], ['description', 'descriptionEn']] },
  projects: {
    model: 'project',
    scalars: [
      ['title', 'titleEn'], ['summary', 'summaryEn'], ['challenge', 'challengeEn'], ['solution', 'solutionEn'],
      ['clientName', 'clientNameEn'], ['industry', 'industryEn'], ['duration', 'durationEn'],
      ['seo.metaTitle', 'seo.metaTitleEn'], ['seo.metaDescription', 'seo.metaDescriptionEn'],
    ],
    arrays: [['features', 'featuresEn'], ['seo.keywords', 'seo.keywordsEn']],
    nested: [
      ['results', [['label', 'labelEn'], ['value', 'valueEn']]],
      ['stats', [['label', 'labelEn'], ['value', 'valueEn'], ['description', 'descriptionEn']]],
    ],
  },
  services: {
    model: 'service',
    scalars: [['title', 'titleEn'], ['description', 'descriptionEn'], ['shortDescription', 'shortDescriptionEn']],
    arrays: [['features', 'featuresEn']],
  },
  teammembers: {
    model: 'team',
    scalars: [['fullName', 'fullNameEn'], ['role', 'roleEn'], ['bio', 'bioEn'], ['funFact', 'funFactEn']],
    arrays: [['specializations', 'specializationsEn']],
  },
  technologies: { model: 'technology', scalars: [['description', 'descriptionEn'], ['tooltip', 'tooltipEn']] },
  testimonials: {
    model: 'testimonial',
    scalars: [['clientName', 'clientNameEn'], ['position', 'positionEn'], ['companyName', 'companyNameEn'], ['content', 'contentEn']],
  },
};

const PROJECT_CATEGORY_CODES = {
  'Web App': 'website',
  'Mobile App': 'mobile',
  'E-Commerce': 'ecommerce',
  Automation: 'automation',
  Other: 'other',
  'ٍSaaS': 'saas',
  SaaS: 'saas',
};

const FAQ_CATEGORY_KEYS = {
  'عام': 'general',
  'تقني': 'technical',
  'خدمات': 'services',
  'استضافة': 'hosting',
};

const BLOG_CATEGORY_KEYS = {
  'عام': 'general',
  'الذكاء الاصطناعي': 'artificial-intelligence',
};

function applyNormalizations(op, doc, translations) {
  if (op.collection === 'projectcategories') {
    const current = doc.value;
    const next = PROJECT_CATEGORY_CODES[current];
    if (next && current !== next) {
      addChange(op, doc, 'value', next, 'normalize project category stable code', { allowSourceRewrite: true });
    }
  }

  if (op.collection === 'faqs') {
    const key = FAQ_CATEGORY_KEYS[doc.category] || (typeof doc.categoryKey === 'string' && doc.categoryKey.trim() ? doc.categoryKey.trim().toLowerCase() : null);
    if (key && doc.categoryKey !== key) {
      addChange(op, doc, 'categoryKey', key, 'backfill FAQ stable categoryKey', { allowSourceRewrite: true });
    }
  }

  if (op.collection === 'blogs') {
    if (!isNonEmpty(doc.category)) {
      addChange(op, doc, 'category', 'عام', 'backfill legacy Blog category', { allowSourceRewrite: true });
      addChange(op, doc, 'categoryEn', 'General', 'backfill legacy Blog English category');
      addChange(op, doc, 'categoryKey', 'general', 'backfill legacy Blog categoryKey', { allowSourceRewrite: true });
    } else {
      const key = BLOG_CATEGORY_KEYS[doc.category] || (typeof doc.categoryKey === 'string' && doc.categoryKey.trim() ? doc.categoryKey.trim().toLowerCase() : null);
      if (key && doc.categoryKey !== key) {
        addChange(op, doc, 'categoryKey', key, 'normalize Blog categoryKey', { allowSourceRewrite: true });
      }
      if (!isNonEmpty(doc.categoryEn)) {
        const translated = translateText(doc.category, translations, `blogs:${op.id}:category`, op.issues);
        if (translated !== undefined) addChange(op, doc, 'categoryEn', translated, 'translate category');
      }
    }
    // canonical is generated from locale + slug now; remove stale legacy field if present.
    const canonical = getPathState(doc, 'seo.canonicalUrl');
    if (canonical.exists) {
      addChange(op, doc, 'seo.canonicalUrl', undefined, 'remove stale legacy canonicalUrl; runtime generates canonical', { afterExists: false, allowSourceRewrite: true });
    }
  }

  if (op.collection === 'technologies' && doc.name === 'Garfana') {
    addChange(op, doc, 'name', 'Grafana', 'correct canonical technology brand typo', { allowSourceRewrite: true });
  }

  if (op.collection === 'leads') {
    if (!isNonEmpty(doc.locale)) {
      addChange(op, doc, 'locale', 'ar', 'backfill historical lead locale; site was Arabic-first', { allowSourceRewrite: true });
    }
    const answers = doc.projectAnswers && typeof doc.projectAnswers === 'object' ? doc.projectAnswers : null;
    if (answers) {
      const normalized = { ...answers };
      let changed = false;
      if (normalized.platforms === 'Android first') { normalized.platforms = 'android'; changed = true; }
      if (normalized.platforms === 'Android & iOS') { normalized.platforms = 'both'; changed = true; }
      if (normalized.productScope === 'MVP') { normalized.productScope = 'mvp'; changed = true; }
      if (normalized.productScope === 'Full Product') { normalized.productScope = 'full_product'; changed = true; }
      if (changed) addChange(op, doc, 'projectAnswers', normalized, 'normalize legacy quote answers to stable codes/booleans', { allowSourceRewrite: true });
    }
  }
}

function applySpec(op, doc, spec, translations) {
  for (const [source, target] of spec.scalars || []) addTranslatedScalar(op, doc, source, target, translations);
  for (const [source, target] of spec.arrays || []) addTranslatedArray(op, doc, source, target, translations);
  for (const [source, target] of spec.objects || []) addTranslatedObjectValues(op, doc, source, target, translations);
  for (const [arrayPath, pairs] of spec.nested || []) addNestedArrayCompanions(op, doc, arrayPath, pairs, translations);
}

// ---- Completeness verification: mirrors backend/public-content rules finalized before migration. ----
function asRecord(v) { return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; }
function asArray(v) { return Array.isArray(v) ? v : []; }
function readPath(record, p) { return getPathState(record, p).value; }
function requireField(missing, record, p) { if (!isNonEmpty(readPath(record, p))) missing.push(p); }
function requireCompanion(missing, record, source, target) { if (isNonEmpty(readPath(record, source)) && !isNonEmpty(readPath(record, target))) missing.push(target); }
function requireArray(missing, record, source, target) {
  const a = asArray(readPath(record, source)); const b = asArray(readPath(record, target));
  a.forEach((x, i) => { if (isNonEmpty(x) && !isNonEmpty(b[i])) missing.push(`${target}[${i}]`); });
}
function requireRecord(missing, record, source, target) {
  const a = asRecord(readPath(record, source)); const b = asRecord(readPath(record, target));
  for (const k of Object.keys(a)) if (isNonEmpty(a[k]) && !isNonEmpty(b[k])) missing.push(`${target}.${k}`);
}

function missingEnglish(model, record) {
  const missing = [];
  const required = {
    project: ['titleEn','summaryEn','challengeEn','solutionEn','seo.metaTitleEn','seo.metaDescriptionEn'],
    blog: ['titleEn','excerptEn','contentEn','categoryEn','seo.metaTitleEn','seo.metaDescriptionEn'],
    faq: ['questionEn','answerEn','categoryEn'],
    service: ['titleEn','shortDescriptionEn','descriptionEn'],
    hosting: ['nameEn','descriptionEn'],
    projectCategory: ['labelEn'],
    team: ['fullNameEn','roleEn'],
    testimonial: ['clientNameEn','contentEn'],
    companyInfo: ['addressEn','workingHoursEn'],
    about: ['hero.titleEn','hero.subtitleEn','visionEn','missionEn','approachEn','cta.titleEn','cta.descriptionEn','cta.buttonTextEn','seo.metaTitleEn','seo.metaDescriptionEn'],
    technology: [],
  };
  for (const p of required[model] || []) requireField(missing, record, p);

  if (model === 'project') {
    requireArray(missing, record, 'features', 'featuresEn');
    for (const f of ['clientName','industry','duration']) requireCompanion(missing, record, f, `${f}En`);
    requireArray(missing, record, 'seo.keywords', 'seo.keywordsEn');
    asArray(record.results).forEach((x,i)=>{ const r=asRecord(x); requireField(missing,r,'labelEn'); requireField(missing,r,'valueEn'); if (!isNonEmpty(r.labelEn)){} });
    // Prefix nested paths for clearer reporting.
    const resultMissing=[]; asArray(record.results).forEach((x,i)=>{const r=asRecord(x); if(!isNonEmpty(r.labelEn))resultMissing.push(`results.${i}.labelEn`); if(!isNonEmpty(r.valueEn))resultMissing.push(`results.${i}.valueEn`);});
    // Remove unprefixed duplicates added immediately above.
    for (let i=missing.length-1;i>=0;i--) if (missing[i]==='labelEn'||missing[i]==='valueEn') missing.splice(i,1);
    missing.push(...resultMissing);
    asArray(record.stats).forEach((x,i)=>{const r=asRecord(x); if(!isNonEmpty(r.labelEn))missing.push(`stats.${i}.labelEn`); if(!isNonEmpty(r.valueEn))missing.push(`stats.${i}.valueEn`); if(isNonEmpty(r.description)&&!isNonEmpty(r.descriptionEn))missing.push(`stats.${i}.descriptionEn`);});
  }
  if (model === 'blog') {
    requireArray(missing, record, 'summaryPoints', 'summaryPointsEn');
    requireArray(missing, record, 'tags', 'tagsEn');
    requireCompanion(missing, record, 'coverAlt', 'coverAltEn');
    requireCompanion(missing, record, 'authorName', 'authorNameEn');
    requireCompanion(missing, record, 'authorRole', 'authorRoleEn');
    for (const f of ['ctaTitle','ctaDescription','ctaButtonText']) requireCompanion(missing, record, f, `${f}En`);
    requireArray(missing, record, 'seo.keywords', 'seo.keywordsEn');
    for (const f of ['ogTitle','ogDescription','twitterTitle','twitterDescription']) requireCompanion(missing, record, `seo.${f}`, `seo.${f}En`);
  }
  if (model === 'service') requireArray(missing, record, 'features', 'featuresEn');
  if (model === 'hosting') {
    requireArray(missing, record, 'features', 'featuresEn');
    for (const f of ['storage','bandwidth','ram','cpu','domains']) requireCompanion(missing, record, f, `${f}En`);
    requireRecord(missing, record, 'benefitHints', 'benefitHintsEn');
  }
  if (model === 'projectCategory') requireCompanion(missing, record, 'description', 'descriptionEn');
  if (model === 'team') { requireCompanion(missing,record,'bio','bioEn'); requireCompanion(missing,record,'funFact','funFactEn'); requireArray(missing,record,'specializations','specializationsEn'); }
  if (model === 'technology') { requireCompanion(missing,record,'description','descriptionEn'); requireCompanion(missing,record,'tooltip','tooltipEn'); }
  if (model === 'testimonial') { requireCompanion(missing,record,'position','positionEn'); requireCompanion(missing,record,'companyName','companyNameEn'); }
  if (model === 'about') {
    for (const f of ['badge','primaryButtonText','secondaryButtonText']) requireCompanion(missing,record,`hero.${f}`,`hero.${f}En`);
    requireArray(missing,record,'hero.trustBadges','hero.trustBadgesEn');
    for (const f of ['title','description','closingStatement']) requireCompanion(missing,record,`story.${f}`,`story.${f}En`);
    requireArray(missing,record,'story.painPoints','story.painPointsEn');
    const nested={thinking:['result'],differentiators:['badge'],process:['deliverable'],values:['example']};
    for (const [section,optional] of Object.entries(nested)) asArray(record[section]).forEach((x,i)=>{const r=asRecord(x); if(!isNonEmpty(r.titleEn))missing.push(`${section}.${i}.titleEn`); if(!isNonEmpty(r.descriptionEn))missing.push(`${section}.${i}.descriptionEn`); for(const f of optional)if(isNonEmpty(r[f])&&!isNonEmpty(r[`${f}En`]))missing.push(`${section}.${i}.${f}En`);});
    asArray(record.stats).forEach((x,i)=>{const r=asRecord(x); if(!isNonEmpty(r.labelEn))missing.push(`stats.${i}.labelEn`); if(isNonEmpty(r.description)&&!isNonEmpty(r.descriptionEn))missing.push(`stats.${i}.descriptionEn`); if(isNonEmpty(r.suffix)&&!isNonEmpty(r.suffixEn))missing.push(`stats.${i}.suffixEn`);});
    requireCompanion(missing,record,'teamNote.title','teamNote.titleEn'); requireCompanion(missing,record,'teamNote.description','teamNote.descriptionEn'); requireArray(missing,record,'teamNote.highlights','teamNote.highlightsEn');
    requireCompanion(missing,record,'cta.secondaryButtonText','cta.secondaryButtonTextEn'); requireArray(missing,record,'seo.keywords','seo.keywordsEn');
  }
  return [...new Set(missing)];
}

function isPubliclyVisible(model, doc) {
  if (model === 'project') return doc.isPublished !== false;
  if (model === 'blog') return doc.isPublished === true;
  if (['faq','service','hosting','projectCategory','team','testimonial','about'].includes(model)) return doc.isActive !== false;
  return true; // technology + companyInfo have no visibility flag.
}

function applyChangesToClone(doc, changes) {
  const next = clone(doc);
  for (const c of changes) {
    if (c.afterExists) setPath(next, c.path, clone(c.after));
    else unsetPath(next, c.path);
  }
  return next;
}

function docLabel(collection, doc) {
  return doc.slug || doc.title || doc.name || doc.fullName || doc.clientName || doc.question || doc.label || doc.email || String(doc._id);
}

function mergeIssues(globalIssues, opIssues) {
  for (const k of Object.keys(globalIssues)) globalIssues[k].push(...opIssues[k]);
}

async function buildPlan(db, translations, inventoryHash, expectedDb, strictBaseline) {
  const actualDb = db.databaseName;
  if (expectedDb && actualDb !== expectedDb) throw new Error(`Connected DB '${actualDb}' does not match --expected-db='${expectedDb}'`);

  const plan = {
    version: VERSION,
    generatedAt: new Date().toISOString(),
    databaseName: actualDb,
    inventoryHash,
    baselineCounts: BASELINE_COUNTS,
    counts: {},
    operations: [],
    issues: newIssues(),
    manualQualityWarnings: [],
  };

  const collections = [...Object.keys(SPECS), 'leads', 'newsletters'];
  for (const collection of collections) {
    const docs = await db.collection(collection).find({}).toArray();
    plan.counts[collection] = docs.length;
    const expected = BASELINE_COUNTS[collection];
    if (expected !== undefined && docs.length !== expected) {
      const warning = { collection, message: `Snapshot baseline count=${expected}, live count=${docs.length}` };
      plan.issues.warnings.push(warning);
      if (strictBaseline) throw new Error(`Strict baseline failed for ${collection}: expected ${expected}, got ${docs.length}`);
    }

    for (const doc of docs) {
      const op = { collection, model: SPECS[collection]?.model || null, id: String(doc._id), label: docLabel(collection, doc), changes: [], issues: newIssues() };
      const spec = SPECS[collection];
      if (spec) applySpec(op, doc, spec, translations);
      applyNormalizations(op, doc, translations);

      const hypothetical = applyChangesToClone(doc, op.changes);
      if (spec?.model && isPubliclyVisible(spec.model, hypothetical)) {
        const missing = missingEnglish(spec.model, hypothetical);
        if (missing.length) {
          op.issues.completeness.push({ collection, id: op.id, label: op.label, model: spec.model, missingFields: missing });
        }
      }

      // Known content-quality warnings are intentionally not auto-rewritten.
      if (collection === 'teammembers' && doc.fullName === 'إيمان جميل' && typeof doc.bio === 'string' && doc.bio.includes('قِيَل أن تُرى')) {
        plan.manualQualityWarnings.push({ collection, id: op.id, label: op.label, path: 'bio', message: 'Arabic bio contains known corrupted phrase; translation can migrate, but Arabic copy still needs owner-approved correction.' });
      }
      if (collection === 'projects' && typeof doc.title === 'string' && doc.title.includes('تجدد') && Array.isArray(doc.features)) {
        const badIndex = doc.features.findIndex((x) => typeof x === 'string' && x.includes('تقييمتقبال'));
        if (badIndex >= 0) plan.manualQualityWarnings.push({ collection, id: op.id, label: op.label, path: `features.${badIndex}`, message: 'Known corrupted Arabic feature copy. English translation can migrate; Arabic source should be corrected in a separate approved content patch.' });
      }
      if (collection === 'teammembers' && typeof doc.photo === 'string' && /[ÃØÙ]/.test(doc.photo)) {
        plan.manualQualityWarnings.push({ collection, id: op.id, label: op.label, path: 'photo', message: 'Possible mojibake R2 object key; DO NOT rewrite automatically. Verify object existence in R2 first.' });
      }

      mergeIssues(plan.issues, op.issues);
      if (op.changes.length) plan.operations.push({ collection: op.collection, model: op.model, id: op.id, label: op.label, changes: op.changes });
    }
  }

  plan.summary = summarizePlan(plan);
  return plan;
}

function summarizePlan(plan) {
  const byCollection = {};
  let fieldChanges = 0;
  for (const op of plan.operations) {
    if (!byCollection[op.collection]) byCollection[op.collection] = { documentsChanged: 0, fieldChanges: 0 };
    byCollection[op.collection].documentsChanged += 1;
    byCollection[op.collection].fieldChanges += op.changes.length;
    fieldChanges += op.changes.length;
  }
  return {
    documentsChanged: plan.operations.length,
    fieldChanges,
    conflicts: plan.issues.conflicts.length,
    missingTranslations: plan.issues.missingTranslations.length,
    completenessFailures: plan.issues.completeness.length,
    warnings: plan.issues.warnings.length,
    manualQualityWarnings: plan.manualQualityWarnings.length,
    byCollection,
  };
}

function printSummary(plan) {
  console.log('\n=== Smart Agency AR/EN Migration Plan ===');
  console.log(`DB: ${plan.databaseName}`);
  console.log(`Inventory SHA256: ${plan.inventoryHash}`);
  console.log(`Documents changed: ${plan.summary.documentsChanged}`);
  console.log(`Field changes: ${plan.summary.fieldChanges}`);
  console.log(`Conflicts: ${plan.summary.conflicts}`);
  console.log(`Missing translations: ${plan.summary.missingTranslations}`);
  console.log(`Completeness failures: ${plan.summary.completenessFailures}`);
  console.log(`Warnings: ${plan.summary.warnings}`);
  console.log(`Manual quality warnings: ${plan.summary.manualQualityWarnings}`);
  console.table(plan.summary.byCollection);
  if (plan.issues.conflicts.length) console.error('\nCONFLICTS:', JSON.stringify(plan.issues.conflicts, null, 2));
  if (plan.issues.missingTranslations.length) console.error('\nMISSING TRANSLATIONS:', JSON.stringify(plan.issues.missingTranslations, null, 2));
  if (plan.issues.completeness.length) console.error('\nCOMPLETENESS FAILURES:', JSON.stringify(plan.issues.completeness, null, 2));
  if (plan.issues.warnings.length) console.warn('\nWARNINGS:', JSON.stringify(plan.issues.warnings, null, 2));
  if (plan.manualQualityWarnings.length) console.warn('\nMANUAL QUALITY WARNINGS:', JSON.stringify(plan.manualQualityWarnings, null, 2));
}

function planHasBlockers(plan) {
  return plan.issues.conflicts.length > 0 || plan.issues.missingTranslations.length > 0 || plan.issues.completeness.length > 0;
}

async function assertPlanBeforeState(db, plan) {
  const mismatches = [];
  for (const op of plan.operations) {
    const doc = await db.collection(op.collection).findOne({ _id: new mongoose.Types.ObjectId(op.id) });
    if (!doc) { mismatches.push({ collection: op.collection, id: op.id, reason: 'document missing' }); continue; }
    for (const c of op.changes) {
      const state = getPathState(doc, c.path);
      if (state.exists !== c.beforeExists || (c.beforeExists && !deepEqual(state.value, c.before))) {
        mismatches.push({ collection: op.collection, id: op.id, path: c.path, expectedBefore: c.before, actual: state.value, expectedExists: c.beforeExists, actualExists: state.exists });
      }
    }
  }
  if (mismatches.length) throw new Error(`Database drift since dry-run. Refusing apply.\n${JSON.stringify(mismatches, null, 2)}`);
}

async function applyPlan(db, plan, session) {
  for (const op of plan.operations) {
    const $set = {}; const $unset = {};
    for (const c of op.changes) {
      if (c.afterExists) $set[c.path] = c.after;
      else $unset[c.path] = '';
    }
    const update = {};
    if (Object.keys($set).length) update.$set = $set;
    if (Object.keys($unset).length) update.$unset = $unset;
    const result = await db.collection(op.collection).updateOne(
      { _id: new mongoose.Types.ObjectId(op.id) },
      update,
      session ? { session } : undefined,
    );
    if (result.matchedCount !== 1) throw new Error(`Apply failed to match ${op.collection}/${op.id}`);
  }
}

async function verifyAfter(db, plan, expected = 'after') {
  const errors = [];
  for (const op of plan.operations) {
    const doc = await db.collection(op.collection).findOne({ _id: new mongoose.Types.ObjectId(op.id) });
    if (!doc) { errors.push({ collection: op.collection, id: op.id, reason: 'document missing' }); continue; }
    for (const c of op.changes) {
      const wantExists = expected === 'after' ? c.afterExists : c.beforeExists;
      const want = expected === 'after' ? c.after : c.before;
      const state = getPathState(doc, c.path);
      if (state.exists !== wantExists || (wantExists && !deepEqual(state.value, want))) {
        errors.push({ collection: op.collection, id: op.id, path: c.path, expectedState: expected, expected: want, actual: state.value, expectedExists: wantExists, actualExists: state.exists });
      }
    }
  }
  return errors;
}

async function rollbackJournal(db, journal, session, force) {
  const conflicts = [];
  if (!force) {
    for (const op of journal.plan.operations) {
      const doc = await db.collection(op.collection).findOne({ _id: new mongoose.Types.ObjectId(op.id) });
      if (!doc) { conflicts.push({ collection: op.collection, id: op.id, reason: 'document missing' }); continue; }
      for (const c of op.changes) {
        const state = getPathState(doc, c.path);
        if (state.exists !== c.afterExists || (c.afterExists && !deepEqual(state.value, c.after))) {
          conflicts.push({ collection: op.collection, id: op.id, path: c.path, message: 'Field changed after migration; rollback refuses to overwrite it', current: state.value, expectedMigrationValue: c.after });
        }
      }
    }
  }
  if (conflicts.length) throw new Error(`Rollback safety conflicts. Resolve manually or use --force-rollback only after review.\n${JSON.stringify(conflicts, null, 2)}`);

  for (const op of [...journal.plan.operations].reverse()) {
    const $set = {}; const $unset = {};
    for (const c of op.changes) {
      if (c.beforeExists) $set[c.path] = c.before;
      else $unset[c.path] = '';
    }
    const update = {};
    if (Object.keys($set).length) update.$set = $set;
    if (Object.keys($unset).length) update.$unset = $unset;
    const result = await db.collection(op.collection).updateOne(
      { _id: new mongoose.Types.ObjectId(op.id) }, update, session ? { session } : undefined,
    );
    if (result.matchedCount !== 1) throw new Error(`Rollback failed to match ${op.collection}/${op.id}`);
  }
}

async function runTransactional(fn, allowNonTransactional) {
  const session = await mongoose.connection.startSession();
  try {
    try {
      await session.withTransaction(() => fn(session), {
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
      });
    } catch (err) {
      if (!allowNonTransactional) throw new Error(`Transactional apply failed. No fallback allowed. ${err.message}`);
      console.warn('WARNING: transaction failed and --allow-nontransactional was supplied. Continuing without transaction.');
      await fn(null);
    }
  } finally {
    await session.endSession();
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI environment variable is required. Do not pass DB credentials on the command line.');

  const inventoryFile = path.resolve(args.inventory || path.join(__dirname, 'translations.database.json'));
  if (!fs.existsSync(inventoryFile)) throw new Error(`Translation inventory not found: ${inventoryFile}`);
  const inventoryHash = sha256File(inventoryFile);
  const { normalized: translations } = loadTranslationData(inventoryFile);

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB connection has no database selected');
  const expectedDb = args['expected-db'] || process.env.EXPECTED_DB_NAME;
  if (expectedDb && db.databaseName !== expectedDb) throw new Error(`Connected DB '${db.databaseName}' does not match expected '${expectedDb}'`);

  try {
    if (args['dry-run']) {
      const plan = await buildPlan(db, translations, inventoryHash, expectedDb, !!args['strict-baseline']);
      printSummary(plan);
      const file = path.resolve(args['plan-out'] || `migration-runs/localization-plan-${timestampForFile()}.json`);
      ensureDir(file); fs.writeFileSync(file, JSON.stringify(plan, null, 2));
      console.log(`\nDRY RUN ONLY — NO WRITES PERFORMED.\nPlan: ${file}\nPlan SHA256: ${sha256File(file)}`);
      if (planHasBlockers(plan)) {
        console.error('\nBLOCKED: resolve conflicts/missing translations/completeness failures before apply.');
        process.exitCode = 2;
      } else {
        console.log('\nDRY RUN PASS: plan has no migration blockers. Review warnings manually before apply.');
      }
      return;
    }

    if (args.apply) {
      if (args.confirm !== APPLY_CONFIRM) throw new Error(`Apply requires --confirm=${APPLY_CONFIRM}`);
      if (!args.plan) throw new Error('--apply requires --plan=<reviewed-plan.json>');
      const planFile = path.resolve(args.plan);
      const plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
      if (plan.version !== VERSION) throw new Error(`Unexpected plan version: ${plan.version}`);
      if (plan.databaseName !== db.databaseName) throw new Error(`Plan DB '${plan.databaseName}' != connected DB '${db.databaseName}'`);
      if (plan.inventoryHash !== inventoryHash) throw new Error('Translation inventory hash changed since dry-run. Re-run dry-run.');
      if (planHasBlockers(plan)) throw new Error('Reviewed plan contains blockers. Apply refused.');
      await assertPlanBeforeState(db, plan);

      const journalFile = path.resolve(args['journal-out'] || `migration-runs/localization-journal-${timestampForFile()}.json`);
      ensureDir(journalFile);
      const journal = { version: VERSION, status: 'PREPARED', preparedAt: new Date().toISOString(), planFile, planSha256: sha256File(planFile), inventoryFile, inventoryHash, databaseName: db.databaseName, plan };
      fs.writeFileSync(journalFile, JSON.stringify(journal, null, 2));
      console.log(`Rollback journal prepared BEFORE writes: ${journalFile}`);

      await runTransactional((session) => applyPlan(db, plan, session), !!args['allow-nontransactional']);
      const errors = await verifyAfter(db, plan, 'after');
      if (errors.length) throw new Error(`Post-apply verification failed:\n${JSON.stringify(errors, null, 2)}`);
      journal.status = 'APPLIED_AND_VERIFIED'; journal.appliedAt = new Date().toISOString();
      fs.writeFileSync(journalFile, JSON.stringify(journal, null, 2));
      console.log(`\nAPPLY PASS. Journal: ${journalFile}\nJournal SHA256: ${sha256File(journalFile)}`);
      return;
    }

    if (args.verify) {
      if (!args.plan) throw new Error('--verify requires --plan=<plan.json>');
      const plan = JSON.parse(fs.readFileSync(path.resolve(args.plan), 'utf8'));
      if (plan.databaseName !== db.databaseName) throw new Error(`Plan DB '${plan.databaseName}' != connected DB '${db.databaseName}'`);
      const errors = await verifyAfter(db, plan, 'after');
      if (errors.length) throw new Error(`VERIFY FAIL:\n${JSON.stringify(errors, null, 2)}`);
      console.log(`VERIFY PASS: ${plan.operations.length} changed documents match the planned post-migration state exactly.`);
      return;
    }

    if (args.rollback) {
      if (args.confirm !== ROLLBACK_CONFIRM) throw new Error(`Rollback requires --confirm=${ROLLBACK_CONFIRM}`);
      if (!args.journal) throw new Error('--rollback requires --journal=<journal.json>');
      const journalFile = path.resolve(args.journal);
      const journal = JSON.parse(fs.readFileSync(journalFile, 'utf8'));
      if (journal.version !== VERSION) throw new Error(`Unexpected journal version: ${journal.version}`);
      if (journal.databaseName !== db.databaseName) throw new Error(`Journal DB '${journal.databaseName}' != connected DB '${db.databaseName}'`);
      await runTransactional((session) => rollbackJournal(db, journal, session, !!args['force-rollback']), !!args['allow-nontransactional']);
      const errors = await verifyAfter(db, journal.plan, 'before');
      if (errors.length) throw new Error(`ROLLBACK verification failed:\n${JSON.stringify(errors, null, 2)}`);
      journal.status = 'ROLLED_BACK_AND_VERIFIED'; journal.rolledBackAt = new Date().toISOString();
      fs.writeFileSync(journalFile, JSON.stringify(journal, null, 2));
      console.log(`ROLLBACK PASS: all migration-touched fields restored to their exact pre-migration state.\nJournal: ${journalFile}`);
      return;
    }
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('\nFATAL:', err && err.stack ? err.stack : err);
  process.exit(1);
});

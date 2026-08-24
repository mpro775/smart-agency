export type PublicContentModel =
  | 'project'
  | 'blog'
  | 'faq'
  | 'service'
  | 'hosting'
  | 'projectCategory'
  | 'team'
  | 'technology'
  | 'testimonial'
  | 'companyInfo'
  | 'about';

type ContentRecord = Record<string, unknown>;

const asRecord = (value: unknown): ContentRecord =>
  value !== null && typeof value === 'object' ? (value as ContentRecord) : {};

const asArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const readPath = (record: ContentRecord, path: string): unknown =>
  path.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') return undefined;
    return (current as ContentRecord)[key];
  }, record);

const hasContent = (value: unknown): boolean => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (value !== null && typeof value === 'object') {
    return Object.keys(value).length > 0;
  }
  return value !== null && value !== undefined;
};

const requireField = (
  missing: string[],
  record: ContentRecord,
  path: string,
) => {
  const value = readPath(record, path);
  if (!hasContent(value)) missing.push(path);
};

const requireCompanionWhenSourceExists = (
  missing: string[],
  record: ContentRecord,
  sourcePath: string,
  englishPath: string,
) => {
  if (
    hasContent(readPath(record, sourcePath)) &&
    !hasContent(readPath(record, englishPath))
  ) {
    missing.push(englishPath);
  }
};

const requireTranslatedArray = (
  missing: string[],
  record: ContentRecord,
  sourceField: string,
  englishField: string,
) => {
  const source = asArray(readPath(record, sourceField));
  const english = asArray(readPath(record, englishField));

  for (const [index, sourceItem] of source.entries()) {
    if (hasContent(sourceItem) && !hasContent(english[index])) {
      missing.push(`${englishField}[${index}]`);
    }
  }
};

const requireTranslatedRecord = (
  missing: string[],
  record: ContentRecord,
  sourceField: string,
  englishField: string,
) => {
  const source = asRecord(readPath(record, sourceField));
  const english = asRecord(readPath(record, englishField));
  const sourceKeys = Object.keys(source);

  for (const key of sourceKeys) {
    if (hasContent(source[key]) && !hasContent(english[key])) {
      missing.push(`${englishField}.${key}`);
    }
  }
};

export function getMissingEnglishFields(
  model: PublicContentModel,
  input: unknown,
): string[] {
  const record = (input ?? {}) as ContentRecord;
  const missing: string[] = [];

  const requiredByModel: Partial<Record<PublicContentModel, string[]>> = {
    project: [
      'titleEn',
      'summaryEn',
      'challengeEn',
      'solutionEn',
      'seo.metaTitleEn',
      'seo.metaDescriptionEn',
    ],
    blog: [
      'titleEn',
      'excerptEn',
      'contentEn',
      'categoryEn',
      'seo.metaTitleEn',
      'seo.metaDescriptionEn',
    ],
    faq: ['questionEn', 'answerEn', 'categoryEn'],
    service: ['titleEn', 'shortDescriptionEn', 'descriptionEn'],
    hosting: ['nameEn', 'descriptionEn'],
    projectCategory: ['labelEn'],
    team: ['fullNameEn', 'roleEn'],
    testimonial: ['clientNameEn', 'contentEn'],
    companyInfo: ['addressEn', 'workingHoursEn'],
    about: [
      'hero.titleEn',
      'hero.subtitleEn',
      'visionEn',
      'missionEn',
      'approachEn',
      'cta.titleEn',
      'cta.descriptionEn',
      'cta.buttonTextEn',
      'seo.metaTitleEn',
      'seo.metaDescriptionEn',
    ],
  };

  for (const path of requiredByModel[model] ?? []) {
    requireField(missing, record, path);
  }

  if (model === 'project') {
    requireTranslatedArray(missing, record, 'features', 'featuresEn');
    for (const field of ['clientName', 'industry', 'duration']) {
      requireCompanionWhenSourceExists(missing, record, field, `${field}En`);
    }
    requireTranslatedArray(missing, record, 'seo.keywords', 'seo.keywordsEn');
    for (const [index, value] of asArray(record.results).entries()) {
      const item = asRecord(value);
      const itemMissing: string[] = [];
      requireField(itemMissing, item, 'labelEn');
      requireField(itemMissing, item, 'valueEn');
      missing.push(...itemMissing.map((field) => `results.${index}.${field}`));
    }
    for (const [index, value] of asArray(record.stats).entries()) {
      const item = asRecord(value);
      const itemMissing: string[] = [];
      requireField(itemMissing, item, 'labelEn');
      requireField(itemMissing, item, 'valueEn');
      requireCompanionWhenSourceExists(
        itemMissing,
        item,
        'description',
        'descriptionEn',
      );
      missing.push(...itemMissing.map((field) => `stats.${index}.${field}`));
    }
  }

  if (model === 'blog') {
    requireTranslatedArray(missing, record, 'summaryPoints', 'summaryPointsEn');
    requireTranslatedArray(missing, record, 'tags', 'tagsEn');
    requireCompanionWhenSourceExists(missing, record, 'coverAlt', 'coverAltEn');
    requireCompanionWhenSourceExists(
      missing,
      record,
      'authorName',
      'authorNameEn',
    );
    requireCompanionWhenSourceExists(
      missing,
      record,
      'authorRole',
      'authorRoleEn',
    );
    for (const field of ['ctaTitle', 'ctaDescription', 'ctaButtonText']) {
      requireCompanionWhenSourceExists(missing, record, field, `${field}En`);
    }
    requireTranslatedArray(missing, record, 'seo.keywords', 'seo.keywordsEn');
    for (const field of [
      'ogTitle',
      'ogDescription',
      'twitterTitle',
      'twitterDescription',
    ]) {
      requireCompanionWhenSourceExists(
        missing,
        record,
        `seo.${field}`,
        `seo.${field}En`,
      );
    }
  }

  if (model === 'service') {
    requireTranslatedArray(missing, record, 'features', 'featuresEn');
  }

  if (model === 'hosting') {
    requireTranslatedArray(missing, record, 'features', 'featuresEn');
    for (const field of ['storage', 'bandwidth', 'ram', 'cpu', 'domains']) {
      requireCompanionWhenSourceExists(missing, record, field, `${field}En`);
    }
    requireTranslatedRecord(missing, record, 'benefitHints', 'benefitHintsEn');
  }

  if (model === 'projectCategory') {
    requireCompanionWhenSourceExists(
      missing,
      record,
      'description',
      'descriptionEn',
    );
  }

  if (model === 'team') {
    requireCompanionWhenSourceExists(missing, record, 'bio', 'bioEn');
    requireCompanionWhenSourceExists(missing, record, 'funFact', 'funFactEn');
    requireTranslatedArray(
      missing,
      record,
      'specializations',
      'specializationsEn',
    );
  }

  if (model === 'technology') {
    requireCompanionWhenSourceExists(
      missing,
      record,
      'description',
      'descriptionEn',
    );
    requireCompanionWhenSourceExists(missing, record, 'tooltip', 'tooltipEn');
  }

  if (model === 'testimonial') {
    requireCompanionWhenSourceExists(missing, record, 'position', 'positionEn');
    requireCompanionWhenSourceExists(
      missing,
      record,
      'companyName',
      'companyNameEn',
    );
  }

  if (model === 'about') {
    for (const field of ['badge', 'primaryButtonText', 'secondaryButtonText']) {
      requireCompanionWhenSourceExists(
        missing,
        record,
        `hero.${field}`,
        `hero.${field}En`,
      );
    }
    requireTranslatedArray(
      missing,
      record,
      'hero.trustBadges',
      'hero.trustBadgesEn',
    );

    for (const field of ['title', 'description', 'closingStatement']) {
      requireCompanionWhenSourceExists(
        missing,
        record,
        `story.${field}`,
        `story.${field}En`,
      );
    }
    requireTranslatedArray(
      missing,
      record,
      'story.painPoints',
      'story.painPointsEn',
    );

    const nestedSections: Record<string, string[]> = {
      thinking: ['result'],
      differentiators: ['badge'],
      process: ['deliverable'],
      values: ['example'],
    };
    for (const [section, optionalFields] of Object.entries(nestedSections)) {
      for (const [index, value] of asArray(record[section]).entries()) {
        const item = asRecord(value);
        const itemMissing: string[] = [];
        requireField(itemMissing, item, 'titleEn');
        requireField(itemMissing, item, 'descriptionEn');
        for (const field of optionalFields) {
          requireCompanionWhenSourceExists(
            itemMissing,
            item,
            field,
            `${field}En`,
          );
        }
        missing.push(
          ...itemMissing.map((field) => `${section}.${index}.${field}`),
        );
      }
    }
    for (const [index, value] of asArray(record.stats).entries()) {
      const item = asRecord(value);
      const itemMissing: string[] = [];
      requireField(itemMissing, item, 'labelEn');
      requireCompanionWhenSourceExists(
        itemMissing,
        item,
        'description',
        'descriptionEn',
      );
      requireCompanionWhenSourceExists(itemMissing, item, 'suffix', 'suffixEn');
      missing.push(...itemMissing.map((field) => `stats.${index}.${field}`));
    }
    requireCompanionWhenSourceExists(
      missing,
      record,
      'teamNote.title',
      'teamNote.titleEn',
    );
    requireCompanionWhenSourceExists(
      missing,
      record,
      'teamNote.description',
      'teamNote.descriptionEn',
    );
    requireTranslatedArray(
      missing,
      record,
      'teamNote.highlights',
      'teamNote.highlightsEn',
    );
    requireCompanionWhenSourceExists(
      missing,
      record,
      'cta.secondaryButtonText',
      'cta.secondaryButtonTextEn',
    );
    requireTranslatedArray(missing, record, 'seo.keywords', 'seo.keywordsEn');
  }

  return [...new Set(missing)];
}

export function hasCompleteEnglishTranslation(
  model: PublicContentModel,
  input: unknown,
): boolean {
  return getMissingEnglishFields(model, input).length === 0;
}

export interface TranslationStatusResult {
  complete: boolean;
  missingFields: string[];
}

type ContentRecord = Record<string, unknown>;
type FieldPair = [source: string, english: string];

const asRecord = (value: unknown): ContentRecord =>
  value !== null && typeof value === "object" ? (value as ContentRecord) : {};

const readPath = (record: ContentRecord, path: string): unknown =>
  path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as ContentRecord)[key];
  }, record);

const hasContent = (value: unknown): boolean => {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (value !== null && typeof value === "object") {
    return Object.keys(value).length > 0;
  }
  return value !== null && value !== undefined;
};

const result = (missingFields: string[]): TranslationStatusResult => {
  const unique = [...new Set(missingFields)];
  return { complete: unique.length === 0, missingFields: unique };
};

const status = (
  item: unknown,
  required: string[],
  translatedArrays: FieldPair[] = [],
  companions: FieldPair[] = [],
  translatedRecords: FieldPair[] = [],
): TranslationStatusResult => {
  const record = asRecord(item);
  const missingFields = required.filter(
    (field) => !hasContent(readPath(record, field)),
  );

  for (const [sourceField, englishField] of translatedArrays) {
    const source = readPath(record, sourceField);
    const english = readPath(record, englishField);
    if (
      Array.isArray(source) &&
      source.length > 0 &&
      (!Array.isArray(english) ||
        source.length !== english.length ||
        english.some((value) => !hasContent(value)))
    ) {
      missingFields.push(englishField);
    }
  }

  for (const [sourceField, englishField] of companions) {
    if (
      hasContent(readPath(record, sourceField)) &&
      !hasContent(readPath(record, englishField))
    ) {
      missingFields.push(englishField);
    }
  }

  for (const [sourceField, englishField] of translatedRecords) {
    const source = asRecord(readPath(record, sourceField));
    const english = asRecord(readPath(record, englishField));
    if (Object.keys(source).some((key) => !hasContent(english[key]))) {
      missingFields.push(englishField);
    }
  }

  return result(missingFields);
};

const addNestedRequired = (
  base: TranslationStatusResult,
  item: unknown,
  arrayField: string,
  requiredFields: string[],
  companions: FieldPair[] = [],
): TranslationStatusResult => {
  const missing = [...base.missingFields];
  const values = asRecord(item)[arrayField];
  if (!Array.isArray(values)) return result(missing);

  values.forEach((value, index) => {
    const record = asRecord(value);
    requiredFields.forEach((field) => {
      if (!hasContent(readPath(record, field))) {
        missing.push(`${arrayField}.${index}.${field}`);
      }
    });
    companions.forEach(([sourceField, englishField]) => {
      if (
        hasContent(readPath(record, sourceField)) &&
        !hasContent(readPath(record, englishField))
      ) {
        missing.push(`${arrayField}.${index}.${englishField}`);
      }
    });
  });

  return result(missing);
};

export const getProjectTranslationStatus = (item: unknown) => {
  let current = status(
    item,
    [
      "titleEn",
      "summaryEn",
      "challengeEn",
      "solutionEn",
      "seo.metaTitleEn",
      "seo.metaDescriptionEn",
    ],
    [["features", "featuresEn"]],
  );
  current = addNestedRequired(current, item, "results", ["labelEn", "valueEn"]);
  return addNestedRequired(
    current,
    item,
    "stats",
    ["labelEn", "valueEn"],
    [["description", "descriptionEn"]],
  );
};

export const getBlogTranslationStatus = (item: unknown) =>
  status(
    item,
    [
      "titleEn",
      "excerptEn",
      "contentEn",
      "categoryEn",
      "seo.metaTitleEn",
      "seo.metaDescriptionEn",
    ],
    [
      ["summaryPoints", "summaryPointsEn"],
      ["tags", "tagsEn"],
    ],
    [
      ["coverAlt", "coverAltEn"],
      ["authorName", "authorNameEn"],
      ["authorRole", "authorRoleEn"],
    ],
  );

export const getFaqTranslationStatus = (item: unknown) =>
  status(item, ["questionEn", "answerEn", "categoryEn"]);

export const getServiceTranslationStatus = (item: unknown) =>
  status(
    item,
    ["titleEn", "shortDescriptionEn", "descriptionEn"],
    [["features", "featuresEn"]],
  );

export const getHostingTranslationStatus = (item: unknown) =>
  status(
    item,
    ["nameEn", "descriptionEn"],
    [["features", "featuresEn"]],
    [
      ["storage", "storageEn"],
      ["bandwidth", "bandwidthEn"],
      ["ram", "ramEn"],
      ["cpu", "cpuEn"],
      ["domains", "domainsEn"],
    ],
    [["benefitHints", "benefitHintsEn"]],
  );

export const getTeamTranslationStatus = (item: unknown) =>
  status(
    item,
    ["fullNameEn", "roleEn"],
    [["specializations", "specializationsEn"]],
    [
      ["bio", "bioEn"],
      ["funFact", "funFactEn"],
    ],
  );

export const getTechnologyTranslationStatus = (item: unknown) =>
  status(item, [], [], [
    ["description", "descriptionEn"],
    ["tooltip", "tooltipEn"],
  ]);

export const getTestimonialTranslationStatus = (item: unknown) =>
  status(item, ["clientNameEn", "contentEn"], [], [
    ["position", "positionEn"],
    ["companyName", "companyNameEn"],
  ]);

export const getProjectCategoryTranslationStatus = (item: unknown) =>
  status(item, ["labelEn"], [], [["description", "descriptionEn"]]);

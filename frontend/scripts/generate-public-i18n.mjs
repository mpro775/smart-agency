import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const frontendRoot = path.resolve(import.meta.dirname, '..');
const repositoryRoot = path.resolve(frontendRoot, '..');
const inventoryPath = path.join(
  repositoryRoot,
  'smart-agency-ar-en-localization-package',
  'smart-agency-ar-en-text-inventory.json',
);
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8')).filter(
  (item) => item.source_type === 'frontend_public_static',
);

const ar = {};
const en = {};
for (const item of inventory) {
  ar[item.arabic_text] ??= item.arabic_text;
  en[item.arabic_text] ??= item.english_translation;
}

for (const [locale, resource] of Object.entries({ ar, en })) {
  const target = path.join(frontendRoot, 'src', 'locales', locale, 'public.json');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(resource, null, 2)}\n`, 'utf8');
}

const entriesByFile = new Map();
for (const item of inventory) {
  const references = item.source.matchAll(/(frontend\/src\/[^:|]+):(\d+)/g);
  for (const match of references) {
    const relativeToRepo = match[1].replaceAll('/', path.sep);
    const absolute = path.join(repositoryRoot, relativeToRepo);
    const list = entriesByFile.get(absolute) ?? [];
    list.push({ line: Number(match[2]), text: item.arabic_text });
    entriesByFile.set(absolute, list);
  }
}

let replacements = 0;
let changedFiles = 0;
for (const [file, entries] of entriesByFile) {
  if (!fs.existsSync(file)) continue;
  const source = fs.readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const edits = [];

  const isInventoryEntry = (_node, text) =>
    entries.some((entry) => entry.text === text);

  const visit = (node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const text = node.text;
      if (isInventoryEntry(node, text)) {
        const parent = node.parent;
        const isPropertyName =
          (ts.isPropertyAssignment(parent) || ts.isMethodDeclaration(parent)) &&
          parent.name === node;
        const isModuleSpecifier =
          (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) &&
          parent.moduleSpecifier === node;
        const isTranslationKey =
          ts.isCallExpression(parent) &&
          ts.isIdentifier(parent.expression) &&
          parent.expression.text === 'tr';
        if (!isPropertyName && !isModuleSpecifier && !isTranslationKey) {
          const call = `tr(${JSON.stringify(text)})`;
          const replacement = ts.isJsxAttribute(parent) ? `{${call}}` : call;
          edits.push({ start: node.getStart(sourceFile), end: node.end, replacement });
        }
      }
    } else if (ts.isJsxText(node)) {
      const text = node.text.replace(/\s+/g, ' ').trim();
      if (text && isInventoryEntry(node, text)) {
        edits.push({
          start: node.getStart(sourceFile),
          end: node.end,
          replacement: `{tr(${JSON.stringify(text)})}`,
        });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  if (!edits.length) continue;
  edits.sort((a, b) => b.start - a.start);
  let output = source;
  for (const edit of edits) {
    output = output.slice(0, edit.start) + edit.replacement + output.slice(edit.end);
  }
  if (!source.includes('from "@/i18n"') && !source.includes("from '@/i18n'")) {
    output = `import { tr } from "@/i18n";\n${output}`;
  }
  fs.writeFileSync(file, output, 'utf8');
  replacements += edits.length;
  changedFiles += 1;
}

console.log(
  `Generated ${Object.keys(ar).length} public translations; replaced ${replacements} literals in ${changedFiles} files.`,
);

import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const src = path.resolve(import.meta.dirname, '..', 'src');
const roots = [path.join(src, 'components'), path.join(src, 'pages'), path.join(src, 'App.tsx')];
const files = [];
function collect(target) {
  if (!fs.existsSync(target)) return;
  if (fs.statSync(target).isFile()) {
    if (/\.tsx?$/.test(target)) files.push(target);
    return;
  }
  for (const name of fs.readdirSync(target)) collect(path.join(target, name));
}
roots.forEach(collect);

const nodesByFile = new Map();
const values = new Set();
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const nodes = [];
  const visit = (node) => {
    let text;
    let replacementKind;
    if (ts.isJsxText(node)) {
      text = node.text.replace(/\s+/g, ' ').trim();
      replacementKind = 'jsx';
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const isTranslationKey =
        ts.isCallExpression(node.parent) &&
        ts.isIdentifier(node.parent.expression) &&
        node.parent.expression.text === 'tr';
      const isPropertyName =
        ts.isPropertyAssignment(node.parent) && node.parent.name === node;
      const isModuleSpecifier =
        (ts.isImportDeclaration(node.parent) || ts.isExportDeclaration(node.parent)) &&
        node.parent.moduleSpecifier === node;
      if (!isTranslationKey && !isPropertyName && !isModuleSpecifier) {
        text = node.text.trim();
        replacementKind = ts.isJsxAttribute(node.parent) ? 'attribute' : 'expression';
      }
    }
    if (text && /[\u0600-\u06ff]/.test(text)) {
      values.add(text);
      nodes.push({
        start: node.getStart(sourceFile),
        end: node.end,
        text,
        replacementKind,
      });
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  if (nodes.length) nodesByFile.set(file, { source, nodes });
}

const supplementalPath = path.join(src, 'locales', 'en', 'supplemental.generated.json');
const existing = fs.existsSync(supplementalPath)
  ? JSON.parse(fs.readFileSync(supplementalPath, 'utf8'))
  : {};
const missing = [...values].filter((value) => !existing[value]);

function decodeEntities(value) {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&');
}

let cursor = 0;
async function worker() {
  while (cursor < missing.length) {
    const index = cursor++;
    const text = missing[index];
    const url = new URL('https://api.mymemory.translated.net/get');
    url.searchParams.set('q', text);
    url.searchParams.set('langpair', 'ar|en');
    url.searchParams.set('de', 'i18n@smartagency-ye.com');
    const response = await fetch(url, { headers: { 'User-Agent': 'Smart-Agency-i18n/1.0' } });
    const payload = await response.json();
    const candidates = [
      payload?.responseData?.translatedText,
      ...(payload?.matches ?? []).map((match) => match.translation),
    ];
    const translated = decodeEntities(
      candidates.find(
        (candidate) =>
          typeof candidate === 'string' &&
          candidate.trim() &&
          !/[\u0600-\u06ff]/.test(candidate) &&
          !candidate.includes('MYMEMORY WARNING'),
      )?.trim() ?? text,
    );
    if (translated === text) console.warn(`No English candidate for: ${text}`);
    existing[text] = translated;
    if ((index + 1) % 25 === 0) console.log(`Translated ${index + 1}/${missing.length}`);
  }
}

if (missing.length) {
  await Promise.all(Array.from({ length: 4 }, () => worker()));
}

const arSupplemental = Object.fromEntries([...values].map((value) => [value, value]));
fs.mkdirSync(path.dirname(supplementalPath), { recursive: true });
fs.mkdirSync(path.join(src, 'locales', 'ar'), { recursive: true });
fs.writeFileSync(supplementalPath, `${JSON.stringify(existing, null, 2)}\n`, 'utf8');
fs.writeFileSync(
  path.join(src, 'locales', 'ar', 'supplemental.generated.json'),
  `${JSON.stringify(arSupplemental, null, 2)}\n`,
  'utf8',
);

let replacements = 0;
for (const [file, { source, nodes }] of nodesByFile) {
  let output = source;
  for (const node of nodes.sort((a, b) => b.start - a.start)) {
    const call = `tr(${JSON.stringify(node.text)})`;
    const replacement = node.replacementKind === 'expression' ? call : `{${call}}`;
    output = output.slice(0, node.start) + replacement + output.slice(node.end);
    replacements += 1;
  }
  if (!source.includes('from "@/i18n"') && !source.includes("from '@/i18n'")) {
    output = `import { tr } from "@/i18n";\n${output}`;
  }
  fs.writeFileSync(file, output, 'utf8');
}

console.log(`Localized ${replacements} additional UI literals across ${nodesByFile.size} files.`);

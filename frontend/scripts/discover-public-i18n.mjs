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
  const visit = (node) => {
    let text;
    if (ts.isJsxText(node)) text = node.text.replace(/\s+/g, ' ').trim();
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const isTranslationKey =
        ts.isCallExpression(node.parent) &&
        ts.isIdentifier(node.parent.expression) &&
        node.parent.expression.text === 'tr';
      if (!isTranslationKey) text = node.text.trim();
    }
    if (text && /[\u0600-\u06ff]/.test(text)) values.add(text);
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
}

console.log([...values].sort((a, b) => a.localeCompare(b, 'ar')).join('\n'));

import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
let commit = process.env.SOURCE_COMMIT || process.env.VITE_GIT_SHA || null;
let dirty = null;
if (!commit) {
  try { commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { /* Docker builds may only receive the frontend directory. */ }
}
try { dirty = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().length > 0; } catch { /* No Git metadata in a Docker context. */ }
await writeFile(new URL('../public/build-info.json', import.meta.url), JSON.stringify({ commit, dirty, builtAt: new Date().toISOString() }) + '\n');

import assert from 'node:assert/strict';
import { writeFileSync, mkdirSync } from 'node:fs';
const origin=process.argv[2] ?? 'http://127.0.0.1:4174';
mkdirSync('performance-artifacts',{recursive:true});
const html=await (await fetch(`${origin}/ar`)).text();
const asset=html.match(/src="(\/assets\/[^\"]+\.js)"/)?.[1];
assert.ok(asset,'production script exists');
const checks=[['/ar',200],['/en',200],['/',200],['/index.html',200],[asset,200],['/fonts/IBMPlexSansArabic-Bold.v1.woff2',200],['/logo2.v1.webp',200],['/llms.txt',200],['/manifest.json',200],['/ai-catalog.json',404],['/missing.txt',404],['/assets/missing.js',404],['/fonts/missing.woff2',404]];
const results=[];
for(const [path,status] of checks){
  const response=await fetch(`${origin}${path}`,{method:'HEAD'});
  assert.equal(response.status,status,path);
  const cache=response.headers.get('cache-control');
  if(path===asset)assert.ok(cache?.includes('immutable'));
  if(path.startsWith('/fonts/')&&status===200)assert.ok(cache?.includes('2592000'));
  if(path==='/logo2.v1.webp')assert.ok(cache?.includes('2592000'));
  if(path==='/index.html')assert.equal(cache,'no-cache');
  if(path.endsWith('.woff2')&&status===200)assert.equal(response.headers.get('content-type'),'font/woff2');
  results.push({path,status,headers:Object.fromEntries(response.headers)});
}
writeFileSync('performance-artifacts/headers.json',JSON.stringify(results,null,2));
console.log(`${results.length} Nginx route, cache, MIME and missing-asset checks passed`);

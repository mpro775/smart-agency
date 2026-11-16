import { fileURLToPath } from "node:url";
process.chdir(fileURLToPath(new URL("../../", import.meta.url)));
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import { networkHar } from './har.mjs';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
const stage=process.argv[2] ?? 'baseline';
const origin=process.argv[3] ?? (stage==='baseline'?'http://127.0.0.1:4173':'http://127.0.0.1:4174');
const out=`performance-artifacts/${stage}`;
mkdirSync(out,{recursive:true});
const results=[];
for(const locale of (process.env.AUDIT_LOCALES ?? 'ar,en').split(',')) for(const device of (process.env.AUDIT_DEVICES ?? 'mobile,desktop').split(',')) for(let run=1;run<=Number(process.env.AUDIT_RUNS ?? 3);run++) {
  const name=`${locale}-${device}-${run}`;
  if(existsSync(`${out}/${name}.json`)) { console.log(`skip ${name}`); continue; }
  // Lighthouse owns the browser tab and clears storage before each navigation.
  const { launch }=await import('chrome-launcher');
  const chrome=await launch({chromePath:chromium.executablePath(),chromeFlags:['--headless','--no-sandbox','--disable-gpu']});
  try {
    const desktop=device==='desktop';
    const result=await lighthouse(`${origin}/${locale}`,{port:chrome.port,output:['json','html'],logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo'],formFactor:desktop?'desktop':'mobile',screenEmulation:desktop?{mobile:false,width:1350,height:940,deviceScaleFactor:1,disabled:false}:{mobile:true,width:412,height:823,deviceScaleFactor:1.75,disabled:false},throttling:desktop?{rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1}:{rttMs:150,throughputKbps:1638.4,cpuSlowdownMultiplier:4},disableStorageReset:false},{extends:'lighthouse:default',settings:{saveAssets:true}});
    writeFileSync(`${out}/${name}.json`,result.report[0]);
    writeFileSync(`${out}/${name}.html`,result.report[1]);
    writeFileSync(`${out}/${name}.trace.json`,JSON.stringify(result.artifacts.Trace));
    writeFileSync(`${out}/${name}.network.json`,JSON.stringify(result.artifacts.DevtoolsLog));
    writeFileSync(`${out}/${name}.har`,JSON.stringify(networkHar(result.artifacts.DevtoolsLog)));
    const lhr=result.lhr;
    const row={locale,device,run,scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,v.score])),lcp:lhr.audits['largest-contentful-paint'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue,tbt:lhr.audits['total-blocking-time'].numericValue,error:lhr.runtimeError};
    results.push(row);
    console.log(JSON.stringify(row));
  } finally { await chrome.kill(); }
}
writeFileSync(`${out}/runs.json`,JSON.stringify(results,null,2));

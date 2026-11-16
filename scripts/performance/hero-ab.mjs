import { fileURLToPath } from 'node:url';
process.chdir(fileURLToPath(new URL('../../', import.meta.url)));
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
const origin=process.argv[2] ?? 'http://127.0.0.1:4173';
mkdirSync('performance-artifacts/hero-ab',{recursive:true});
const results=[];
for(const visible of [false,true]) {
  const browser=await chromium.launch({executablePath:chromium.executablePath(),headless:true});
  try {
    const context=await browser.newContext({viewport:{width:412,height:823},isMobile:true,hasTouch:true,recordHar:{path:`performance-artifacts/hero-ab/${visible?'visible':'original'}.har`,content:'omit'}});
    const page=await context.newPage();
    await page.addInitScript(forceVisible=>{
      window.__vitals={lcp:0,cls:0};
      new PerformanceObserver(list=>{for(const e of list.getEntries())window.__vitals.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__vitals.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
      if(forceVisible){
        const reveal=()=>{if(!document.head)return false;const style=document.createElement('style');style.textContent='#hero h1,#hero p{opacity:1!important;transform:none!important}';document.head.append(style);return true;};
        if(!reveal()){const observer=new MutationObserver(()=>{if(reveal())observer.disconnect();});observer.observe(document,{childList:true,subtree:true});}
      }
    },visible);
    const cdp=await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:209715,uploadThroughput:93750});
    await cdp.send('Emulation.setFocusEmulationEnabled',{enabled:true});
    await page.bringToFront();
    await page.goto(`${origin}/ar`,{waitUntil:'networkidle',timeout:90000});
    await page.screenshot({path:`performance-artifacts/hero-ab/${visible?'visible':'original'}.png`});
    await page.waitForTimeout(3000);
    const vitals=await page.evaluate(()=>({...window.__vitals,visibility:document.visibilityState,headingOpacity:getComputedStyle(document.querySelector('h1')).opacity}));
    results.push({variant:visible?'force H1/paragraph visible':'unchanged animations',lcp:vitals.lcp || null,cls:vitals.cls,validLcp:vitals.lcp>0,visibility:vitals.visibility,headingOpacity:vitals.headingOpacity});
    await context.close();
    console.log(JSON.stringify(results.at(-1)));
  } finally {await browser.close();}
}
writeFileSync('performance-artifacts/hero-ab/results.json',JSON.stringify(results,null,2));

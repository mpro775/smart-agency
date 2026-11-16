import { fileURLToPath } from "node:url";
process.chdir(fileURLToPath(new URL("../../", import.meta.url)));
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('performance-artifacts/smoke',{recursive:true});
const origin=process.env.AUDIT_ORIGIN ?? 'http://127.0.0.1:4174';
const browser=await chromium.launch({executablePath:chromium.executablePath(),headless:true});
const summary=[];
try {
  for (const mobile of (process.env.SMOKE_ONLY === 'slow' ? [] : [false,true])) {
    const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1350,height:940},isMobile:mobile,hasTouch:mobile,recordHar:{path:`performance-artifacts/smoke/${mobile?'mobile':'desktop'}.har`,content:'omit'}});
    const page=await context.newPage();
    const errors=[],failed=[],badResponses=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('requestfailed',request=>{if(!request.failure()?.errorText.includes('ERR_ABORTED')) failed.push({url:request.url(),reason:request.failure()?.errorText});});
    page.on('response',response=>{if(response.status()>=400)badResponses.push({url:response.url(),status:response.status()});});
    for (const route of ['/','/ar','/en','/admin/login','/admin','/ar/projects','/en/blog','/ar/quote','/en/contact']) {
      errors.length=0; failed.length=0; badResponses.length=0;
      await page.goto(`${origin}${route}`,{waitUntil:'networkidle',timeout:60000});
      await page.waitForTimeout(500);
      assert.ok(await page.locator('body').innerText(),'page rendered');
      if(route==='/admin') assert.ok(page.url().endsWith('/admin/login'),'admin protected');
      if(route==='/ar'||route==='/en') {
        assert.equal(await page.locator('h1').count(),1);
        assert.equal(await page.locator('a button,button a').count(),0);
        const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));
        assert.equal(new Set(ids).size,ids.length,'unique ids');
        const scripts=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.initiatorType==='script').map(r=>r.name));
        assert.ok(!scripts.some(s=>/RichTextEditor|AdminRoutes|BlogForm/.test(s)),'no admin code on homepage');
        await page.screenshot({path:`performance-artifacts/smoke/${route.slice(1)}-${mobile?'mobile':'desktop'}.png`});
        const axe=await new AxeBuilder({page}).analyze();
        writeFileSync(`performance-artifacts/smoke/axe-${route.slice(1)}-${mobile?'mobile':'desktop'}.json`,JSON.stringify(axe.violations,null,2));
        if(mobile){
          assert.ok(!scripts.some(s=>/HeroDashboard/.test(s)),'mobile demo is deferred');
          const slot=page.locator('#hero .order-2');
          const before=await slot.evaluate(element=>element.getBoundingClientRect().height);
          await slot.scrollIntoViewIfNeeded();
          await page.locator('#hero .order-2 code').waitFor({state:'visible'});
          const after=await slot.evaluate(element=>element.getBoundingClientRect().height);
          assert.ok(Math.abs(before-after)<1,'dashboard placeholder preserves measured height');
        }
      }
      summary.push({route,mobile,url:page.url(),errors:[...errors],failed:[...failed],badResponses:[...badResponses]});
      console.log(JSON.stringify(summary.at(-1)));
      assert.deepEqual(errors, [], `${route}: browser errors`);
      assert.deepEqual(failed, [], `${route}: failed requests`);
      assert.deepEqual(badResponses, [], `${route}: HTTP failures`);
    }
    await context.close();
  }
  // Slow CMS response: Hero must paint immediately and all anchors remain.
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();
  let companyInfoRequests=0;
  page.on('request',request=>{if(request.url().includes('/company-info'))companyInfoRequests++;});
  await page.addInitScript(()=>{window.__shifts=[];new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__shifts.push({value:e.value,sources:e.sources.map(s=>s.node?.outerHTML?.slice(0,200))});}).observe({type:'layout-shift',buffered:true});});
  await page.route('**/api/public/homepage*',async route=>{await new Promise(r=>setTimeout(r,5000));await route.continue();});
  await page.goto(`${origin}/ar`,{waitUntil:'domcontentloaded'});
  await page.locator('h1').waitFor({state:'visible'});
  assert.equal(await page.locator('[data-home-section]').count(),9);
  await page.waitForTimeout(7000);
  const shifts=await page.evaluate(()=>window.__shifts);
  writeFileSync('performance-artifacts/smoke/slow-cms-shifts.json',JSON.stringify(shifts,null,2));
  for(const id of ['services','projects','technologies','team','testimonials','hosting','faqs','blogs']) {
    await page.locator(`[data-home-section="${id}"]`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    assert.equal(await page.locator(`#${id}`).count(),1,`${id} renders on scroll; url=${page.url()}; ids=${await page.locator('[data-home-section]').evaluateAll(nodes=>nodes.map(n=>n.id))}`);
  }
  // No public form writes leave the test browser.
  await page.locator('[data-home-section="footer"]').scrollIntoViewIfNeeded();
  await page.locator('input[name="newsletterEmail"]').waitFor();
  assert.equal(companyInfoRequests,0,'homepage Footer reuses companyInfo');
  await page.route('**/api/newsletter/**',route=>route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({statusCode:201,message:'Success',data:{}})}));
  await page.locator('input[name="newsletterEmail"]').fill('audit@example.com');
  await page.locator('button[type="submit"]').click();
  await page.getByText('تم الاشتراك بنجاح!',{exact:true}).waitFor();
  await context.close();
  writeFileSync('performance-artifacts/smoke/results.json',JSON.stringify(summary,null,2));
} finally {await browser.close();}

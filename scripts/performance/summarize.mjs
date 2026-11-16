import { fileURLToPath } from 'node:url';
process.chdir(fileURLToPath(new URL('../../', import.meta.url)));
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const stages=process.argv.slice(2);
if(!stages.length)stages.push('baseline','release');
const median=values=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
const output={date:'2026-11-17',baselineCommit:'9483fd4bef25c49204b1a4d5dbf71f9cf8d0b10c',measuredCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),environment:'Local Nginx 1.28.0, cold Chrome, live public CMS snapshots; not production PageSpeed',stages:{}};
for(const stage of stages){
  const folder=`performance-artifacts/${stage}`;
  const runs=readdirSync(folder).filter(name=>/^(ar|en)-(mobile|desktop)-[123]\.json$/.test(name)).map(file=>{
    const lhr=JSON.parse(readFileSync(`${folder}/${file}`));
    const [locale,device,run]=file.replace('.json','').split('-');
    const resources=lhr.audits['network-requests'].details.items;
    const scripts=resources.filter(item=>item.resourceType==='Script');
    return {file,locale,device,run:Number(run),fetchTime:lhr.fetchTime,browser:lhr.environment.hostUserAgent,scores:Object.fromEntries(Object.entries(lhr.categories).map(([key,value])=>[key,Math.round(value.score*100)])),lcpMs:lhr.audits['largest-contentful-paint'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue,tbtMs:lhr.audits['total-blocking-time'].numericValue,scriptTransferBytes:scripts.reduce((n,item)=>n+item.transferSize,0),scriptUrls:scripts.map(item=>item.url),runtimeError:lhr.runtimeError??null};
  });
  const medians=[];
  for(const locale of ['ar','en'])for(const device of ['mobile','desktop']){
    const group=runs.filter(row=>row.locale===locale&&row.device===device);
    if(group.length!==3)throw new Error(`Expected three ${stage}/${locale}/${device} runs; got ${group.length}`);
    medians.push({locale,device,performance:median(group.map(row=>row.scores.performance)),accessibility:median(group.map(row=>row.scores.accessibility)),bestPractices:median(group.map(row=>row.scores['best-practices'])),seo:median(group.map(row=>row.scores.seo)),lcpMs:median(group.map(row=>row.lcpMs)),cls:median(group.map(row=>row.cls)),tbtMs:median(group.map(row=>row.tbtMs)),scriptTransferBytes:median(group.map(row=>row.scriptTransferBytes))});
  }
  output.stages[stage]={medians,runs};
}
writeFileSync('PERFORMANCE_RESULTS.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(output.stages).map(([key,value])=>[key,value.medians])),null,2));

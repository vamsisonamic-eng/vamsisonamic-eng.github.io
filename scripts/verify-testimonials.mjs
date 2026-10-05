import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
for(const [name,width,height,reduced] of [['desktop',1440,1000,false],['mobile',390,844,false],['compact',360,640,false],['reduced',1440,1000,true]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference'});
 await page.addInitScript(()=>{Element.prototype.requestPointerLock=()=>{};Element.prototype.setPointerCapture=()=>{};});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await page.locator('#testimonials').scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
 if(await page.locator('.testimonial').count()!==5)throw Error('Featured testimonials missing');
 await page.screenshot({path:`artifacts/${name}-testimonials.png`});
 await page.getByRole('button',{name:'View all 12 testimonials'}).click();
 if(await page.locator('.testimonial').count()!==12)throw Error('Full testimonials missing');
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow');
 await page.locator('.testimonial').last().scrollIntoViewIfNeeded();await page.waitForTimeout(600);
 if(!await page.locator('.testimonial').last().evaluate(el=>getComputedStyle(el).opacity==='1'))throw Error('Quote invisible');
 await page.getByRole('button',{name:'Show selected testimonials'}).click();
 if(await page.locator('.testimonial').count()!==5)throw Error('Collapse failed');
 if(errors.length)throw Error(errors.join('\n'));await page.close();console.log(`${name}: 12 quotes, expansion/collapse and overflow passed`);
}
await browser.close();

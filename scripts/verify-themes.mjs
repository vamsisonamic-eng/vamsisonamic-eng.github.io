import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['compact',360,640]]){
 const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{Element.prototype.requestPointerLock=()=>{};Element.prototype.setPointerCapture=()=>{};});
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Switch to Day vision'}).click();
 if(await page.locator('html').getAttribute('data-theme')!=='day')throw Error('Day switch failed');
 await page.waitForTimeout(700);await page.screenshot({path:`artifacts/${name}-day-hero.png`});
 await page.reload({waitUntil:'networkidle'});
 if(await page.locator('html').getAttribute('data-theme')!=='day')throw Error('Theme not persisted');
 for(const id of ['engine','platforms','testimonials','contact']){await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(700);await page.screenshot({path:`artifacts/${name}-day-${id}.png`});}
 await page.getByRole('button',{name:'Explore Dentsu',exact:true}).click();await page.waitForTimeout(1000);await page.screenshot({path:`artifacts/${name}-day-dentsu.png`});await page.keyboard.press('Escape');await page.locator('dialog').waitFor({state:'detached'});
 await page.getByRole('button',{name:'MOTION ON',exact:true}).click();
 if(await page.locator('html').getAttribute('data-motion')!=='off')throw Error('Motion failed in day');
 await page.getByRole('button',{name:'Switch to Night vision'}).click();
 if(await page.locator('html').getAttribute('data-theme')!=='night')throw Error('Night switch failed');
 if(await page.locator('html').getAttribute('data-motion')!=='off')throw Error('Theme changed motion');
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow');
 if(errors.length)throw Error(errors.join('\n'));console.log(name+': themes, persistence, independent motion, dialogs passed');await page.close();
}
await browser.close();

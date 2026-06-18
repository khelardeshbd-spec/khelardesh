import puppeteer from 'puppeteer';

async function test() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/scores/760430', { waitUntil: 'networkidle0' });
  
  const content = await page.content();
  console.log('Renders Lineup Not Available:', content.includes('Lineup not available'));
  console.log('Renders Tactical Pitch:', content.includes('Starting XI &amp; Substitutes') || content.includes('Starting XI & Substitutes'));
  
  await browser.close();
}

test();

import puppeteer from 'puppeteer';

async function test() {
  // Let's use the absolute path to Chrome
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/scores/760430', { waitUntil: 'networkidle0' });
  
  const content = await page.content();
  console.log('Renders Lineup Not Available:', content.includes('Lineup not available'));
  console.log('Renders Tactical Pitch:', content.includes('Starting XI &amp; Substitutes') || content.includes('Starting XI & Substitutes'));
  
  if (content.includes('Lineup not available')) {
    console.log('It rendered "Lineup not available" block');
  } else if (content.includes('Starting XI & Substitutes')) {
    console.log('It rendered the Lineup block');
  } else if (content.includes('পরিসংখ্যান')) {
    console.log('It switched tabs to Stats!');
  } else {
    console.log('Could not find expected text block.');
  }

  await browser.close();
}

test();

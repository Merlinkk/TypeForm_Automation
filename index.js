const puppeteer = require('puppeteer');
const config = require('./config.json');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fillInput(page, selector, value) {
  await page.waitForSelector(selector);
  await page.type(selector, value);
  await page.keyboard.press('Enter');
}

async function selectDropdownOption(page, selector, value) {
  await page.waitForSelector(selector);
  await page.click(selector);
  await page.type(selector, value);
  await page.waitForSelector(`div[data-qa="dropdown-option"][data-value="${value}"]`);
  await page.click(`div[data-qa="dropdown-option"][data-value="${value}"]`);
  await page.keyboard.press('Enter');
}

async function handleAcceptancePage(page) {
  try {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, label, div'));
      const acceptButton = buttons.find(button => button.textContent.toLowerCase().includes('i accept'));
      if (acceptButton) {
        acceptButton.click();
      }
    });
    await delay(500);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await delay(500);
    await page.keyboard.press('Enter');
  } catch (error) {
    console.log('Using fallback method for acceptance page');
    await delay(500);
    await page.keyboard.press('Enter');
    await delay(500);
    await page.keyboard.press('Enter');
  }
}

async function automateForm() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
    slowMo: 50
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://qmu8hxor50w.typeform.com/to/YMONJ8dd', { waitUntil: 'networkidle0' });

    await page.waitForSelector('button[data-qa="start-button"]');
    await page.click('button[data-qa="start-button"]');

    await fillInput(page, 'input[type="email"]', config.email);

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = "2024";
    
    await fillInput(page, 'input[placeholder="DD"]', day);
    await fillInput(page, 'input[placeholder="MM"]', month);
    await fillInput(page, 'input[placeholder="YYYY"]', year);

    await delay(1000);
    await handleAcceptancePage(page);

    await delay(1000);
    await selectDropdownOption(page, 'input[data-qa="dropdown-input"]', config.company);
    await selectDropdownOption(page, 'input[data-qa="dropdown-input"]', config.workType);

    await fillInput(page, 'textarea', config.tasks);
    await fillInput(page, 'label[data-qa="rating-5"]', '');
    await fillInput(page, 'label[data-qa="rating-4"]', '');
    await fillInput(page, 'textarea', config.wins);

    await selectDropdownOption(page, 'input[data-qa="dropdown-input"]', config.contactType);

    console.log('Form submitted successfully!');
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await browser.close();
  }
}

automateForm();
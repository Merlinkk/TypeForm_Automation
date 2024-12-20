
const puppeteer = require('puppeteer');
const config = require('./config.json');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const automateForm = async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
    slowMo: 50
  });
  
  try {
    const page = await browser.newPage();
    
    await page.goto('https://qmu8hxor50w.typeform.com/to/YMONJ8dd', {
      waitUntil: 'networkidle0'
    });
    
    await page.waitForSelector('button[data-qa="start-button"]');
    await page.click('button[data-qa="start-button"]');
    
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', config.email);
    await page.keyboard.press('Enter');
    
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = "2024";
    
    await page.waitForSelector('input[placeholder="DD"]');
    await page.type('input[placeholder="DD"]', day);
    await page.type('input[placeholder="MM"]', month);
    await page.type('input[placeholder="YYYY"]', year);
    await page.keyboard.press('Enter');
    
    await delay(1000); 
    
    try {
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, label, div'));
        const acceptButton = buttons.find(button => 
          button.textContent.toLowerCase().includes('i accept')
        );
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
    
    await delay(1000);
    
    await page.waitForSelector('input[data-qa="dropdown-input"]', { timeout: 5000 });
    await page.click('input[data-qa="dropdown-input"]');
    await page.type('input[data-qa="dropdown-input"]', config.company);
    await page.waitForSelector(`div[data-qa="dropdown-option"][data-value="${config.company}"]`);
    await page.click(`div[data-qa="dropdown-option"][data-value="${config.company}"]`);
    await page.keyboard.press('Enter');
    
    await page.waitForSelector('input[data-qa="dropdown-input"]');
    await page.click('input[data-qa="dropdown-input"]');
    await page.type('input[data-qa="dropdown-input"]', config.workType);
    await page.waitForSelector(`div[data-qa="dropdown-option"][data-value="${config.workType}"]`);
    await page.click(`div[data-qa="dropdown-option"][data-value="${config.workType}"]`);
    await page.keyboard.press('Enter');
    
    await page.waitForSelector('textarea');
    await page.type('textarea', config.tasks);
    await page.keyboard.press('Enter');
    
    await page.waitForSelector('label[data-qa="rating-5"]');
    await page.click('label[data-qa="rating-5"]');
    await page.keyboard.press('Enter');
    
    await page.waitForSelector('label[data-qa="rating-4"]');
    await page.click('label[data-qa="rating-4"]');
    await page.keyboard.press('Enter');
    
    await page.waitForSelector('textarea');
    await page.type('textarea', config.wins);
    await page.keyboard.press('Enter');
    
    await page.waitForSelector('input[data-qa="dropdown-input"]');
    await page.click('input[data-qa="dropdown-input"]');
    await page.type('input[data-qa="dropdown-input"]', config.contactType);
    await page.waitForSelector(`div[data-qa="dropdown-option"][data-value="${config.contactType}"]`);
    await page.click(`div[data-qa="dropdown-option"][data-value="${config.contactType}"]`);
    await page.keyboard.press('Enter');
    
    console.log('Form submitted successfully!');
  } catch (error) {
    console.error('Error occurred:', error);
    console.error('Error details:', error.message);
  } finally {
    await browser.close();
  }
};

automateForm();
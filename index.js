const puppeteer = require('puppeteer');
const config = require('./config.json');

// Utility functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TypeformAutomation {
  constructor(config) {
    this.config = config;
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized'],
      slowMo: 100,
      executablePath: '/usr/bin/google-chrome-stable'
    });
    this.page = await this.browser.newPage();
  }

  async fillInput(selector, value) {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      await this.page.type(selector, value);
      await this.page.keyboard.press('Enter');
    } catch (error) {
      throw new Error(`Failed to fill input ${selector}: ${error.message}`);
    }
  }

  async selectDropdownOption(selector, value) {
    try {
      await this.page.waitForSelector(selector);
      // await this.page.click(selector);
      await this.page.type(selector, value);
      
      await delay(500);
      await this.page.keyboard.press('ArrowDown');
      await delay(100);
      await this.page.keyboard.press('Enter');
      await delay(1000);
    } catch (error) {
      throw new Error(`Failed to select dropdown option ${value}: ${error.message}`);
    }
  }

  async handleAcceptancePage(key) {
    try {
      await this.page.keyboard.press(key);
    } catch (error) {
      console.log('Using fallback method for acceptance page');
      await delay(500);
      await this.page.keyboard.press('Enter');
      await delay(500);
      await this.page.keyboard.press('Enter');
    }
  }

  getTodayDate() {
    const today = new Date();
    return {
      day: String(today.getDate()).padStart(2, '0'),
      month: String(today.getMonth() + 1).padStart(2, '0'),
      year: "2024"
    };
  }

  async automateForm() {
    try {
      await this.initialize();
      
      // Navigate to form
      await this.page.goto('https://qmu8hxor50w.typeform.com/to/YMONJ8dd', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      // Start form
      await this.page.waitForSelector('button[data-qa="start-button"]');
      await this.page.click('button[data-qa="start-button"]');

      // Fill email
      await this.fillInput('input[type="email"]', this.config.email);

      // Fill date
      const { day, month, year } = this.getTodayDate();
      await this.fillInput('input[placeholder="DD"]', day);
      await this.fillInput('input[placeholder="MM"]', month);
      await this.fillInput('input[placeholder="YYYY"]', year);

      // Handle acceptance page
      await delay(1000);
      await this.handleAcceptancePage('a');

      // Select company
      await delay(1000);
      await this.selectDropdownOption(
        'input[placeholder="Type or select an option"]', 
        this.config.company
      );
      await delay(1000);

      await this.selectDropdownOption(
        'input[id="dropdown-2aac409a-70d3-435d-bd19-80d437a90c37-8YtvfYLHPHZey5Pl"]', 
        this.config.workType
      );
      await delay(1000);

      await this.selectDropdownOption(
        'input[placeholder="Type your answer here..."]', 
        this.config.tasks
      );
      await delay(1000);

      await this.page.waitForSelector('div[class="RatingItems-sc-__sc-qvp7k7-2 kHHjAL"]')
      await this.page.keyboard.press(JSON.stringify(this.config.rating1));
      await delay(1000);

      await this.page.waitForSelector('div[class="RatingItems-sc-__sc-qvp7k7-2 kHHjAL"]')
      await this.page.keyboard.press(JSON.stringify(this.config.rating2));
      await delay(1000);

      await this.selectDropdownOption(
        'input[placeholder="Type your answer here..."]', 
        this.config.wins
      );
      await delay(1000);

      await this.selectDropdownOption(
        'input[placeholder="Type or select an option"]', 
        this.config.contactType
      );


      console.log('Form submitted successfully!');
    } catch (error) {
      console.error('Automation failed:', error.message);
      throw error;
    } finally {
      if (this.browser) {
        // Uncomment to close browser after completion
        // await this.browser.close();
      }
    }
  }
}

// Run automation
const automation = new TypeformAutomation(config);
automation.automateForm().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
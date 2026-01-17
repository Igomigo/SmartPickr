import { Browser, chromium, BrowserContext, Page } from "playwright";
import { logger } from "./logger";

class BrowserManager {
  private browser: Browser | null;
  private context: BrowserContext | null;

  constructor() {
    this.browser = null;
    this.context = null;
  }

  /**
   * This function launches a browser instance.
   */
  public async launchBrowser(): Promise<Browser> {
    try {
      const browserOptions = {
        headless: false,
        slowMo: 1000,
        args: [
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--disable-web-security",
          "--disable-features=site-per-process",
        ],
      };
      this.browser = await chromium.launch(browserOptions);
      logger.log(`Browser launched successfully`);
      return this.browser;
    } catch (error) {
      logger.error(`Error launching browser: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * This function creates a browser context instance (like an incognito window).
   */
  public async createBrowserContext(): Promise<BrowserContext> {
    try {
      if (!this.browser) {
        throw new Error(
          "Browser not launched, you must launch the browser first using launchBrowser()"
        );
      }

      this.context = await this.browser.newContext();
      return this.context;
    } catch (error) {
      logger.error(
        `Error creating browser context: ${(error as Error).message}`
      );
      throw error;
    }
  }

  /**
   * This function creates a page instance.
   * The page instance is used to navigate to the web page.
   */
  public async createPage(): Promise<Page> {
    try {
      if (!this.context) {
        throw new Error(
          "Browser context not created, you must create a browser context first using createBrowserContext()"
        );
      }

      const page = await this.context.newPage();
      logger.log(`Page created successfully`);
      return page;
    } catch (error) {
      logger.error(`Error creating page: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * This function closes the browser and browser context instances.
   */
  public async closeBrowser(): Promise<void> {
    try {
      if (this.context) {
        await this.context.close();
        this.context = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      logger.log(`Browser closed successfully`);
    } catch (error) {
      logger.error(`Error closing browser: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * This function initializes the browser and browser context instances.
   */
  public async initializeBrowser(): Promise<{ browserInstance: Browser; page: Page }> {
    try {
      const browserInstance = await this.launchBrowser();
      await this.createBrowserContext();
      const page = await this.createPage();
      return { browserInstance, page };
    } catch (error) {
      logger.error(`Error initializing browser: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default new BrowserManager();

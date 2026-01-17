import { Browser, chromium, BrowserContext, Page } from "playwright";
import { logger } from "./logger";

let browser: Browser | null = null;
let context: BrowserContext | null = null;

/**
 *
 * @returns {Promise<Browser>} The browser instance
 * @description
 * This function launches a browser instance.
 * The browser instance is used to scrape the web.
 */
export const launchBrowser = async (): Promise<Browser> => {
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
  browser = await chromium.launch(browserOptions);
  return browser;
};

/**
 *
 * @returns {Promise<BrowserContext>} The browser context instance
 * @description
 * This function creates a browser context instance (like an incognito window).
 * The browser context instance is used to scrape the web.
 */
export const createBrowserContext = async (): Promise<BrowserContext> => {
  try {
    if (!browser) {
      throw new Error(
        "Browser not launched, you must launch the browser first using chromium.launch()"
      );
    }

    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    });

    return context;
  } catch (error) {
    logger.error(`Error creating browser context: ${(error as Error).message}`);
    throw error;
  }
};

/**
 *
 * @returns {Promise<Page>} The page instance
 * @description
 * This function creates a page instance.
 * The page instance is used to scrape the web.
 */
export const createPage = async (): Promise<Page> => {
  try {
    if (!context) {
      throw new Error(
        "Browser context not created, you must create a browser context first using createBrowserContext()"
      );
    }

    const page = await context.newPage();
    return page;
  } catch (error) {
    logger.error(`Error creating page: ${(error as Error).message}`);
    throw error;
  }
};

/**
 *
 * @returns {Promise<void>}
 * @description
 * This function closes the browser and browser context instances.
 */
export const closeBrowser = async (): Promise<void> => {
  try {
    if (!context) {
      throw new Error(
        "Browser context not created, you must create a browser context first using createBrowserContext()"
      );
    }

    await context.close();
    context = null;
    await browser?.close();
    browser = null;
  } catch (error) {
    logger.error(`Error closing browser: ${(error as Error).message}`);
    throw error;
  }
};

/**
 *
 * @returns {Promise<{ browserInstance: Browser; page: Page }>} The browser and page instances
 * @description
 * This function initializes the browser and page instances.
 * The browser instance is used to scrape the web.
 * The page instance is used to navigate to the web page.
 */
export const initializeBrowser = async (): Promise<{
  browserInstance: Browser;
  page: Page;
}> => {
  try {
    const browserInstance = await launchBrowser();
    await createBrowserContext();
    const page = await createPage();
    
    return { browserInstance, page };
  } catch (error) {
    logger.error(`Error initializing browser: ${(error as Error).message}`);
    throw error;
  }
};

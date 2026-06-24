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
   * If one is already running, it is reused (so a single search shares one
   * browser instead of launching a fresh Chromium per product).
   */
  public async launchBrowser(): Promise<Browser> {
    try {
      if (this.browser) return this.browser;
      const browserOptions = {
        headless: true,
        slowMo: 1000,
        // Use real Chrome, not bundled Chromium — a genuine Chrome binary has a
        // far more legitimate fingerprint (Cloudflare flags Chromium more).
        channel: "chrome",
        args: [
          "--disable-gpu",
          // Required in containers (tiny /dev/shm) — not a bot signal.
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
          "--no-sandbox",
          // Dropped --disable-web-security and --disable-features=site-per-process:
          // both are non-standard flags that make the browser look MORE bot-like
          // to Cloudflare. Removing them improves the fingerprint.
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

      if (this.context) return this.context;

      // Route through a residential proxy when configured (PROXY_URL set).
      // Needed in the cloud because Jiji's Cloudflare blocks datacenter IPs;
      // a residential IP looks like a real user. Unset locally = direct (no-op).
      const proxy = process.env.PROXY_URL
        ? {
            server: process.env.PROXY_URL,
            ...(process.env.PROXY_USERNAME && {
              username: process.env.PROXY_USERNAME,
            }),
            ...(process.env.PROXY_PASSWORD && {
              password: process.env.PROXY_PASSWORD,
            }),
          }
        : undefined;
      if (proxy) logger.log(`Using proxy: ${proxy.server}`);

      // Give the context a real browser identity so headless isn't flagged as
      // a bot (the default headless UA is "HeadlessChrome", which trips lazy-
      // loaders and soft bot-checks → missing images/reviews).
      this.context = await this.browser.newContext({
        ...(proxy && { proxy }),
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        viewport: { width: 1366, height: 900 },
      });
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
   * Opens a single page, launching the browser + context first if needed.
   * The browser is reused across calls; only the page is per-operation.
   */
  public async newPage(): Promise<Page> {
    await this.launchBrowser();
    await this.createBrowserContext();
    return this.createPage();
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
}

export default new BrowserManager();

import { Page } from "playwright";
import { logger } from "../../utils/logger";

/**
 * Jiji sits behind Cloudflare. On a fresh/low-trust session it serves the
 * "Just a moment..." interstitial (Turnstile). This tries to clear it the way
 * a human would: detect the challenge, click the checkbox, and wait for the
 * real page to appear (signalled by `readySelector` showing up).
 *
 * It is best-effort: if Cloudflare rejects the click, we simply return and the
 * caller scrapes whatever loaded (likely empty). Once cleared, the sticky-
 * session IP keeps its `cf_clearance` cookie, so later pages pass automatically.
 *
 * @returns true if the real page is ready, false if still challenged.
 */
export async function passCloudflareChallenge(
  page: Page,
  readySelector: string,
  timeoutMs = 30000,
): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;

  // If the real content is already there, nothing to do.
  if (await page.locator(readySelector).count()) return true;

  while (Date.now() < deadline) {
    const title = await page.title().catch(() => "");
    const challenged =
      /just a moment/i.test(title) ||
      (await page.getByText(/verify you are (not a|human)/i).count().catch(() => 0)) > 0 ||
      (await page.locator('iframe[src*="challenges.cloudflare.com"]').count().catch(() => 0)) > 0;

    if (!challenged) {
      // Challenge gone — wait for the real content to render.
      const ok = await page
        .locator(readySelector)
        .first()
        .waitFor({ timeout: 5000 })
        .then(() => true)
        .catch(() => false);
      if (ok) {
        logger.log("[cloudflare] challenge cleared, page ready");
        return true;
      }
    } else {
      logger.log("[cloudflare] challenge detected, attempting checkbox click...");
      // The Turnstile checkbox lives in a cross-origin iframe. Try to click it.
      const frame = page.frameLocator('iframe[src*="challenges.cloudflare.com"]');
      await frame
        .locator('input[type="checkbox"], body')
        .first()
        .click({ timeout: 5000 })
        .catch(() => {
          // Fallback: click the iframe area itself (some Turnstile variants).
          return page
            .locator('iframe[src*="challenges.cloudflare.com"]')
            .click({ timeout: 5000 })
            .catch(() => {});
        });
    }

    // Cloudflare verifies asynchronously; give it a moment, then re-check.
    await page.waitForTimeout(2000);
  }

  logger.log("[cloudflare] still challenged after timeout");
  return false;
}

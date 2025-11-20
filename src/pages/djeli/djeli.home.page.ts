// src/pages/djeli.home.page.ts
import { Page, Locator } from '@playwright/test';
import { SignInModal } from '../sign-in.modal';

export class HomePage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
  }

  async goto() {
    const username = process.env.USERNAME ?? 'smg';
    const password = process.env.PASSWORD ?? 'welcome';
    // HTTP credentials
    await this.page.context().setHTTPCredentials({ username, password });
    await this.page.goto('https://dev.djeli.com/#/home');
  }

  async fillCredentials(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    const signInLocator = await this.findSignInLocator();
    await signInLocator.click();
  }

  private async findSignInLocator(timeout = 2000): Promise<Locator> {
    const candidates: Locator[] = [
      this.page.getByRole('button', { name: /sign in/i }),
      this.page.getByRole('link', { name: /sign in/i }),
      this.page.getByText(/sign in/i),
      this.page.locator("button:has-text('Sign In')"),
      this.page.locator("button:has-text('SIGN IN')"),
      this.page.locator("//span[normalize-space(text())='Sign In']"),
      this.page.locator("text=Sign In")
    ];

    for (const loc of candidates) {
      try {
        if (await loc.count() > 0 && await loc.isVisible()) {
          return loc.first();
        }
      } catch {
        // ignore and try next
      }
    }

    const start = Date.now();
    while (Date.now() - start < timeout) {
      for (const loc of candidates) {
        try {
          if (await loc.count() > 0 && await loc.isVisible()) {
            return loc.first();
          }
        } catch {
          // ignore
        }
      }
      await this.page.waitForTimeout(100);
    }

    for (const loc of candidates) {
      if (await loc.count() > 0) return loc.first();
    }

    throw new Error('Sign In control not found using multiple locator strategies.');
  }

  async openSignIn(): Promise<SignInModal> {
    const signInLocator = await this.findSignInLocator(5000);

    try {
      await signInLocator.click({ timeout: 5000 });
    } catch {
      await signInLocator.click({ force: true });
    }

    const iframeSelector = 'iframe#one-id-frame';
    const iframeEl = await this.page.waitForSelector(iframeSelector, { state: 'attached', timeout: 15000 });
    if (!iframeEl) {
      throw new Error(`Iframe (${iframeSelector}) not found after clicking Sign In`);
    }

    const frame = await iframeEl.contentFrame();
    if (!frame) throw new Error(`Could not obtain Frame from iframe (${iframeSelector})`);

    const modal = new SignInModal(frame);
    await modal.waitForOpen();
    return modal;
  }
}

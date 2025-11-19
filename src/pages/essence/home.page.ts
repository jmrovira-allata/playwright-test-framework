import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  private readonly page: Page;

  private readonly signInBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInBtn = page.locator("//span[text() = 'Sign In']");
  }

  async goto() {
    await this.page.goto('https://www.essence.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000
    });
  }

    async clickSignIn() {
    await expect(this.signInBtn).toBeVisible({ timeout: 30_000 });
    await this.signInBtn.click();
  }
}
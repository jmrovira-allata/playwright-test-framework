// src/pages/sign-in.modal.ts
import type { Page, Frame, Locator } from '@playwright/test';

type Root = Page | Frame;

export class SignInModal {
  private readonly root: Root;
  private readonly emailInput: Locator;
  private readonly confirmEmailInput: Locator;
  private readonly signInButton: Locator;

  constructor(root: Root) {
    this.root = root;
    this.emailInput = root.locator('#input-email');
    this.confirmEmailInput = root.locator('input[placeholder*="confirm"]');
    this.signInButton = root.locator('button:has-text("Sign In")');
  }

  async waitForOpen() {
    await this.emailInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  async signInWith(email: string) {
    await this.emailInput.fill(email);
    await this.confirmEmailInput.fill(email);

    const buttonHandle = await this.signInButton.elementHandle();

    if (buttonHandle) {
      await this.root.waitForFunction(
        (button) => !button.hasAttribute('disabled'),
        buttonHandle
      );

      await this.signInButton.click();
    } else {
      throw new Error('Sign In button not found');
    }
  }

  async enterVerificationCode(page: Page, code: string) {
    if (!code) {
      throw new Error('Verification code is undefined');
    }

    console.log('Entering verification code:', code);

    const digits = code.split('');
    const otpInputs = this.root.locator('input[type="text"], input[type="tel"]');

    const count = await otpInputs.count();

    if (count >= 6) {
      await page.waitForTimeout(1000);

      for (let i = 0; i < digits.length; i++) {
        await otpInputs.nth(i).focus();
        await page.keyboard.type(digits[i]);
        await page.waitForTimeout(500);
      }

      await otpInputs.nth(5).evaluate((input: HTMLInputElement) => input.blur());
      await page.waitForTimeout(500);
      
    } else if (count === 1) {
      await otpInputs.first().focus();
      for (const digit of digits) {
        await page.keyboard.type(digit);
        await page.waitForTimeout(100);
      }
    } else {
      throw new Error('Could not find OTP inputs to enter verification code.');
    }
  }

  async clickVerify() {
    const verifyButton = this.root.locator('button:has-text("VERIFY CODE"), button:has-text("Verify")');
    const buttonHandle = await verifyButton.elementHandle();

    if (buttonHandle) {
      console.log('Attempting to click verify button...');
      try {
        await verifyButton.click({ force: true });
        console.log('Verify button clicked.');
      } catch (error) {
        console.error('Error clicking verify button:', error);
      }
    } else {
      throw new Error('Verify button not found');
    }
  }
}

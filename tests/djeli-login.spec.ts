import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/djeli/djeli.home.page';
import { SignInModal } from '../src/pages/sign-in.modal';
import { waitForVerificationCodeFromMailosaur } from '../src/pages/helpers/mailsaur';

test('full sign-in flow with Mailosaur 6-digit code (modal)', async ({ page }) => {
  const serverId = process.env.MAILOSAUR_SERVER_ID ?? '';
  const apiKey = process.env.MAILOSAUR_API_KEY ?? '';

  const testEmail = `anything@${serverId}.mailosaur.net`;
  const testStartTime = new Date();

  const home = new HomePage(page);
  await home.goto();

  const modal = await home.openSignIn();
  await modal.signInWith(testEmail);

  const code = await waitForVerificationCodeFromMailosaur({
    serverId,
    apiKey,
    toAddress: testEmail,
    testStartTime,
    timeoutMs: 120000,
    codeRegex: /<p[^>]*>\s*(\d{6})\s*<\/p>/,  // Use <p> regex here
  });

  console.log('Retrieved code:', code);

  await modal.enterVerificationCode(page, code);
  await modal.clickVerify();

  await expect(page.locator("//span[text()='TT']")).toBeVisible({ timeout: 30000 });
});

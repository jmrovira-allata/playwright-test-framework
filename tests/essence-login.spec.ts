import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/essence/home.page';
import { SignInModal } from '../src/pages/sign-in.modal';
import { waitForVerificationCodeFromMailosaur } from '../src/pages/helpers/mailsaur';

test('open essence.com and click Sign In', async ({ page }) => {
  const serverId = process.env.MAILOSAUR_SERVER_ID ?? '';
  const apiKey = process.env.MAILOSAUR_API_KEY ?? '';

  const testEmail = `anything@${serverId}.mailosaur.net`;
  const testStartTime = new Date();

  const home = new HomePage(page);
  await home.goto();
  await home.clickSignIn();
  
  const signIn = new SignInModal(page);
  await signIn.waitForOpen();
  await signIn.signInWith(testEmail);

  const code = await waitForVerificationCodeFromMailosaur({
    serverId,
    apiKey,
    toAddress: testEmail,
    testStartTime,
    timeoutMs: 120000,
    codeRegex: /<div[^>]*>\s*(\d{6})\s*<\/div>/,  // Use <div> regex here
  });

  console.log('Retrieved code:', code);

  await signIn.enterVerificationCode(page, code);
  await signIn.clickVerify();

  await expect(page.locator("//span[text()='TT']")).toBeVisible({ timeout: 30000 });
});

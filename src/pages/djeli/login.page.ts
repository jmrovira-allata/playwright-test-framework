// import { Page, Locator } from '@playwright/test';
// import { waitForVerificationCodeFromMailosaur } from '../helpers/mailsaur';

// export class LoginPage {
//   readonly page: Page;
//   readonly openLoginButton: Locator;
//   readonly emailInput: Locator;
//   readonly confirmEmailInput: Locator;
//   readonly signInButton: Locator;
//   readonly verificationInputs: Locator;
//   readonly verificationSubmitButton: Locator;
//  // readonly loggedInIndicator: Locator;

//   constructor(page: Page) {
//     this.page = page;

//     // Adjust these selectors to match your app:
//     this.openLoginButton = page.locator('button:has-text("Log in"), button:has-text("Login")'); // main login btn
//     this.emailInput = page.locator('input[name="email"], input[type="email"]').first();
//     this.confirmEmailInput = page.locator('input[name="confirmEmail"], input[autocomplete="email"]').nth(1);
//     this.signInButton = page.locator('button:has-text("Sign In"), button:has-text("SIGN IN")');

//     // For the verification code inputs: try to match the 6 single-character inputs
//     // If your page uses one input field instead, the fallback handles that.
//     this.verificationInputs = page.locator('input[type="tel"], input[type="text"].verification, input.verification-input');
//     this.verificationSubmitButton = page.locator('button:has-text("Verify"), button:has-text("VERIFY CODE")');
    
//     // Element that shows after successful login (adjust)
//   //  this.loggedInIndicator = page.locator('text=Your account, text=Welcome, header >> text=Account'); 
//   }

//   async goto(url = '/') {
//     await this.page.goto(url);
//   }

//   async openLogin() {
//     await this.openLoginButton.click();
//   }

//   async fillEmails(email: string) {
//     await this.emailInput.fill(email);
//     await this.confirmEmailInput.fill(email);
//   }

//   async clickSignIn() {
//     await this.signInButton.click();
//   }

//   /**
//    * Enter code into verification inputs.
//    * Handles both:
//    *  - 6 separate inputs (it will fill them one char per input)
//    *  - a single input (it will fill the whole code)
//    */
//   async enterVerificationCode(code: string) {
//     // Wait for inputs to appear
//     await this.page.waitForTimeout(300); // small delay if UI animates; prefer explicit wait if possible
//     const count = await this.verificationInputs.count();

//     if (count >= 6) {
//       // Fill one char per input
//       const digits = code.split('');
//       for (let i = 0; i < 6; i++) {
//         const input = this.verificationInputs.nth(i);
//         await input.fill(digits[i]);
//       }
//     } else if (count === 1) {
//       // Single input — fill whole code
//       await this.verificationInputs.first().fill(code);
//     } else {
//       // Try a common selector for six separate inputs if previous didn't match
//       const alt = this.page.locator('[data-testid="otp-input"] input, .otp input');
//       if (await alt.count() >= 6) {
//         const digits = code.split('');
//         for (let i = 0; i < 6; i++) {
//           await alt.nth(i).fill(digits[i]);
//         }
//       } else {
//         // Last resort: type into page (focus)
//         await this.page.keyboard.type(code);
//       }
//     }
//   }

//   async submitVerification() {
//     await this.verificationSubmitButton.click();
//   }

//   // Full flow helper: open, enter email, sign in, fetch code from Mailosaur and submit
//   async signInWithEmailAndCode(email: string, opts?: { serverId?: string; apiKey?: string; timeoutMs?: number }) {
//     const { serverId = process.env.MAILOSAUR_SERVER_ID, apiKey = process.env.MAILOSAUR_API_KEY, timeoutMs } = opts ?? {};
//     if (!serverId || !apiKey) throw new Error('MAILOSAUR_SERVER_ID and MAILOSAUR_API_KEY must be set');

//     await this.openLogin();
//     await this.fillEmails(email);
//     await this.clickSignIn();

//     // wait for the verification UI to appear
//     await this.verificationInputs.first().waitFor({ state: 'visible', timeout: 30_000 }).catch(() => { /* ignore */ });

//     // fetch code from Mailosaur
//     const code = await waitForVerificationCodeFromMailosaur({
//       serverId,
//       apiKey,
//       toAddress: email,
//       timeoutMs
//     });

//     // enter and submit
//     await this.enterVerificationCode(code);
//     await this.submitVerification();

//     // optional: wait for logged-in state
//   }
// }

import MailosaurClient from 'mailosaur';

export async function waitForVerificationCodeFromMailosaur(params: {
  serverId: string;
  apiKey: string;
  toAddress: string;
  testStartTime: Date;
  timeoutMs?: number;
  codeRegex: RegExp;
}) {
  const {
    serverId,
    apiKey,
    toAddress,
    testStartTime,
    timeoutMs = 120_000,
    codeRegex,
  } = params;

  const client = new MailosaurClient(apiKey);
  
  let message;
  const timeout = Date.now() + timeoutMs;

  while (Date.now() < timeout) {
    const messages = await client.messages.list(serverId);

    if (messages.items) {
      message = messages.items.find((msg: any) =>
        msg.to?.some((recipient: any) => recipient.email === toAddress) &&
        new Date(msg.received) > testStartTime
      );

      if (message) {
        message = await client.messages.get(serverId, { sentTo: toAddress });
        break;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  if (!message) {
    throw new Error('No new verification email received');
  }

  const textBody = message.text?.body ?? '';
  const htmlBody = message.html?.body ?? '';
  const content = `${textBody}\n${htmlBody}`;
  console.log('Email content:', content);

  const match = content.match(codeRegex);
  if (match) {
    console.log('Captured match:', match[1]);
    return match[1];
  }

  throw new Error('Verification code not found in email');
}

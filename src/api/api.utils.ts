// src/api/api.utils.ts
import { request, APIRequestContext } from '@playwright/test';

export async function createAPIRequestContext(): Promise<APIRequestContext> {
  const baseURL = process.env.DJELI_API_URL;
  if (!baseURL) {
    throw new Error('Base URL is not defined');
  }
  return await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      'Authorization': `Bearer ${process.env.APP_TOKEN}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

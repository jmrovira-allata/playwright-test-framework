import { test, expect } from '@playwright/test';
import { createAPIRequestContext } from '../../../src/api/api.utils';
import { endpoints } from '../../../src/api/api.config';

test('GET /v1/app/applications/current', async () => {
  const apiContext = await createAPIRequestContext();
  const response = await apiContext.get(endpoints.applicationsCurrent);

  console.log('Response Status:', response.status());

  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  console.log(data);

  expect(data).toHaveProperty('data', expect.any(Object));
});

test('GET /v1/app/applications/can-create', async () => {
  const apiContext = await createAPIRequestContext();
  const response = await apiContext.get(endpoints.canCreate);
  console.log('Response Status:', response.status());
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  console.log(data);

  // Add assertions based on the expected response structure
  expect(data).toHaveProperty('canCreate', true);
});

test('GET /v1/app/beats', async () => {
  const apiContext = await createAPIRequestContext();
  const response = await apiContext.get(endpoints.beatsIndex);
  console.log('Response Status:', response.status());
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  console.log(data);

  // Add assertions based on the expected response
  expect(data).toHaveProperty('data.payload', expect.any(Array));
});

test('GET /v1/app/social-network-brands', async () => {
  const apiContext = await createAPIRequestContext();
  const response = await apiContext.get(endpoints.socialNetworksIndex);
  console.log('Response Status:', response.status());
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  console.log(data);

  // Add assertions based on the expected response
  expect(data).toHaveProperty('data.payload', expect.any(Array));
});

// test('POST /v1/app/applications - Create Application', async () => {
//   const apiContext = await createAPIRequestContext();

//   const email = process.env.CONTRIBUTOR_EMAIL || 'default@example.com'; // Provide a default if undefined

//   const form = {
//     'application[pitch]': 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
//     'application[beats][0]': '8',
//     'application[beats][1]': '4',
//     'application[works][0]': 'https://google.com',
//     'user[first_name]': 'Contributor',
//     'user[last_name]': 'User',
//     'user[email]': email, // Ensure this is a string
//     'user[cell_phone]': '0123456789',
//     'application[writing_samples][0][content]': 'data:application/pdf;base64,...', // Add actual base64 content
//     'application[writing_samples][0][name]': 'test.pdf',
//     'application[writing_samples][0][type]': 'application/pdf',
//     'application[writing_samples][0][size]': '12000',
//   };

//   const response = await apiContext.post(endpoints.createApplication, {
//     form,
//   });

//   expect(response.ok()).toBeTruthy();
//   const data = await response.json();
//   console.log(data);

//   // Add assertions based on the expected response structure
//   expect(data).toHaveProperty('success', true);
// });

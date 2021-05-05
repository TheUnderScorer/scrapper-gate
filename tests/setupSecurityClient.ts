import { SecurityClient } from '@tshio/security-client';

beforeAll(async () => {
  console.log('Before all security client');

  global.securityClient = new SecurityClient({
    port: process.env.SECURITY_PORT
      ? parseInt(process.env.SECURITY_PORT)
      : undefined,
    host: process.env.SECURITY_HOST,
    https: process.env.SECURITY_HTTPS === 'true',
  });
});

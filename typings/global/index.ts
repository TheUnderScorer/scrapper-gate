import { Connection } from 'typeorm';
import { SecurityClient } from '@tshio/security-client';

declare global {
  namespace NodeJS {
    interface Global {
      connection: Connection;
      securityClient: SecurityClient;
    }
  }
}

import { SecurityClient } from '@tshio/security-client';
import { Connection } from 'typeorm';

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchImageSnapshot(params?: {
        customSnapshotIdentifier?: string;
        failureThreshold?: number;
      }): R;
    }
  }

  namespace NodeJS {
    interface Global {
      connection: Connection;
      securityClient: SecurityClient;
      browserExtensionStores: {
        local: Map<string, unknown>;
      };
    }
  }
}

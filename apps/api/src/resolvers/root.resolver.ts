import { DateScalar, RecordScalar } from '@scrapper-gate/backend/server';
import { Resolvers } from '@scrapper-gate/shared/schema';

export const rootResolver = (): Resolvers => ({
  Date: DateScalar,
  Record: RecordScalar,
});

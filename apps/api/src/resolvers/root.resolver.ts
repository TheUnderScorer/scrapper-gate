import { DateOrVariableKeyScalar } from '@scrapper-gate/shared/domain/variables';
import { DateScalar, RecordScalar } from '@scrapper-gate/shared/schema';
import { Resolvers } from '@scrapper-gate/shared/schema';

export const rootResolver = (): Resolvers => ({
  Date: DateScalar,
  Record: RecordScalar,
  DateOrVariableKey: DateOrVariableKeyScalar,
});

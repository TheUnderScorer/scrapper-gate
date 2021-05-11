import { ValidationErrors } from 'final-form';
import pLimit from 'p-limit';
import deepmerge from 'deepmerge';
import { logger } from '@scrapper-gate/frontend/logger';

export const validatorsPipe = <S>(
  ...validators: Array<
    (values: S) => ValidationErrors | Promise<ValidationErrors>
  >
) => async (data: S) => {
  logger.debug('Validators pipe:', data);

  const limit = pLimit(3);

  const results = await Promise.all(
    validators.map((validator) => limit(() => validator(data)))
  );

  return results.reduce((acc, currentValue) => {
    return deepmerge(acc, currentValue, {
      clone: false,
    });
  }, {});
};

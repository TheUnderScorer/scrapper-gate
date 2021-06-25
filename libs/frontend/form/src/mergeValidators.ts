import { ExcludeFalsy } from '@scrapper-gate/shared/common';
import { ValidationErrors } from 'final-form';
import pLimit from 'p-limit';
import deepmerge from 'deepmerge';

export const mergeValidators = <S>(
  ...validators: Array<
    (values: S) => ValidationErrors | Promise<ValidationErrors>
  >
) => async (data: S) => {
  const limit = pLimit(3);

  const results = await Promise.all(
    validators.map((validator) => limit(() => validator(data)))
  );

  return results.filter(ExcludeFalsy).reduce((acc, currentValue) => {
    return deepmerge(acc, currentValue, {
      clone: false,
    });
  }, {});
};

import { ValidationErrors } from 'final-form';
import isEmpty from 'lodash.isempty';

export const mergeValidators =
  <S>(
    ...validators: Array<
      (values: S) => ValidationErrors | Promise<ValidationErrors>
    >
  ) =>
  async (data: S) => {
    for (const validator of validators) {
      const result = await validator(data);

      if (!isEmpty(result)) {
        return result;
      }
    }

    return {};
  };

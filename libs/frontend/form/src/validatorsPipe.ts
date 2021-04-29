import { FormProps } from 'react-final-form';

export const validatorsPipe = <S>(...validators: FormProps['validate'][]) => (
  data: S
) => {
  return validators.reduce((acc, validator) => {
    const errors = validator(data);

    return {
      ...acc,
      ...(errors ?? {}),
    };
  }, {});
};

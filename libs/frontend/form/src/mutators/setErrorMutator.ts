/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '@scrapper-gate/shared/logger/console';
import { MutableState, FieldValidator } from 'final-form';

type Args = [name: string, error?: Error | string];

export const setErrorMutator = (args: Args, state: MutableState<any>) => {
  const [name, error] = args;

  Object.assign(state.fields[name], {
    data: {
      ...state.fields[name].data,
      error,
    },
  });

  logger.debug(`Set error for ${name}`, {
    error,
    state,
  });

  state.formState.lastSubmittedValues = state.formState.values;
};

const validate: FieldValidator<any> = (value, allValues, meta) =>
  meta?.data?.error;

setErrorMutator.validate = validate;

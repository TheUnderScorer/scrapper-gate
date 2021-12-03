import type { MutableState, Mutator } from 'final-form';

type Args = [name: string, touched: boolean];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setFieldTouched: Mutator<any> = (
  args: Args,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: MutableState<any>
) => {
  const [name, touched] = args;
  const field = state.fields[name];

  if (field) {
    field.touched = touched;
  }
};

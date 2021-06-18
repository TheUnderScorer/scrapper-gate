import { useField } from 'react-final-form';

export const useFormFieldValue = <ReturnValue>(
  name: string,
  defaultValue?: ReturnValue
): ReturnValue | undefined => {
  const field = useField(name, {
    subscription: {
      value: true,
    },
  });

  return (field.input.value as ReturnValue) ?? defaultValue;
};

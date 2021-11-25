import { FieldMetaState } from 'react-final-form';

export interface UseFieldErrorProps {
  meta: FieldMetaState<unknown>;
  showErrorOnlyOnTouched?: boolean;
}

export const useFieldError = ({
  showErrorOnlyOnTouched = true,
  meta,
}: UseFieldErrorProps) => {
  const error = meta.error as Error | undefined;

  if (!showErrorOnlyOnTouched) {
    return error;
  }

  return meta.touched ? error : undefined;
};

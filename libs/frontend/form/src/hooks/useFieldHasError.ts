import { FieldMetaState } from 'react-final-form';

export interface UseFieldHasErrorProps {
  meta: FieldMetaState<unknown>;
  showErrorOnlyOnTouched?: boolean;
}

export const useFieldHasError = ({
  showErrorOnlyOnTouched,
  meta,
}: UseFieldHasErrorProps) => {
  if (!showErrorOnlyOnTouched) {
    return Boolean(meta.error);
  }

  return meta.touched && Boolean(meta.error);
};

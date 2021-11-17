import { logger } from '@scrapper-gate/shared/logger/console';
import { removeAtIndex } from '@scrapper-gate/shared/common';
import { BaseEntity } from '@scrapper-gate/shared/schema';
import get from 'lodash.get';
import { useCallback, useMemo } from 'react';
import {
  FieldRenderProps,
  useField,
  UseFieldConfig,
  useForm,
} from 'react-final-form';
import { v4 } from 'uuid';

const defaultValue: unknown[] = [];

// eslint-disable-next-line @typescript-eslint/ban-types
export const useFieldArray = <T extends object>(
  name: string,
  props?: UseFieldConfig<T[]>
) => {
  const { getState } = useForm();

  const field = useField(name, {
    ...props,
    format: (value) =>
      value?.map((value) => {
        if (!(value as Record<string, unknown>).id) {
          (value as Record<string, unknown>).id = v4();
        }

        return value;
      }) ?? (defaultValue as T[]),
  });
  const {
    input: { onChange, value },
  } = field;

  const append = useCallback(
    (item: Omit<T, 'id'>) => {
      const result = {
        ...item,
        id: (item as Record<string, unknown>)?.id ?? v4(),
      };

      onChange([...(value ?? []), result]);

      return result;
    },
    [onChange, value]
  );

  const remove = useCallback(
    (index: number) => {
      const value = get(getState().values, name);
      const newValue = removeAtIndex(value, index);

      logger.debug('After remove:', {
        newValue,
        oldValue: value,
      });

      onChange(newValue);
    },
    [getState, name, onChange]
  );

  return useMemo(
    () => ({
      ...(field as FieldRenderProps<Array<T & Pick<BaseEntity, 'id'>>>),
      append,
      remove,
    }),
    [field, append, remove]
  );
};

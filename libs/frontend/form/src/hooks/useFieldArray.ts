/* eslint-disable @typescript-eslint/no-explicit-any */
import { removeAtIndex } from '@scrapper-gate/shared/common';
import { logger } from '@scrapper-gate/shared/logger/console';
import { BaseEntity, Maybe } from '@scrapper-gate/shared/schema';
import get from 'lodash.get';
import { useCallback, useMemo } from 'react';
import {
  FieldRenderProps,
  useField,
  UseFieldConfig,
  useForm,
} from 'react-final-form';
import { clone } from 'remeda';
import { v4 } from 'uuid';

const defaultValue: unknown[] = [];

const idGeneratedSymbol = Symbol('idGenerated');

// eslint-disable-next-line @typescript-eslint/ban-types
export const useFieldArray = <T extends object>(
  name: string,
  props?: UseFieldConfig<T[]>
) => {
  const { getState } = useForm();

  const format = useCallback(
    (value?: T[]) =>
      value?.map((item) => {
        const valueClone = clone(item) as Record<string | symbol, unknown>;

        if (!valueClone.id) {
          valueClone.id = v4();
          valueClone[idGeneratedSymbol] = true;
        }

        if ((item as Record<symbol, unknown>)[idGeneratedSymbol]) {
          valueClone[idGeneratedSymbol] = true;
        }

        return valueClone;
      }) ?? (defaultValue as T[]),
    []
  );

  const field = useField(name, {
    ...props,
    format,
    formatOnBlur: true,
  });
  const {
    input: { onChange, value },
  } = field;

  const append = useCallback(
    (item: Omit<T, 'id'>) => {
      const itemId = (item as Record<string, unknown>)?.id;
      const result: Record<string | symbol, unknown> = {
        ...item,
        id: itemId ?? v4(),
      };

      if (!itemId) {
        result[idGeneratedSymbol] = true;
      }

      logger.debug('Append:', result);

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

/**
 * Strips ids used by useFieldArray hook
 * */
useFieldArray.stripIds = <T extends Record<string, any>>(
  values?: Maybe<T[]>
) => {
  if (!values) {
    return [];
  }

  return values?.map((item) => {
    const valueClone = clone(item) as Record<string | symbol, unknown>;

    if ((item as Record<symbol, unknown>)[idGeneratedSymbol]) {
      delete valueClone[idGeneratedSymbol];
      delete valueClone.id;
    }

    return valueClone;
  }) as T[];
};

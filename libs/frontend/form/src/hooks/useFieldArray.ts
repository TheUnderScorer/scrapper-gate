import { FieldRenderProps, useField, UseFieldConfig } from 'react-final-form';
import { useCallback } from 'react';
import { removeAtIndex } from '@scrapper-gate/shared/common';
import { v4 } from 'uuid';
import { BaseEntity } from '@scrapper-gate/shared/schema';

export const useFieldArray = <T extends Record<string, unknown>>(
  name: string,
  props?: UseFieldConfig<T[]>
) => {
  const field = useField(name, {
    ...props,
    format: (value) =>
      value?.map((value) => {
        if (!value.id) {
          (value as Record<string, unknown>).id = v4();
        }

        return value;
      }) ?? [],
  });
  const {
    input: { onChange, value },
  } = field;

  const append = useCallback(
    (item: Omit<T, 'id'>) => {
      const result = {
        ...item,
        id: item?.id ?? v4(),
      };

      onChange([...(value ?? []), result]);

      return result;
    },
    [onChange, value]
  );

  const remove = useCallback(
    (index: number) => {
      const newValue = removeAtIndex(value, index);

      onChange(newValue);
    },
    [onChange, value]
  );

  return {
    ...(field as FieldRenderProps<Array<T & Pick<BaseEntity, 'id'>>>),
    append,
    remove,
  };
};

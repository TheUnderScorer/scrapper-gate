import React, { Ref, useCallback, useEffect, useState } from 'react';
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@material-ui/core';
import { ClearSharp } from '@material-ui/icons';
import { usePrevious } from 'react-use';
import { stopPropagation } from '@scrapper-gate/frontend/common';

export interface FilterTextFieldProps<T>
  extends Pick<
    TextFieldProps,
    'variant' | 'placeholder' | 'size' | 'className' | 'id'
  > {
  items: T[];
  onItemsChange: (items: T[]) => unknown;
  filterKeys: Array<keyof T>;
  onSearchChange?: (search: string) => unknown;
  ref?: Ref<HTMLInputElement>;
}

export const FilterTextField = <T extends unknown>({
  filterKeys,
  onItemsChange,
  items,
  onSearchChange,
  variant,
  ref,
  ...props
}: FilterTextFieldProps<T>) => {
  const [search, setSearch] = useState('');
  const prevSearch = usePrevious(search);
  const clearSearch = useCallback(() => setSearch(''), []);

  const filterItems = useCallback(
    (search: string) => {
      if (!search) {
        return onItemsChange(items);
      }

      const filteredItems = items.filter((item) => {
        return filterKeys.some((key) => {
          if (!item[key]) {
            return false;
          }

          return ((item[key] as unknown) as string)
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase());
        });
      });

      onItemsChange(filteredItems);
    },
    [filterKeys, items, onItemsChange]
  );

  useEffect(() => {
    if (search === prevSearch) {
      return;
    }

    filterItems(search);
  }, [search, filterItems, prevSearch]);

  return (
    <TextField
      className="filter-text-field"
      ref={ref}
      onClick={stopPropagation}
      onKeyUp={stopPropagation}
      onKeyDown={stopPropagation}
      value={search}
      onChange={(event) => {
        setSearch(event.target.value);

        onSearchChange?.(event.target.value);
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton size="small" onClick={clearSearch}>
              <ClearSharp />
            </IconButton>
          </InputAdornment>
        ),
      }}
      variant={variant}
      {...props}
    />
  );
};

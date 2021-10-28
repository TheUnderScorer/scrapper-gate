import { AutocompleteProps as BaseProps, TextFieldProps } from '@mui/material';
import type { ChipTypeMap } from '@mui/material/Chip';
import * as React from 'react';

export interface AutocompleteProps<
  T,
  Multiple extends boolean | undefined = boolean,
  DisableClearable extends boolean | undefined = boolean,
  FreeSolo extends boolean | undefined = boolean,
  ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent']
> extends Pick<
      BaseProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>,
      | 'getOptionLabel'
      | 'options'
      | 'value'
      | 'onChange'
      | 'freeSolo'
      | 'inputValue'
      | 'onInputChange'
    >,
    Pick<TextFieldProps, 'name'> {
  renderInput?: BaseProps<
    T,
    Multiple,
    DisableClearable,
    FreeSolo,
    ChipComponent
  >['renderInput'];
}

import { selectorModeMap } from '../selectorModeMap';
import { SelectorType } from '@scrapper-gate/shared/schema';
import React from 'react';
import {
  InputAdornment,
  MenuItem,
  Select,
  SelectProps,
  TextField,
  TextFieldProps,
} from '@material-ui/core';
import { Code } from '@material-ui/icons';
import { Key } from 'ts-key-enum';

const selectionModes = Object.entries(selectorModeMap);

export interface HtmlElementPickerInputProps
  extends Pick<
    TextFieldProps,
    'name' | 'variant' | 'onChange' | 'helperText' | 'error'
  > {
  mode: SelectorType.Selector | SelectorType.TextContent;
  value: string;
  onSelectChange: SelectProps['onChange'];
  onEnter?: () => unknown;
}

export const HtmlElementPickerInput = ({
  helperText,
  mode,
  name,
  onChange,
  onSelectChange,
  value,
  variant,
  onEnter,
  error,
}: HtmlElementPickerInputProps) => {
  return (
    <TextField
      name={name}
      placeholder={
        mode === SelectorType.Selector
          ? 'Enter query selector'
          : 'Enter text content'
      }
      fullWidth
      error={error}
      helperText={helperText}
      variant={variant}
      className="html-element-picker-input"
      onChange={onChange}
      value={value}
      onKeyDown={(event) => {
        if (event.key === Key.Enter) {
          event.preventDefault();

          onEnter?.();
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Code />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <Select
              className="html-element-picker-input-select"
              onChange={onSelectChange}
              value={mode}
              placeholder="Mode"
            >
              {selectionModes.map(([key, modeLabel]) => (
                <MenuItem value={key} key={key}>
                  {modeLabel}
                </MenuItem>
              ))}
            </Select>
          </InputAdornment>
        ),
      }}
    />
  );
};

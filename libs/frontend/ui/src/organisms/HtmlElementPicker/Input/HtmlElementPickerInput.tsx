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

const selectionModes = Object.entries(selectorModeMap);

export interface HtmlElementPickerInputProps
  extends Pick<TextFieldProps, 'name' | 'variant' | 'onChange' | 'helperText'> {
  mode: SelectorType.Selector | SelectorType.TextContent;
  value: string;
  onSelectChange: SelectProps['onChange'];
}

export const HtmlElementPickerInput = ({
  helperText,
  mode,
  name,
  onChange,
  onSelectChange,
  value,
  variant,
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
      helperText={helperText}
      variant={variant}
      className="html-element-picker-input"
      onChange={onChange}
      value={value}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Code />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <Select onChange={onSelectChange} value={mode} placeholder="Mode">
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

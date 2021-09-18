import {
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectProps,
  Stack,
  TextField,
  TextFieldProps,
  Tooltip,
} from '@mui/material';
import { Add, Code } from '@mui/icons-material';
import { Perhaps } from '@scrapper-gate/shared/common';
import { SelectorType } from '@scrapper-gate/shared/schema';
import React from 'react';
import { Key } from 'ts-key-enum';
import { HtmlElementPickerProps } from '../HtmlElementPicker.types';
import { selectorModeMap } from '../selectorModeMap';

const selectionModes = Object.entries(selectorModeMap);

export interface HtmlElementPickerInputProps
  extends Pick<TextFieldProps, 'variant' | 'helperText' | 'label' | 'name'>,
    Pick<
      HtmlElementPickerProps,
      'shouldAddSelectorOnEnter' | 'TextFieldComponent'
    > {
  mode: SelectorType.Selector | SelectorType.TextContent;
  value: Perhaps<string>;
  onSelectChange: SelectProps['onChange'];
  onEnter?: () => unknown;
  error?: string;
  onAdd?: () => unknown;
  onChange?: (text: string) => unknown;
}

export const HtmlElementPickerInput = ({
  helperText,
  mode,
  onChange,
  onSelectChange,
  value,
  variant,
  onEnter,
  error,
  label,
  onAdd,
  shouldAddSelectorOnEnter,
  TextFieldComponent,
  name,
}: HtmlElementPickerInputProps) => {
  const Component = TextFieldComponent ?? TextField;

  return (
    <Stack
      alignItems="baseline"
      direction="row"
      spacing={1}
      style={{
        width: '100%',
      }}
    >
      <Component
        name={name}
        label={label}
        fullWidth
        error={Boolean(error)}
        helperText={error ?? helperText}
        variant={variant}
        className="html-element-picker-input"
        onChange={(event) => onChange?.(event.target.value)}
        value={value}
        onKeyDown={(event) => {
          if (
            event.key === Key.Enter &&
            (!shouldAddSelectorOnEnter || shouldAddSelectorOnEnter(event))
          ) {
            event.stopPropagation();
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
                variant="standard"
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
      <Tooltip title="Add selector">
        <span>
          <IconButton
            className="add-selector"
            disabled={!value}
            onClick={onAdd}
            size="small"
          >
            <Add />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
};

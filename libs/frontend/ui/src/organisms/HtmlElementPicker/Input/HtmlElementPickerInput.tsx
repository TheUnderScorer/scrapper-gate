import { selectorModeMap } from '../selectorModeMap';
import { SelectorType } from '@scrapper-gate/shared/schema';
import React from 'react';
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
} from '@material-ui/core';
import { Add, Code } from '@material-ui/icons';
import { Key } from 'ts-key-enum';

const selectionModes = Object.entries(selectorModeMap);

export interface HtmlElementPickerInputProps
  extends Pick<
    TextFieldProps,
    'name' | 'variant' | 'onChange' | 'helperText' | 'label'
  > {
  mode: SelectorType.Selector | SelectorType.TextContent;
  value: string;
  onSelectChange: SelectProps['onChange'];
  onEnter?: () => unknown;
  error?: string;
  onAdd?: () => unknown;
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
  label,
  onAdd,
}: HtmlElementPickerInputProps) => {
  return (
    <Stack
      alignItems="center"
      direction="row"
      spacing={1}
      style={{
        width: '100%',
      }}
    >
      <TextField
        label={label}
        name={name}
        placeholder={
          mode === SelectorType.Selector
            ? 'Enter query selector'
            : 'Enter text content'
        }
        fullWidth
        error={Boolean(error)}
        helperText={error ?? helperText}
        variant={variant}
        className="html-element-picker-input"
        onChange={onChange}
        value={value}
        onKeyDown={(event) => {
          event.stopPropagation();

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

import {
  AutocompleteRenderInputParams,
  Box,
  createFilterOptions,
  Menu,
  MenuItem,
} from '@mui/material';
import { BlockEditorProps } from '@scrapper-gate/frontend/block-editor';
import { setRefValue, useListNavigation } from '@scrapper-gate/frontend/common';

import { AutocompleteProps, Highlight } from '@scrapper-gate/frontend/ui';
import { variableStartRegex } from '@scrapper-gate/shared/domain/variables';
import classNames from 'classnames';
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FieldInputProps, FieldMetaState, useField } from 'react-final-form';
import { BaseRange, Editor, Transforms } from 'slate';
import {
  VariablesTextField,
  VariablesTextFieldProps,
} from '../VariablesTextField/VariablesTextField';

export interface VariablesAutocompleteChildrenBag {
  autoCompleteParams: AutocompleteRenderInputParams;
  meta: FieldMetaState<string>;
  input: FieldInputProps<string>;
  hasError?: boolean;
}

export interface VariablesAutocompleteProps<T>
  extends Omit<AutocompleteProps<T>, 'renderInput'>,
    Pick<VariablesTextFieldProps, 'fieldProps' | 'label'>,
    Pick<BlockEditorProps, 'editorInstanceRef' | 'initialFocused'> {
  name: string;
}

const filter = createFilterOptions<string>({
  trim: true,
  ignoreCase: true,
  matchFrom: 'any',
});

export const VariablesAutocomplete = ({
  name,
  fieldProps,
  label,
  value,
  getOptionLabel: getOptionLabelProp,
  editorInstanceRef: propEditorInstanceRef,
  initialFocused = false,
  ...rest
}: VariablesAutocompleteProps<string>) => {
  const editorRef = useRef<Editor>();

  const field = useField(name, fieldProps);
  const anchorRef = useRef<HTMLDivElement>();

  const hasVariableStart = useMemo(
    () => variableStartRegex.test(field.input.value),
    [field.input.value]
  );

  const getOptionLabel = useCallback(
    (option: string) =>
      getOptionLabelProp ? getOptionLabelProp(option) : (option as string),

    [getOptionLabelProp]
  );

  const [focused, setFocused] = useState(initialFocused);
  const [filteredOptions, setFilteredOptions] = useState(rest.options);

  const handleOptionSelect = useCallback(
    (option: string) => {
      if (!editorRef.current) {
        return;
      }

      const label = getOptionLabel(option);
      const prevSelection: BaseRange = {
        ...editorRef.current?.selection,
      };

      if (!prevSelection) {
        return;
      }

      field.input.onChange(label);

      Transforms.select(editorRef.current, {
        ...prevSelection,
        focus: {
          path: prevSelection.focus?.path,
          offset: label.length,
        },
        anchor: {
          path: prevSelection.anchor?.path,
          offset: label.length,
        },
      });
    },
    [field.input, getOptionLabel]
  );

  const { activeItem, setActiveItem } = useListNavigation({
    items: filteredOptions as string[],
    disabled: hasVariableStart,
    onEnter: handleOptionSelect,
  });

  useEffect(() => {
    setFilteredOptions(
      filter(rest.options as string[], {
        getOptionLabel,
        inputValue: field.input.value,
      })
    );
  }, [field.input.value, getOptionLabel, rest.options]);

  useEffect(() => {
    if (propEditorInstanceRef) {
      setRefValue(propEditorInstanceRef, editorRef.current);
    }
  }, [propEditorInstanceRef]);

  return (
    <Box ref={anchorRef} width="100%">
      <VariablesTextField
        editorInstanceRef={editorRef as MutableRefObject<Editor>}
        name={name}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        initialFocused={initialFocused}
        fieldProps={fieldProps}
        sx={{
          width: '100%',
        }}
        label={label}
      />

      <Menu
        className="variables-autocomplete-suggestions"
        anchorEl={anchorRef.current}
        open={filteredOptions.length > 0 && focused}
        disableAutoFocus
        disablePortal
        autoFocus={false}
      >
        {filteredOptions.map((option, index) => {
          const selected = activeItem === option;

          return (
            <MenuItem
              className={classNames('variables-autocomplete-suggestion', {
                selected,
              })}
              onMouseOver={() => setActiveItem(option)}
              selected={selected}
              onClick={() => handleOptionSelect(option)}
              key={index}
            >
              <Highlight
                text={getOptionLabel(option) ?? ''}
                value={field.input.value ?? ''}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
} from '@material-ui/core';
import { Add, Colorize } from '@material-ui/icons';
import { useDebounce, useKey, useToggle, useUnmount } from 'react-use';
import { createPortal } from 'react-dom';
import { useField } from 'react-final-form';
import { HtmlElementPickerSnackbar } from './Snackbar/HtmlElementPickerSnackbar';
import { SelectorsList } from '../../molecules/SelectorsList/SelectorsList';
import {
  HtmlElementPickerProps,
  HtmlElementPickerValidationRules,
} from './HtmlElementPicker.types';
import {
  getElementsBySelectors,
  removeAtIndex,
} from '@scrapper-gate/shared/common';
import { makeUniqueSelector } from '@scrapper-gate/frontend/html-picker';
import { Selector, SelectorType } from '@scrapper-gate/shared/schema';
import { addHighlight, removeHighlight } from '@scrapper-gate/frontend/common';
import { TooltipText } from '../../atoms/TooltipText/TooltipText';
import { useHtmlPicker } from './useHtmlPicker';
import { useHtmlPickerValidator } from './useHtmlPickerValidator';
import { HtmlElementPickerInput } from './Input/HtmlElementPickerInput';
import { InvalidSelectorProvidedError } from '@scrapper-gate/shared/errors';
import { uniqBy } from 'remeda';

export const HtmlElementPicker = ({
  name,
  variant,
  className,
  label,
  helperText,
  onPickerToggle,
  container = document.body,
  ignoredElementsContainer,
  pickerDisabled,
  pickerDisabledTooltip = 'Picker is currently not available',
  elementsValidator,
  validationRules = [],
  defaultMode = SelectorType.Selector,
  highlightId,
}: HtmlElementPickerProps) => {
  const [textFieldValue, setTextFieldValue] = useState<string | null>('');
  const handleTextFieldValueChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setTextFieldValue(e.target.value);
    },
    []
  );

  const [mode, setMode] = useState(defaultMode);

  const id = useMemo(() => `html-element-picker-${highlightId ?? name}`, [
    name,
    highlightId,
  ]);
  const uniqueSelector = useMemo(
    () => makeUniqueSelector({ ignoredClassNames: [id] }),
    [id]
  );

  const validate = useHtmlPickerValidator({
    pickerDisabled,
    validationRules,
    elementsValidator,
  });

  const {
    input: { onChange, value },
    meta: { error: fieldError },
  } = useField<Selector[]>(name, {
    validate,
  });

  const getValueByMode = useCallback(
    (element: Element): Selector => {
      switch (mode) {
        case SelectorType.Selector:
          return {
            type: mode,
            value: uniqueSelector(element),
          };

        case SelectorType.TextContent:
          return {
            type: mode,
            value: element.textContent,
          };

        default:
          throw new Error('Invalid mode provided.');
      }
    },
    [mode, uniqueSelector]
  );

  const [addError, setAddError] = useState<Error | null>(null);
  const handleAdd = useCallback(() => {
    setAddError(null);

    if (!textFieldValue) {
      return;
    }

    const valueCopy = [...value];

    const newSelector: Selector = {
      value: textFieldValue,
      type: mode,
    };

    if (
      validationRules.includes(HtmlElementPickerValidationRules.ValidSelector)
    ) {
      try {
        getElementsBySelectors([newSelector], document);
      } catch {
        setAddError(new InvalidSelectorProvidedError());
        return;
      }
    }

    const newValue: Selector[] = uniqBy(
      [...valueCopy, newSelector],
      (item) => `${item.value}${item.type}`
    );

    setTextFieldValue('');
    onChange(newValue);
  }, [textFieldValue, value, mode, validationRules, onChange]);

  const handleDelete = useCallback(
    (index: number) => {
      if (!value) {
        return;
      }

      const newValue = removeAtIndex(value, index);

      onChange(newValue);
    },
    [value, onChange]
  );

  const [open, toggleOpen] = useToggle(false);
  const [clickEnabled, toggleClickEnabled] = useToggle(false);
  const [multiSelect, toggleMultiSelect] = useToggle(false);

  const error = fieldError ?? addError;

  const { hoveredElement, pickerRef } = useHtmlPicker({
    value,
    onChange,
    toggleOpen,
    open,
    getValueByMode,
    multiSelect,
    mode,
    container,
    ignoredElementsContainer,
    clickEnabled,
  });

  useEffect(() => {
    if (onPickerToggle) {
      onPickerToggle(open);
    }
  }, [open, onPickerToggle]);

  useKey('Escape', () => {
    toggleOpen(false);
  });

  useDebounce(
    async () => {
      removeHighlight(id);

      if (value) {
        try {
          const elements = getElementsBySelectors(
            value,
            document
          ).filter((element) =>
            ignoredElementsContainer
              ? !ignoredElementsContainer.contains(element)
              : true
          );

          if (elements.length) {
            addHighlight(elements, id);
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }
    },
    500,
    [value, id, ignoredElementsContainer]
  );

  useUnmount(() => {
    removeHighlight(id);
    pickerRef.current?.dispose();
  });

  return (
    <Grid className={className} container direction="column">
      <Stack
        alignItems="center"
        direction="row"
        spacing={1}
        style={{
          width: '100%',
        }}
      >
        <HtmlElementPickerInput
          label={label}
          error={error?.message}
          name={name}
          mode={mode}
          helperText={helperText}
          variant={variant}
          onChange={handleTextFieldValueChange}
          value={textFieldValue}
          onEnter={handleAdd}
          onSelectChange={(event) =>
            setMode(event.target.value as SelectorType)
          }
        />
        <IconButton
          className="add-selector"
          disabled={!textFieldValue}
          onClick={handleAdd}
          size="small"
        >
          <Add />
        </IconButton>
      </Stack>
      <Box mt={1}>
        <Tooltip
          title={
            pickerDisabled ? (
              <TooltipText>{pickerDisabledTooltip}</TooltipText>
            ) : (
              ''
            )
          }
        >
          <span>
            <Button
              startIcon={<Colorize />}
              disabled={pickerDisabled}
              className="toggle-picker"
              onClick={(e) => {
                e.stopPropagation();

                toggleOpen(!open);
              }}
            >
              {open ? 'Close picker' : 'Open picker'}
            </Button>
          </span>
        </Tooltip>
      </Box>
      <SelectorsList
        ignoredElementsContainer={ignoredElementsContainer}
        hideHeader
        onDelete={handleDelete}
        value={value ?? []}
      />
      {Boolean(value?.length) && <Divider />}
      {container &&
        open &&
        createPortal(
          <div
            style={{
              pointerEvents: 'all',
            }}
          >
            <HtmlElementPickerSnackbar
              onDelete={handleDelete}
              getSelector={getValueByMode}
              value={value ?? []}
              multiselect={multiSelect}
              onMultiSelect={toggleMultiSelect}
              hoveredElement={hoveredElement}
              onClose={() => {
                toggleOpen(false);
              }}
              open={open}
              enableClick={clickEnabled}
              onEnableClickToggle={toggleClickEnabled}
            />
          </div>,
          container
        )}
    </Grid>
  );
};

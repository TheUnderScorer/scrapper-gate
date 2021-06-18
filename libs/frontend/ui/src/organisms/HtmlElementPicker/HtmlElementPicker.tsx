import { Box, Button, Divider, Grid, Tooltip } from '@material-ui/core';
import { Colorize } from '@material-ui/icons';
import { addHighlight, removeHighlight } from '@scrapper-gate/frontend/common';
import { makeUniqueSelector } from '@scrapper-gate/frontend/html-picker';
import {
  getElementsBySelectors,
  removeAtIndex,
} from '@scrapper-gate/shared/common';
import { InvalidSelectorProvidedError } from '@scrapper-gate/shared/errors';
import { Selector, SelectorType } from '@scrapper-gate/shared/schema';
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useField } from 'react-final-form';
import { useDebounce, useKey, useToggle, useUnmount } from 'react-use';
import { uniqBy } from 'remeda';
import { Key } from 'ts-key-enum';
import { TooltipText } from '../../atoms/TooltipText/TooltipText';
import { SelectorsList } from '../../molecules/SelectorsList/SelectorsList';
import { HtmlElementPickerElementDropdown } from './ElementDropdown/HtmlElementPickerElementDropdown';
import {
  HtmlElementPickerProps,
  HtmlElementPickerValidationRules,
} from './HtmlElementPicker.types';
import { HtmlElementPickerInput } from './Input/HtmlElementPickerInput';
import { HtmlElementPickerSnackbar } from './Snackbar/HtmlElementPickerSnackbar';
import { useHtmlPicker } from './useHtmlPicker';
import { useHtmlPickerValidator } from './useHtmlPickerValidator';

const initialValue: Selector[] = [];

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
  portal = container,
  filterSelectorsForValidation,
  shouldAddSelectorOnEnter,
  TextFieldComponent,
}: HtmlElementPickerProps) => {
  const [open, toggleOpen] = useToggle(false);
  const [clickEnabled, toggleClickEnabled] = useToggle(false);
  const [multiSelect, toggleMultiSelect] = useToggle(true);

  const [textFieldValue, setTextFieldValue] = useState<string | null>('');
  const [mode, setMode] = useState(defaultMode);

  const id = useMemo(() => `html-element-picker-${highlightId ?? name}`, [
    name,
    highlightId,
  ]);
  const uniqueSelector = useMemo(
    () => makeUniqueSelector({ ignoredClassNames: [id] }),
    [id]
  );

  const getSelectorsForValidation = useCallback(
    (selectors: Selector[]) =>
      filterSelectorsForValidation
        ? filterSelectorsForValidation(selectors)
        : selectors,
    [filterSelectorsForValidation]
  );

  const validate = useHtmlPickerValidator({
    pickerDisabled,
    validationRules,
    elementsValidator,
    filterSelectorsForValidation: getSelectorsForValidation,
  });

  const {
    input: { onChange, value },
    meta: { error: fieldError },
  } = useField<Selector[]>(name, {
    validate,
    initialValue,
    defaultValue: initialValue,
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
            value: element.textContent ?? '',
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

    const [filteredSelector] = getSelectorsForValidation([newSelector]);

    if (
      validationRules.includes(
        HtmlElementPickerValidationRules.ValidSelector
      ) &&
      filteredSelector
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
  }, [
    textFieldValue,
    value,
    mode,
    getSelectorsForValidation,
    validationRules,
    onChange,
  ]);

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

  const appendElement = useCallback(
    (target: Element, event?: Event) => {
      if (
        ignoredElementsContainer?.contains(target) ||
        event?.type === 'mousemove'
      ) {
        return;
      }

      const newValue = getValueByMode(target);

      if (!newValue.value) {
        return;
      }

      if (!multiSelect) {
        onChange([newValue]);

        toggleOpen(false);
      } else {
        onChange([...(value ?? []), newValue]);
      }
    },
    [
      getValueByMode,
      ignoredElementsContainer,
      multiSelect,
      onChange,
      toggleOpen,
      value,
    ]
  );

  const error = fieldError ?? addError;

  const elementDropdownRef = useRef<HTMLDivElement>();

  const {
    pickerRef,
    selectedElement,
    selectedElementSelector,
    setTarget,
  } = useHtmlPicker({
    appendElement,
    open,
    getValueByMode,
    mode,
    container,
    ignoredElementsContainer,
    clickEnabled,
    elementDropdownRef,
    uniqueSelector,
  });

  useEffect(() => {
    if (onPickerToggle) {
      onPickerToggle(open);
    }
  }, [open, onPickerToggle]);

  useKey(Key.Escape, () => {
    toggleOpen(false);
  });

  useDebounce(
    async () => {
      removeHighlight(id);

      if (value) {
        try {
          const elements = getElementsBySelectors(
            getSelectorsForValidation(value),
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
    [value, id, ignoredElementsContainer, getSelectorsForValidation]
  );

  useUnmount(() => {
    removeHighlight(id);
    pickerRef.current?.dispose();
  });

  const input = (
    <HtmlElementPickerInput
      name={name}
      TextFieldComponent={TextFieldComponent}
      shouldAddSelectorOnEnter={shouldAddSelectorOnEnter}
      onAdd={handleAdd}
      label={label}
      error={error?.message}
      mode={mode}
      helperText={helperText}
      variant={variant}
      onChange={setTextFieldValue}
      value={textFieldValue}
      onEnter={handleAdd}
      onSelectChange={(event) => setMode(event.target.value as SelectorType)}
    />
  );

  return (
    <Grid className={className} container direction="column">
      {input}
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
      {portal &&
        open &&
        createPortal(
          <HtmlElementPickerSnackbar
            input={input}
            onDelete={handleDelete}
            value={value ?? []}
            multiselect={multiSelect}
            onMultiSelect={toggleMultiSelect}
            onClose={() => {
              toggleOpen(false);
            }}
            open={open}
            enableClick={clickEnabled}
            onEnableClickToggle={toggleClickEnabled}
          />,
          portal
        )}
      <HtmlElementPickerElementDropdown
        onSelectedElementChange={setTarget}
        onSelect={() => {
          if (selectedElement) {
            appendElement(selectedElement);
          }
        }}
        selector={selectedElementSelector}
        ref={elementDropdownRef as MutableRefObject<HTMLDivElement>}
        selectedElement={selectedElement}
      />
    </Grid>
  );
};

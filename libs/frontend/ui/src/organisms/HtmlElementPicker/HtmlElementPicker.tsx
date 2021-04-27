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
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Tooltip,
} from '@material-ui/core';
import { Add, Colorize } from '@material-ui/icons';
import { useDebounce, useKey, useToggle, useUnmount } from 'react-use';
import { createPortal } from 'react-dom';
import { useField } from 'react-final-form';
import { HtmlElementPickerSnackbar } from './Snackbar/HtmlElementPickerSnackbar';
import { SelectorsList } from '../../molecules/SelectorsList/SelectorsList';
import { HtmlElementPickerProps } from './HtmlElementPicker.types';
import { getElementsBySelectors } from '@scrapper-gate/shared/common';
import { makeUniqueSelector } from '../../../../html-picker/src/selectors';
import { Selector, SelectorType } from '@scrapper-gate/shared/schema';
import { useStyles } from './HtmlElementPicker.styles';
import { addHighlight, removeHighlight } from '@scrapper-gate/frontend/common';
import { TooltipText } from '../../atoms/TooltipText/TooltipText';
import { useHtmlPicker } from './useHtmlPicker';
import { useHtmlPickerValidator } from './useHtmlPickerValidator';
import { HtmlElementPickerInput } from './Input/HtmlElementPickerInput';

const HtmlElementPicker = ({
  name,
  variant,
  className,
  label,
  helperText,
  onPickerToggle,
  container,
  ignoredElementsContainer,
  pickerDisabled,
  pickerDisabledTooltip = 'Picker is currently not available',
  elementsValidator,
  validationRules = [],
  defaultMode = SelectorType.Selector,
  highlightId,
}: HtmlElementPickerProps) => {
  const classes = useStyles();

  const [textFieldValue, setTextFieldValue] = useState<string | null>(null);
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
    meta: { error },
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

  const handleAdd = useCallback(() => {
    if (!textFieldValue) {
      return;
    }

    const newValue: Selector[] = [
      ...(value ?? []),
      {
        value: textFieldValue,
        type: mode,
      },
    ];

    onChange(newValue);
    setTextFieldValue('');
  }, [onChange, textFieldValue, value, mode]);

  const handleDelete = useCallback(
    (index: number) => {
      if (!value) {
        return;
      }

      const newValue = [...value];
      newValue.splice(index, 1);

      onChange(newValue);
    },
    [value, onChange]
  );

  const [open, toggleOpen] = useToggle(false);
  const [clickEnabled, toggleClickEnabled] = useToggle(false);
  const [multiSelect, toggleMultiSelect] = useToggle(false);

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
          const elements = getElementsBySelectors(value, document);

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
    [value, id]
  );

  useUnmount(() => {
    removeHighlight(id);
    pickerRef.current?.close();
  });

  return (
    <Grid className={className} container direction="column">
      <InputLabel shrink error={Boolean(error)}>
        {label}
      </InputLabel>
      <SelectorsList hideHeader onDelete={handleDelete} value={value ?? []} />
      <Grid
        alignItems="baseline"
        container
        spacing={1}
        style={{
          width: '100%',
        }}
      >
        <Grid item xs={11}>
          <HtmlElementPickerInput
            name={name}
            mode={mode}
            helperText={helperText}
            variant={variant}
            onChange={handleTextFieldValueChange}
            value={textFieldValue}
            onSelectChange={(event) =>
              setMode(event.target.value as SelectorType)
            }
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton
            className="add-selector"
            disabled={!textFieldValue}
            onClick={handleAdd}
            size="small"
          >
            <Add />
          </IconButton>
        </Grid>
      </Grid>
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
              Open picker
            </Button>
          </span>
        </Tooltip>
      </Box>
      {error && (
        <FormHelperText className={classes.helperText}>{error}</FormHelperText>
      )}

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

export default HtmlElementPicker;

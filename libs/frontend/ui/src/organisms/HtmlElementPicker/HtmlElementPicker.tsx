import React, {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  useTheme,
} from '@material-ui/core';
import { Add, Code, Colorize } from '@material-ui/icons';
import tinycolor from 'tinycolor2';
import { useDebounce, useKey, useToggle, useUnmount } from 'react-use';
import { createPortal } from 'react-dom';
import { useField } from 'react-final-form';
import { HtmlElementPickerSnackbar } from './Snackbar/HtmlElementPickerSnackbar';
import { SelectorsList } from '../../molecules/SelectorsList/SelectorsList';
import {
  HtmlElementPickerProps,
  HtmlElementPickerValidationRules,
} from './HtmlElementPicker.types';
import { getElementsBySelectors } from '@scrapper-gate/shared/common';
import { makeUniqueSelector } from '../../../../html-picker/src/selectors';
import { HtmlPicker } from '@scrapper-gate/frontend/html-picker';
import { Selector, SelectorType } from '@scrapper-gate/shared/schema';
import { useStyles } from './HtmlElementPicker.styles';
import { addHighlight, removeHighlight } from '@scrapper-gate/frontend/common';
import { useDebouncedValidator } from '@scrapper-gate/frontend/form';
import { TooltipText } from '../../atoms/TooltipText/TooltipText';
import { selectorModeMap } from './selectorModeMap';

const selectionModes = Object.entries(selectorModeMap);

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

  const validateFn = useCallback(
    (fieldValue?: Selector[]) => {
      if (fieldValue?.length && validationRules.length && !pickerDisabled) {
        try {
          const elements = getElementsBySelectors(fieldValue ?? [], document);

          if (
            !elements.length &&
            validationRules.includes(
              HtmlElementPickerValidationRules.ElementsExist
            )
          ) {
            return 'No elements found matching given selector';
          }

          if (elementsValidator) {
            return elementsValidator(elements);
          }
        } catch {
          if (
            !validationRules.includes(
              HtmlElementPickerValidationRules.ValidSelector
            )
          ) {
            return undefined;
          }

          return 'Invalid selector provided';
        }
      }

      return undefined;
    },
    [validationRules, pickerDisabled, elementsValidator]
  );

  const validate = useDebouncedValidator<Selector[]>({
    validate: validateFn,
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

  const pickerRef = useRef<HtmlPicker | null>(null);

  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null
  );

  const [open, toggleOpen] = useToggle(false);
  const [clickEnabled, toggleClickEnabled] = useToggle(false);
  const [multiSelect, toggleMultiSelect] = useToggle(false);

  const theme = useTheme();

  const callback = useCallback(
    (target: Element, event: Event) => {
      if (
        ignoredElementsContainer?.contains(target) ||
        event.type === 'mousemove'
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
      ignoredElementsContainer,
      getValueByMode,
      multiSelect,
      onChange,
      toggleOpen,
      value,
    ]
  );

  useEffect(() => {
    if (pickerRef.current) {
      pickerRef.current.close();
    }

    if (open) {
      pickerRef.current = new HtmlPicker({
        background: tinycolor(theme.palette.primary.light)
          .setAlpha(0.5)
          .toRgbString(),
        borderWidth: 2,
        ignoreElementsContainer: ignoredElementsContainer,
        onElementHover: async (element) => {
          if (
            ignoredElementsContainer?.contains(element) ||
            !getValueByMode(element).value
          ) {
            return;
          }

          setHoveredElement(element);
        },
        action: {
          trigger: 'click',
          callback,
        },
      });
    } else {
      pickerRef.current = null;
    }
  }, [
    open,
    theme,
    pickerRef,
    onChange,
    container,
    ignoredElementsContainer,
    callback,
    mode,
    getValueByMode,
  ]);

  useEffect(() => {
    if (!open) {
      setHoveredElement(null);
    }
  }, [open]);

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

  useEffect(() => {
    if (pickerRef.current) {
      pickerRef.current.preventClick = !clickEnabled;
      pickerRef.current.action = {
        trigger: 'click',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        callback: clickEnabled ? () => {} : callback,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickEnabled, pickerRef.current, callback]);

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
            onChange={handleTextFieldValueChange}
            value={textFieldValue}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Code />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Select
                    onChange={(event: ChangeEvent<{ value: string }>) =>
                      setMode(event.target.value as SelectorType)
                    }
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

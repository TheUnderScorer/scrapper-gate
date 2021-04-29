import React, { useCallback, useMemo, useState } from 'react';
import {
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import {
  SelectorsList,
  SelectorsListProps,
} from '../../../molecules/SelectorsList/SelectorsList';
import { CollapsableCard } from '../../../molecules/CollapsableCard/CollapsableCard';
import { KeyHint } from '../../../atoms/KeyHint/KeyHint';
import { Selector } from '@scrapper-gate/shared/schema';
import { useKeyboardShortcuts } from '@scrapper-gate/frontend/keyboard-shortcuts';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSnackbar } from 'notistack';

export interface HtmlElementPickerSnackbarProps {
  open?: boolean;
  onClose?: () => unknown;
  hoveredElement: HTMLElement | null;
  enableClick: boolean;
  onEnableClickToggle: (value?: boolean) => unknown;
  multiselect: boolean;
  onMultiSelect: (value?: boolean) => unknown;
  value: Selector[];
  getSelector: (element: Element) => Selector;
  onDelete?: SelectorsListProps['onDelete'];
  ignoredElementsContainer?: HTMLElement;
}

const useStyles = makeStyles(() => ({
  title: {
    '& .collapsable-card-title': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '60vw',
    },
  },
  selectorsList: {
    maxHeight: '40vh',
    overflow: 'auto',
  },
  card: {
    position: 'fixed',
    bottom: 0,
    width: '100vw',
    marginBottom: '0 !important',
  },
}));

export const HtmlElementPickerSnackbar = ({
  onClose,
  hoveredElement,
  enableClick,
  onEnableClickToggle,
  multiselect,
  onMultiSelect,
  value,
  getSelector,
  onDelete,
  ignoredElementsContainer,
}: HtmlElementPickerSnackbarProps) => {
  const keyboardShortcuts = useKeyboardShortcuts();

  const snackbar = useSnackbar();

  const [expanded, setExpanded] = useState(true);
  const classes = useStyles();

  const selector = useMemo(
    () => (hoveredElement ? getSelector(hoveredElement) : null),
    [getSelector, hoveredElement]
  );

  const handleEnableClickToggle = useCallback(
    (toggle?: boolean) => {
      onEnableClickToggle(toggle);

      if (!expanded) {
        snackbar.enqueueSnackbar(
          toggle ? 'Element clicking enabled' : 'Element clicking disabled',
          {
            anchorOrigin: {
              horizontal: 'right',
              vertical: 'top',
            },
            variant: 'info',
          }
        );
      }
    },
    [expanded, onEnableClickToggle, snackbar]
  );

  useHotkeys(
    keyboardShortcuts.elementPicker.toggleElementClicking,
    (event) => {
      event.stopPropagation();

      handleEnableClickToggle(!enableClick);
    },
    [enableClick]
  );

  return (
    <CollapsableCard
      primary
      onChange={setExpanded}
      className={classNames('picker-snackbar', classes.title, classes.card)}
      closable
      onClose={onClose}
      title={
        hoveredElement && selector
          ? selector.value
          : 'Hover over element to view details.'
      }
    >
      <Grid container direction="column" spacing={2}>
        {Boolean(value.length) && (
          <Grid item>
            <SelectorsList
              ignoredElementsContainer={ignoredElementsContainer}
              className={classes.selectorsList}
              onDelete={onDelete}
              value={value}
            />
            <Divider />
          </Grid>
        )}
        <Grid item>
          <FormControlLabel
            label={
              <Stack alignItems="center" spacing={1} direction="row">
                <span>Enable element clicking</span>
                <KeyHint>
                  {keyboardShortcuts.elementPicker.toggleElementClicking}
                </KeyHint>
              </Stack>
            }
            className="enable-click-control"
            control={
              <Switch
                checked={enableClick}
                onChange={(e, checked) => {
                  e.stopPropagation();
                  handleEnableClickToggle(checked);
                }}
              />
            }
          />
          <Typography variant="caption" component="div">
            If enabled, you won't be able to select any elements.
          </Typography>
        </Grid>
        <Grid item>
          <FormControlLabel
            label="Multi selection"
            className="multiselect"
            control={
              <Switch
                checked={multiselect}
                onChange={(e, checked) => {
                  e.stopPropagation();
                  onMultiSelect(checked);
                }}
              />
            }
          />
          <Typography variant="caption" component="div">
            If enabled, append selected selector to selection rather than
            overwriting it.
          </Typography>
        </Grid>
      </Grid>
    </CollapsableCard>
  );
};

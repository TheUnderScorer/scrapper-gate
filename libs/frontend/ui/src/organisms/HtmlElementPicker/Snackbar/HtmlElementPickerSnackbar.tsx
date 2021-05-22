import {
  AppBar,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import { useKeyboardShortcuts } from '@scrapper-gate/frontend/keyboard-shortcuts';
import { Selector } from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import { useSnackbar } from 'notistack';
import React, { ReactNode, useCallback } from 'react';
import Draggable from 'react-draggable';
import { useHotkeys } from 'react-hotkeys-hook';
import { KeyHint } from '../../../atoms/KeyHint/KeyHint';
import {
  SelectorsList,
  SelectorsListProps,
} from '../../../molecules/SelectorsList/SelectorsList';

export interface HtmlElementPickerSnackbarProps {
  open?: boolean;
  onClose?: () => unknown;
  enableClick: boolean;
  onEnableClickToggle: (value?: boolean) => unknown;
  multiselect: boolean;
  onMultiSelect: (value?: boolean) => unknown;
  value: Selector[];
  onDelete?: SelectorsListProps['onDelete'];
  ignoredElementsContainer?: HTMLElement;
  input: ReactNode;
}

const useStyles = makeStyles((theme) => ({
  selectorsList: {
    maxHeight: '40vh',
    overflow: 'auto',
  },
  paper: {
    minWidth: '550px',
    backgroundColor: theme.palette.greyVariant['100'],
    position: 'absolute',
    pointerEvents: 'all',
  },
  content: {
    padding: theme.spacing(2),
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    cursor: 'move',
  },
  toolbar: {
    paddingLeft: theme.spacing(0.5),
  },
}));

export const HtmlElementPickerSnackbar = ({
  onClose,
  enableClick,
  onEnableClickToggle,
  multiselect,
  onMultiSelect,
  value,
  onDelete,
  ignoredElementsContainer,
  input,
}: HtmlElementPickerSnackbarProps) => {
  const keyboardShortcuts = useKeyboardShortcuts();

  const snackbar = useSnackbar();

  const classes = useStyles();

  const handleEnableClickToggle = useCallback(
    (toggle?: boolean) => {
      onEnableClickToggle(toggle);
    },
    [onEnableClickToggle, snackbar]
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
    <Draggable
      bounds={{
        top: 0,
        bottom: window.innerHeight,
        left: -250,
        right: window.innerWidth - 250,
      }}
      defaultClassName="draggable"
      axis="both"
      handle=".element-picker-dialog"
    >
      <Paper
        elevation={3}
        className={classNames('element-picker-dialog', classes.paper)}
      >
        <AppBar
          className={classes.appBar}
          variant="outlined"
          position="static"
          color="transparent"
        >
          <Toolbar className={classes.toolbar}>
            <IconButton color="inherit" onClick={onClose}>
              <Close />
            </IconButton>
            <Typography>Select element</Typography>
          </Toolbar>
        </AppBar>
        <Stack className={classes.content} direction="column" spacing={2}>
          {input}
          <SelectorsList
            ignoredElementsContainer={ignoredElementsContainer}
            className={classes.selectorsList}
            onDelete={onDelete}
            value={value}
          />
          <Stack direction="column">
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
                  onChange={(e) => {
                    e.stopPropagation();
                    handleEnableClickToggle(e.target.checked);
                  }}
                />
              }
            />
            <Typography variant="caption" component="div">
              If enabled, you won't be able to select any elements.
            </Typography>
          </Stack>
          <Stack direction="column">
            <FormControlLabel
              label="Multi selection"
              className="multiselect"
              control={
                <Switch
                  checked={multiselect}
                  onChange={(e) => {
                    e.stopPropagation();
                    onMultiSelect(e.target.checked);
                  }}
                />
              }
            />
            <Typography variant="caption" component="div">
              If enabled, append selected selector to selection rather than
              overwriting it.
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Draggable>
  );
};

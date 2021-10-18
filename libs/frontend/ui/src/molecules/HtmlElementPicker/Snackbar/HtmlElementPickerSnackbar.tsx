import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useKeyboardShortcuts } from '@scrapper-gate/frontend/keyboard-shortcuts';
import { CancelButton } from '../../../atoms/Buttons/Buttons';
import { Selector } from '@scrapper-gate/shared/schema';
import React, { ReactNode } from 'react';
import Draggable from 'react-draggable';
import { useHotkeys } from 'react-hotkeys-hook';
import { KeyHint } from '../../../atoms/KeyHint/KeyHint';
import {
  SelectorsList,
  SelectorsListProps,
} from '../../SelectorsList/SelectorsList';

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

  useHotkeys(
    keyboardShortcuts?.elementPicker.toggleElementClicking ?? '',
    (event) => {
      event.stopPropagation();

      onEnableClickToggle(!enableClick);
    },
    [enableClick]
  );

  return (
    <Draggable
      bounds={{
        top: -250,
        bottom: window.innerHeight,
        left: -900,
        right: window.innerWidth / 2,
      }}
      defaultClassName="draggable"
      axis="both"
      handle=".element-picker-dialog"
    >
      <Dialog
        open={true}
        scroll="body"
        hideBackdrop
        className="element-picker-dialog"
        sx={{
          minWidth: '550px',
          pointerEvents: 'none',
        }}
      >
        <DialogTitle
          sx={{
            cursor: 'move',
            pointerEvents: 'all',
          }}
        >
          Element picker
        </DialogTitle>
        <DialogContent>
          <Stack
            direction="column"
            spacing={2}
            sx={{
              padding: (theme) => theme.spacing(2),
            }}
          >
            {input}
            <SelectorsList
              sx={{
                maxHeight: '40vh',
                overflow: 'auto',
              }}
              ignoredElementsContainer={ignoredElementsContainer}
              onDelete={onDelete}
              value={value}
            />
            <Stack direction="column">
              <FormControlLabel
                label={
                  <Stack alignItems="center" spacing={1} direction="row">
                    <span>Enable element clicking</span>
                    <KeyHint>
                      {keyboardShortcuts?.elementPicker.toggleElementClicking ??
                        ''}
                    </KeyHint>
                  </Stack>
                }
                className="enable-click-control"
                control={
                  <Switch
                    checked={enableClick}
                    onChange={(e) => {
                      e.stopPropagation();
                      onEnableClickToggle(e.target.checked);
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
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={onClose}>Close</CancelButton>
        </DialogActions>
      </Dialog>
    </Draggable>
  );
};

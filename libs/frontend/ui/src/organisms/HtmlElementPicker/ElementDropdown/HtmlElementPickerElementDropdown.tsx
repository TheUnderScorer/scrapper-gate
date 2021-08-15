import {
  Divider,
  Fab,
  IconButton,
  Paper,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Check,
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
} from '@material-ui/icons';
import {
  canBeNavigated,
  ElementNavigatorDirection,
  navigateElement,
} from '@scrapper-gate/frontend/common';
import { Perhaps } from '@scrapper-gate/shared/common';
import classNames from 'classnames';
import React, { forwardRef, useCallback, useMemo } from 'react';

export interface HtmlElementPickerElementDropdownProps {
  selectedElement?: Perhaps<HTMLElement>;
  selector?: Perhaps<string>;
  onSelect?: () => unknown;
  onSelectedElementChange?: (element: HTMLElement) => unknown;
}

const useStyles = makeStyles((theme) => ({
  popover: {
    marginTop: theme.spacing(3),
    pointerEvents: 'none',
    zIndex: theme.zIndex.modal + 20,
  },
  paper: {
    padding: theme.spacing(2),
    maxWidth: '500px',
    minWidth: '250px',
    pointerEvents: 'all',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}));

export const HtmlElementPickerElementDropdown = forwardRef<
  HTMLDivElement,
  HtmlElementPickerElementDropdownProps
>(({ selectedElement, selector, onSelect, onSelectedElementChange }, ref) => {
  const classes = useStyles();

  const canNavigate = useMemo(
    () => canBeNavigated(selectedElement),
    [selectedElement]
  );

  const navigate = useCallback(
    (direction: ElementNavigatorDirection) => () => {
      if (!selectedElement) {
        return;
      }

      const newElement = navigateElement(selectedElement, direction);

      if (newElement) {
        onSelectedElementChange?.(newElement as HTMLElement);
      }
    },
    [onSelectedElementChange, selectedElement]
  );

  return (
    <Popover
      keepMounted={false}
      hideBackdrop
      className={classNames(classes.popover, 'element-dropdown')}
      open={Boolean(selectedElement)}
      anchorEl={selectedElement}
    >
      <Paper ref={ref} className={classes.paper} elevation={1}>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          <Stack direction="row">
            <Typography color="primary" variant="body2">
              {selectedElement?.tagName?.toLowerCase()}
            </Typography>
            <Typography noWrap variant="body2">
              {selector}
            </Typography>
          </Stack>
          <Tooltip title="Select this element">
            <IconButton className="select-element" onClick={onSelect}>
              <Check />
            </IconButton>
          </Tooltip>
        </Stack>
        <Divider className={classes.divider} variant="fullWidth" />
        <Stack direction="row" spacing={1}>
          <Tooltip title="Select element parent">
            <span>
              <Fab
                className="navigate-parent"
                onClick={navigate(ElementNavigatorDirection.Parent)}
                disabled={!canNavigate.Parent}
                size="small"
              >
                <KeyboardArrowUp />
              </Fab>
            </span>
          </Tooltip>
          <Tooltip title="Select element child">
            <span>
              <Fab
                className="navigate-down"
                onClick={navigate(ElementNavigatorDirection.Children)}
                disabled={!canNavigate.Children}
                size="small"
              >
                <KeyboardArrowDown />
              </Fab>
            </span>
          </Tooltip>
          <Tooltip title="Select previous sibling">
            <span>
              <Fab
                className="navigate-left"
                onClick={navigate(ElementNavigatorDirection.Left)}
                disabled={!canNavigate.Left}
                size="small"
              >
                <KeyboardArrowLeft />
              </Fab>
            </span>
          </Tooltip>
          <Tooltip title="Select next sibling">
            <span>
              <Fab
                className="navigate-right"
                onClick={navigate(ElementNavigatorDirection.Right)}
                disabled={!canNavigate.Right}
                size="small"
              >
                <KeyboardArrowRight />
              </Fab>
            </span>
          </Tooltip>
        </Stack>
      </Paper>
    </Popover>
  );
});

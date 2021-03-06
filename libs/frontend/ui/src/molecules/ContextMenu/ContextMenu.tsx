import { ClickAwayListener, Menu, PopoverPosition } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { preventDefault } from '@scrapper-gate/frontend/common';
import { Perhaps } from '@scrapper-gate/shared/common';
import classNames from 'classnames';
import React, {
  forwardRef,
  MouseEventHandler,
  useCallback,
  useState,
} from 'react';
import { GenericMenuItem } from '../GenericMenuItem/GenericMenuItem';
import { ContextMenuProps } from './ContextMenu.types';

const useStyles = makeStyles({
  menu: {
    pointerEvents: 'none !important' as 'none',

    '& > .MuiPaper-root': {
      pointerEvents: 'all !important' as 'all',
    },
  },
});

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ children, menuItems, onOpen, onClose, ...menuProps }, ref) => {
    const classes = useStyles();

    const [mouseState, setMouseState] =
      useState<Perhaps<PopoverPosition>>(null);

    const handleContextMenu: MouseEventHandler = useCallback(
      (event) => {
        event.preventDefault();

        const position = {
          top: event.clientY - 4,
          left: event.clientX - 2,
        };
        setMouseState(position);

        onOpen?.({ position });
      },
      [onOpen]
    );

    const handleClose = useCallback(() => {
      const lastPos = { ...mouseState };

      setMouseState(null);

      onClose?.({ position: lastPos as PopoverPosition });
    }, [mouseState, onClose]);

    return (
      <>
        {children?.({ onContextMenu: handleContextMenu })}
        {menuItems && (
          <ClickAwayListener onClickAway={handleClose}>
            <Menu
              ref={ref}
              onContextMenu={preventDefault}
              className={classNames('context-menu', classes.menu)}
              hideBackdrop
              keepMounted={false}
              open={Boolean(mouseState)}
              onClose={handleClose}
              anchorReference="anchorPosition"
              anchorPosition={mouseState ?? undefined}
              {...menuProps}
            >
              {menuItems.map((item) => (
                <GenericMenuItem
                  key={item.id}
                  {...item}
                  onClick={(event) => {
                    item.onClick?.(event);

                    handleClose();
                  }}
                />
              ))}
            </Menu>
          </ClickAwayListener>
        )}
      </>
    );
  }
);

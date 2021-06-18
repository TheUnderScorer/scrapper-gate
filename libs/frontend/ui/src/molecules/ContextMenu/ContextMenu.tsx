import { Maybe } from '@scrapper-gate/shared/common';
import React, {
  forwardRef,
  MouseEventHandler,
  useCallback,
  useState,
} from 'react';
import { ClickAwayListener, Menu, PopoverPosition } from '@material-ui/core';
import { ContextMenuProps } from './ContextMenu.types';
import { GenericMenuItem } from '../GenericMenuItem/GenericMenuItem';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { preventDefault } from '@scrapper-gate/frontend/common';

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

    const [mouseState, setMouseState] = useState<Maybe<PopoverPosition>>(null);

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

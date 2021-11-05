import { ClickAwayListener, Menu, PopoverPosition } from '@mui/material';
import { preventDefault } from '@scrapper-gate/frontend/common';
import { Perhaps } from '@scrapper-gate/shared/common';
import React, {
  forwardRef,
  MouseEventHandler,
  useCallback,
  useState,
} from 'react';
import { GenericMenuItem } from '../GenericMenuItem/GenericMenuItem';
import { ContextMenuProps } from './ContextMenu.types';

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ children, menuItems, onOpen, onClose, ...menuProps }, ref) => {
    const [mouseState, setMouseState] =
      useState<Perhaps<PopoverPosition>>(null);

    const handleContextMenu: MouseEventHandler = useCallback(
      (event) => {
        if (!menuItems.length) {
          return;
        }

        event.preventDefault();

        const position = {
          top: event.clientY - 4,
          left: event.clientX - 2,
        };
        setMouseState(position);

        onOpen?.({ position });
      },
      [menuItems.length, onOpen]
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
              className="context-menu"
              sx={{
                pointerEvents: 'none !important' as 'none',

                '& > .MuiPaper-root': {
                  pointerEvents: 'all !important' as 'all',
                },
              }}
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

import React, { MouseEventHandler, useCallback, useRef, useState } from 'react';
import { Menu, PopoverPosition } from '@material-ui/core';
import { ContextMenuProps } from './ContextMenu.types';
import { GenericMenuItem } from '../GenericMenuItem/GenericMenuItem';
import { useClickAway } from 'react-use';
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

export const ContextMenu = ({
  children,
  menuItems,
  ...menuProps
}: ContextMenuProps) => {
  const classes = useStyles();

  const [mouseState, setMouseState] = useState<PopoverPosition | null>(null);

  const handleContextMenu: MouseEventHandler = useCallback((event) => {
    event.preventDefault();

    setMouseState({
      top: event.clientY - 4,
      left: event.clientX - 2,
    });
  }, []);

  const handleClose = useCallback(() => {
    setMouseState(null);
  }, []);

  const menuRef = useRef<HTMLDivElement>();

  useClickAway(menuRef, handleClose);

  console.log({ menuRef });

  return (
    <>
      {children({ onContextMenu: handleContextMenu })}
      {menuItems && (
        <Menu
          onContextMenu={preventDefault}
          className={classNames('context-menu', classes.menu)}
          ref={(el) => {
            menuRef.current = el?.querySelector('.MuiPaper-root');
          }}
          hideBackdrop
          keepMounted
          open={Boolean(mouseState)}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={mouseState}
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
      )}
    </>
  );
};

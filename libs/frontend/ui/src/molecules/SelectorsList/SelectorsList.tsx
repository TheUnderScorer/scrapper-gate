import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Tooltip,
} from '@material-ui/core';
import { Remove } from '@material-ui/icons';
import { getSelectorWithElementsAggregate } from '@scrapper-gate/shared/common';
import { Selector } from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import React, { useMemo } from 'react';

export interface SelectorsListProps {
  value: Selector[];
  onDelete?: (index: number) => unknown;
  hideHeader?: boolean;
  className?: string;
  ignoredElementsContainer?: HTMLElement;
}

export const SelectorsList = ({
  value,
  hideHeader = false,
  onDelete,
  className,
  ignoredElementsContainer,
}: SelectorsListProps) => {
  const selectorsAggr = useMemo(() => {
    if (!value.length) {
      return [];
    }

    try {
      return getSelectorWithElementsAggregate(
        value,
        document,
        ignoredElementsContainer
      );
    } catch {
      return [];
    }
  }, [value, ignoredElementsContainer]);

  const totalSelectors = useMemo(() => {
    if (hideHeader) {
      return 0;
    }

    return selectorsAggr
      .map((aggregate) => aggregate.elements.length)
      .reduce((acc, value) => acc + value, 0);
  }, [hideHeader, selectorsAggr]);

  if (!value.length) {
    return null;
  }

  return (
    <List
      className={classNames('selectors-list', className)}
      subheader={
        hideHeader ? undefined : (
          <ListSubheader disableSticky disableGutters>
            Selected elements ({totalSelectors})
          </ListSubheader>
        )
      }
    >
      {selectorsAggr.map((selector, index) => (
        <ListItem
          className="selector-list-item"
          disableGutters
          key={selector.value}
        >
          <ListItemText
            primary={`${selector.value} (${selector.elements.length})`}
          />
          <ListItemSecondaryAction>
            <Tooltip title="Remove selector">
              <IconButton
                onClick={() => {
                  if (onDelete) {
                    onDelete(index);
                  }
                }}
              >
                <Remove />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

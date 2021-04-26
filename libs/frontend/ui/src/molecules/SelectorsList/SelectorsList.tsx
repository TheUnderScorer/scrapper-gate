import React, { FC, useMemo } from 'react';
import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';
import { Remove } from '@material-ui/icons';
import classNames from 'classnames';
import { Selector } from '@scrapper-gate/shared/schema';
import { getSelectorWithElementsAggregate } from '@scrapper-gate/shared/common';

export interface SelectorsListProps {
  value: Selector[];
  onDelete?: (index: number) => unknown;
  hideHeader?: boolean;
  className?: string;
}

export const SelectorsList: FC<SelectorsListProps> = ({
  value,
  hideHeader = false,
  onDelete,
  className,
}) => {
  const selectorsAggr = useMemo(() => {
    if (!value.length) {
      return [];
    }

    try {
      return getSelectorWithElementsAggregate(value, document);
    } catch {
      return [];
    }
  }, [value]);

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
            <IconButton
              onClick={() => {
                if (onDelete) {
                  onDelete(index);
                }
              }}
            >
              <Remove />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

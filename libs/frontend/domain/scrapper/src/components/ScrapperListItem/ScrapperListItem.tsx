import React from 'react';
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { Dropdown } from '@scrapper-gate/frontend/ui';
import { Delete } from '@material-ui/icons';
import { ScrapperListItemProps } from './ScrapperListItem.types';

export const ScrapperListItem = ({
  scrapper,
  onClick,
  ...props
}: ScrapperListItemProps) => {
  return (
    <ListItem
      className="scrapper-list-item"
      button
      onClick={() => onClick?.(scrapper)}
      {...props}
    >
      <ListItemText>{scrapper.name}</ListItemText>
      <ListItemSecondaryAction>
        <Dropdown
          items={[
            {
              id: 'delete_scrapper',
              icon: <Delete />,
              content: 'Delete scrapper',
            },
          ]}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

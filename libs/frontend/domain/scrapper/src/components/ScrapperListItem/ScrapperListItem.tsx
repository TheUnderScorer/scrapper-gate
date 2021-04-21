import React from 'react';
import { ScrapperListItemProps } from '@scrapper-gate/frontend/domain/scrapper';
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { Dropdown } from '@scrapper-gate/frontend/ui';
import { Delete } from '@material-ui/icons';

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

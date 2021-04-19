import React from 'react';
import { ScrapperListItemProps } from '@scrapper-gate/frontend/domain/scrapper';
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { Dropdown } from '../../../../../ui/src/molecules/Dropdown/Dropdown';
import { Delete } from '@material-ui/icons';

export const ScrapperListItem = ({ scrapper }: ScrapperListItemProps) => {
  return (
    <ListItem button>
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

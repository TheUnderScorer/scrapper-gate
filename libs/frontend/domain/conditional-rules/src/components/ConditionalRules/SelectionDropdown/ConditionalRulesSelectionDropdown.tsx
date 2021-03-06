import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { MenuItemProperties } from '@scrapper-gate/frontend/common';
import { Centered, Dropdown } from '@scrapper-gate/frontend/ui';
import { ConditionalRule } from '@scrapper-gate/shared/schema';
import React, { useMemo } from 'react';
import { ConditionalRulesSelection } from '../../../types';

export interface ConditionalRulesSelectionDropdownProps {
  onAdd: (rule: Omit<ConditionalRule, 'id'>) => unknown;
  definitions: ConditionalRulesSelection[];
}

const useStyles = makeStyles((theme) => ({
  btn: {
    '&, &:hover': {
      borderColor: theme.palette.grey.A400,
    },
    padding: theme.spacing(1),
    color: theme.palette.common.black,
  },
  menuItem: {
    minWidth: '200px',
  },
}));

export const ConditionalRulesSelectionDropdown = ({
  onAdd,
  definitions,
}: ConditionalRulesSelectionDropdownProps) => {
  const classes = useStyles();

  const items = useMemo<MenuItemProperties[]>(
    () => [
      {
        type: 'subHeader',
        content: 'Select rule:',
        id: 'rule_subheader',
      },
      ...definitions.map((definition) => ({
        id: definition.value.type,
        content: definition.label,
        icon: definition.icon,
        className: classes.menuItem,
        onClick: () =>
          onAdd({
            type: definition.value.type,
            when: definition.value.defaultWhen,
          }),
      })),
    ],
    [classes, definitions, onAdd]
  );

  return (
    <Dropdown
      items={items}
      activator={({ onClick }) => (
        <Centered>
          <Button startIcon={<Add />} onClick={onClick} variant="outlined">
            Add rule
          </Button>
        </Centered>
      )}
    />
  );
};

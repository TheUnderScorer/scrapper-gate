import React from 'react';
import { ConditionalRule } from '@scrapper-gate/shared/schema';
import { Button, makeStyles } from '@material-ui/core';
import { Centered, Dropdown } from '@scrapper-gate/frontend/ui';
import { ConditionalRulesSelection } from '@scrapper-gate/frontend/domain/conditional-rules';
import { Add } from '@material-ui/icons';

export interface ConditionalRulesSelectionDropdownProps {
  onAdd: (rule: ConditionalRule) => unknown;
  definitions: ConditionalRulesSelection[];
}

const useStyles = makeStyles((theme) => ({
  btn: {
    '&, &:hover': {
      borderColor: theme.palette.grey.A400,
    },
    padding: theme.spacing(1),
    color: theme.palette.grey.A400,
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

  return (
    <Dropdown
      items={definitions.map((definition) => ({
        id: definition.value.type,
        content: definition.label,
        icon: definition.icon,
        className: classes.menuItem,
        onClick: () =>
          onAdd({
            type: definition.value.type,
          }),
      }))}
      activator={({ onClick }) => (
        <Centered>
          <Button
            startIcon={<Add />}
            onClick={onClick}
            className={classes.btn}
            variant="outlined"
          >
            Add rule
          </Button>
        </Centered>
      )}
    />
  );
};

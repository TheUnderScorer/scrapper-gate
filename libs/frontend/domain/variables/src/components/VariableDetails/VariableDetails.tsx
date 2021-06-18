import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
} from '@material-ui/core';
import { getDisplayValue } from '@scrapper-gate/shared/common';
import { Variable } from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import React from 'react';
import { VariableIcon } from '../VariableIcon/VariableIcon';

export interface VariableDetailsProps {
  variable: Variable;
  className?: string;
  hideTitle?: boolean;
}

export const VariableDetails = ({
  variable,
  className,
  hideTitle,
}: VariableDetailsProps) => {
  return (
    <List
      disablePadding
      dense
      className={classNames(className, 'variable-details')}
      subheader={
        hideTitle ? undefined : (
          <ListSubheader disableGutters>
            <Stack spacing={1} direction="row" alignItems="center">
              <VariableIcon scope={variable.scope} />
              <span>{variable.key}</span>
            </Stack>
          </ListSubheader>
        )
      }
    >
      <ListItem disableGutters>
        <ListItemText
          primary="Default value"
          secondary={getDisplayValue({ value: variable.defaultValue }) ?? '-'}
        />
      </ListItem>
      <ListItem disableGutters>
        <ListItemText
          primary="Current value"
          secondary={
            getDisplayValue({
              value: variable.value,
            }) ?? '-'
          }
        />
      </ListItem>
    </List>
  );
};

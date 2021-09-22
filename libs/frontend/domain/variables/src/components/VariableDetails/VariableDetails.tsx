import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
} from '@mui/material';
import { ThemedSxProps } from '@scrapper-gate/frontend/theme';
import { getDisplayValue } from '@scrapper-gate/shared/common';
import { Variable, VariableType } from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import React from 'react';
import { VariableIcon } from '../VariableIcon/VariableIcon';

export interface VariableDetailsProps extends ThemedSxProps {
  variable: Variable;
  className?: string;
  hideTitle?: boolean;
}

export const VariableDetails = ({
  variable,
  className,
  hideTitle,
  sx,
}: VariableDetailsProps) => {
  const isDate = variable.type === VariableType.Date;

  return (
    <List
      disablePadding
      dense
      className={classNames(className, 'variable-details')}
      sx={sx}
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
          secondary={
            getDisplayValue({ value: variable.defaultValue, isDate }) ?? '-'
          }
        />
      </ListItem>
      <ListItem disableGutters>
        <ListItemText
          primary="Current value"
          secondary={
            getDisplayValue({
              value: variable.value,
              isDate,
            }) ?? '-'
          }
        />
      </ListItem>
    </List>
  );
};

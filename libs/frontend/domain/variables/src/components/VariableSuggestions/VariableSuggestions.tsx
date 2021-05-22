import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  useTheme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AttachMoney } from '@material-ui/icons';
import { createFilterOptions } from '@material-ui/lab';
import { AppTheme } from '@scrapper-gate/frontend/theme';
import { Highlight } from '@scrapper-gate/frontend/ui';
import { getLastIndex } from '@scrapper-gate/shared/common';
import { Variable } from '@scrapper-gate/shared/schema';
import React, { useCallback, useMemo, useState } from 'react';
import { useKey } from 'react-use';
import { Key } from 'ts-key-enum';
import { useVariablesContextSelector } from '../../providers/VariablesProvider';

export interface VariableSuggestionsProps {
  text: string;
  onVariableClick?: (variable: Variable) => unknown;
}

const useStyles = makeStyles((theme) => ({
  icon: {
    minWidth: '35px',
  },
  item: {
    cursor: 'pointer',
  },
}));

export const VariableSuggestions = ({
  text,
  onVariableClick,
}: VariableSuggestionsProps) => {
  const classes = useStyles();
  const variables = useVariablesContextSelector((ctx) => ctx.variables);

  const theme = useTheme() as AppTheme;

  const rawText = useMemo(() => text.replace(/{/g, '').replace(/}/g, ''), [
    text,
  ]);

  const filteredVariables = useMemo(() => {
    if (!rawText) {
      return variables;
    }

    return createFilterOptions<Variable>({
      matchFrom: 'any',
      stringify: (option) => option.key,
    })(variables, {
      inputValue: rawText,
      getOptionLabel: (option) => option.key,
    });
  }, [rawText, variables]);

  const [selectedVariable, setSelectedVariable] = useState(
    filteredVariables[0]?.id ?? ''
  );

  // TODO Make this more generic
  const handleNavigation = useCallback(
    (direction: 'top' | 'bottom') => {
      const index = filteredVariables.findIndex(
        (variable) => variable.id === selectedVariable
      );
      const lastIndex = getLastIndex(variables);

      let newIndex = direction === 'top' ? index - 1 : index + 1;

      if (newIndex === -1) {
        newIndex = lastIndex;
      } else if (newIndex > lastIndex) {
        newIndex = 0;
      }

      const newVariable = variables[newIndex];

      setSelectedVariable(newVariable.id);
    },
    [filteredVariables, selectedVariable, variables]
  );

  useKey(
    Key.Enter,
    () => {
      const variable = filteredVariables.find(
        (variable) => variable.id === selectedVariable
      );

      if (variable) {
        onVariableClick?.(variable);
      }
    },
    {},
    [filteredVariables, selectedVariable, onVariableClick]
  );

  useKey(
    Key.ArrowUp,
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      handleNavigation('top');
    },
    {},
    [handleNavigation]
  );
  useKey(
    Key.ArrowDown,
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      handleNavigation('bottom');
    },
    {},
    [handleNavigation]
  );

  return (
    <List
      dense
      subheader={
        filteredVariables.length ? (
          <ListSubheader component="li">Variables</ListSubheader>
        ) : undefined
      }
    >
      {!filteredVariables.length && (
        <ListItem component="li" disableGutters>
          <ListItemText primary={`No variables found ${theme.emojis.empty}`} />
        </ListItem>
      )}

      {filteredVariables.map((variable) => (
        <ListItem
          onMouseDown={(event) => {
            event.preventDefault();

            onVariableClick?.(variable);
          }}
          className={classes.item}
          role="button"
          selected={selectedVariable === variable.id}
          onMouseOver={() => setSelectedVariable(variable.id)}
          tabIndex={0}
          component="li"
          key={variable.id}
        >
          <ListItemIcon className={classes.icon}>
            <AttachMoney />
          </ListItemIcon>
          <ListItemText
            primary={<Highlight text={variable.key} value={rawText} />}
          />
        </ListItem>
      ))}
    </List>
  );
};

import { AttachMoney } from '@mui/icons-material';
import {
  createFilterOptions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useListNavigation } from '@scrapper-gate/frontend/common';
import { AppTheme } from '@scrapper-gate/frontend/theme';
import { Emoji, Highlight } from '@scrapper-gate/frontend/ui';
import { Variable } from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import React, { MouseEvent, useMemo } from 'react';
import { useVariablesContextSelector } from '../../providers/VariablesProvider';
import { VariableDetails } from '../VariableDetails/VariableDetails';

const PREFIX = 'VariableSuggestions';

const classes = {
  icon: `${PREFIX}-icon`,
  item: `${PREFIX}-item`,
  stack: `${PREFIX}-stack`,
  stackItem: `${PREFIX}-stackItem`,
  divider: `${PREFIX}-divider`,
};

const StyledStack = styled(Stack)(({ theme }) => ({
  [`& .${classes.icon}`]: {
    minWidth: '35px',
  },

  [`& .${classes.item}`]: {
    cursor: 'pointer',
  },

  [`&.${classes.stack}`]: {
    minWidth: '400px',
  },

  [`& .${classes.stackItem}`]: {
    width: '49%',
  },

  [`& .${classes.divider}`]: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

export interface VariableSuggestionsProps {
  text: string;
  onVariableClick?: (variable: Variable) => unknown;
}

const filter = createFilterOptions<Variable>({
  matchFrom: 'any',
  stringify: (option) => option.key ?? option.id,
});

export const VariableSuggestions = ({
  text,
  onVariableClick,
}: VariableSuggestionsProps) => {
  const variables = useVariablesContextSelector((ctx) => ctx.filteredVariables);

  const theme = useTheme() as AppTheme;

  const rawText = useMemo(
    () => text.replace(/{/g, '').replace(/}/g, ''),
    [text]
  );

  const filteredVariables = useMemo(() => {
    if (!rawText) {
      return variables;
    }

    return filter(variables, {
      inputValue: rawText,
      getOptionLabel: (option) => option.key ?? option.id,
    });
  }, [rawText, variables]);

  const { activeItem: selectedVariable, setActiveItem: setSelectedVariable } =
    useListNavigation({
      items: filteredVariables,
      onEnter: onVariableClick,
    });

  return (
    <StyledStack
      className={classNames(classes.stack, 'variable-suggestions-container')}
      spacing={0}
      direction="row"
    >
      <List
        className={classes.stackItem}
        dense
        subheader={
          filteredVariables.length ? (
            <ListSubheader disableSticky component="li">
              Variables
            </ListSubheader>
          ) : undefined
        }
      >
        {!filteredVariables.length && (
          <ListItem component="li" disableGutters>
            <ListItemText
              primary={
                <>
                  No variables found <Emoji>{theme.emojis.empty}</Emoji>
                </>
              }
            />
          </ListItem>
        )}

        {filteredVariables.map((variable) => (
          <ListItem
            onMouseDown={(event: MouseEvent) => {
              event.preventDefault();

              onVariableClick?.(variable);
            }}
            className={classNames(classes.item, 'variable-list-item')}
            role="button"
            selected={selectedVariable?.id === variable.id}
            onMouseOver={() => setSelectedVariable(variable)}
            tabIndex={0}
            component="li"
            key={variable.id}
          >
            <ListItemIcon className={classes.icon}>
              <AttachMoney />
            </ListItemIcon>
            <ListItemText
              primary={<Highlight text={variable.key ?? ''} value={rawText} />}
            />
          </ListItem>
        ))}
      </List>
      {selectedVariable && (
        <>
          <Divider
            className={classes.divider}
            orientation="vertical"
            flexItem
          />
          <VariableDetails
            className={classes.stackItem}
            variable={selectedVariable}
          />
        </>
      )}
    </StyledStack>
  );
};

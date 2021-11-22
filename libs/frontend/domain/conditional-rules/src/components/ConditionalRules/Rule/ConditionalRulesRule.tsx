import { Delete } from '@mui/icons-material';
import {
  Divider,
  IconButton,
  Paper,
  Stack,
  TextFieldProps,
  Tooltip,
} from '@mui/material';
import { BaseEntity } from '@scrapper-gate/shared/schema';
import React, { memo, useMemo } from 'react';
import { FrontendConditionalRuleDefinition } from '../../../types';

export interface ConditionalRulesRuleProps {
  fieldVariant?: TextFieldProps['variant'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: Pick<BaseEntity, 'id'> & any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  definitions: FrontendConditionalRuleDefinition<any>[];
  onRowRemove?: () => unknown;
  name: string;
  onEdit?: (rowId: string) => void;
  hasError?: boolean;
}

const BaseConditionalRulesRule = ({
  definitions,
  onRowRemove,
  value,
  fieldVariant,
  name,
  hasError,
}: ConditionalRulesRuleProps) => {
  const definition = useMemo(() => {
    return definitions.find((def) => def.definition.type === value.ruleType);
  }, [definitions, value.ruleType]);

  const Component = definition?.Component;
  const FooterComponent = definition?.FooterComponent;

  return (
    <Paper
      sx={{ width: '100%', padding: (theme) => theme.spacing(2) }}
      className="conditional-rules-rule"
      elevation={2}
    >
      <Stack direction="column" spacing={4}>
        <Stack
          sx={{ width: '100%' }}
          direction="row"
          alignItems="center"
          spacing={2}
        >
          {definition?.icon}
          {Component && definition && (
            <Component
              fieldVariant={fieldVariant}
              definition={definition.definition}
              spacing={2}
              getName={(path = '') => name + path}
            />
          )}
          <Tooltip title="Remove rule">
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();

                onRowRemove?.();
              }}
              className="remove-rules-rule"
              sx={{
                '&.remove-rules-rule': {
                  marginLeft: 'auto',
                },

                '&, & svg': {
                  color: (theme) => theme.palette.error.main,
                },
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>
        {FooterComponent && definition && (
          <>
            <Divider variant="middle" />
            <FooterComponent
              fieldVariant={fieldVariant}
              definition={definition.definition}
              spacing={2}
              getName={(path = '') => name + path}
            />
          </>
        )}
      </Stack>
    </Paper>
  );
};

export const ConditionalRulesRule = memo(BaseConditionalRulesRule);

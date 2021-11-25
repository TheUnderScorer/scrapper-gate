import { Add } from '@mui/icons-material';
import {
  Box,
  Divider,
  Fab,
  FormHelperText,
  FormLabel,
  Stack,
  Typography,
} from '@mui/material';
import {
  FieldProps,
  useFieldArray,
  useFieldError,
} from '@scrapper-gate/frontend/form';
import { Centered } from '@scrapper-gate/frontend/ui';
import {
  ConditionalRuleGroup,
  ConditionalRuleGroupMatchType,
} from '@scrapper-gate/shared/schema';
import React, { useCallback, useState } from 'react';
import { FrontendConditionalRuleDefinition } from '../../types';
import {
  ConditionalRulesGroup,
  ConditionalRulesGroupProps,
} from './Group/ConditionalRulesGroup';

export interface ConditionalRulesProps
  extends FieldProps<ConditionalRuleGroup[]>,
    Pick<ConditionalRulesGroupProps, 'fieldVariant'> {
  definitions: FrontendConditionalRuleDefinition[];
  name: string;
  helperText?: string;
  label?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultValue: any[] = [];

export const ConditionalRules = ({
  definitions,
  name,
  label,
  fieldVariant = 'standard',
  helperText,
  ...rest
}: ConditionalRulesProps) => {
  const [activeRole, setActiveRole] = useState<string | undefined>();
  const [activeGroupId, setActiveGroupId] = useState<string | undefined>();

  const { input, meta, append, remove } = useFieldArray<ConditionalRuleGroup>(
    name,
    {
      ...rest,
      initialValue: rest.initialValue ?? defaultValue,
    }
  );
  const error = useFieldError({
    meta,
    showErrorOnlyOnTouched: rest.showErrorOnlyOnTouched,
  });

  const { value } = input;

  const getFieldName = useCallback((path: string) => name + path, [name]);

  const handleAddRulesSection = useCallback(() => {
    const result = append({
      matchType: ConditionalRuleGroupMatchType.Any,
      rules: [],
    });

    setActiveGroupId(result.id as string);
  }, [append]);

  const hasError = Boolean(error);

  return (
    <Box>
      {label && <FormLabel error={hasError}>{label}</FormLabel>}
      {helperText && (
        <FormHelperText error={hasError}>{helperText}</FormHelperText>
      )}
      <Box>
        {value.map((group, index) => {
          const hasNext = Boolean(value[index + 1]);

          return (
            <Stack direction="column" key={group.id}>
              <ConditionalRulesGroup
                open={group.id === activeGroupId}
                onClose={() => setActiveGroupId(undefined)}
                onOpen={() => setActiveGroupId(group.id)}
                activeRowId={activeRole}
                onEdit={setActiveRole}
                onRemove={remove}
                name={getFieldName(`[${index}]`)}
                fieldVariant={fieldVariant}
                index={index}
                definitions={definitions}
              />
              {hasNext && (
                <Box display="flex" justifyContent="center" position="relative">
                  <Divider
                    sx={{
                      alignSelf: 'center',
                      margin: (theme) => `${theme.spacing(1)} 0`,
                      height: '40px',
                    }}
                    orientation="vertical"
                    flexItem
                  />
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: '19px',
                      background: (theme) => theme.palette.background.paper,
                    }}
                    variant="caption"
                  >
                    OR
                  </Typography>
                </Box>
              )}
            </Stack>
          );
        })}
      </Box>
      <Centered
        sx={{
          marginTop: (theme) => theme.spacing(4),
        }}
      >
        <Fab
          className="add-rules-group"
          color="secondary"
          size="small"
          variant="extended"
          onClick={handleAddRulesSection}
          sx={{
            boxShadow: 'none',
          }}
        >
          <Add />
          Add rules group
        </Fab>
      </Centered>
      {hasError && <FormHelperText error>{error?.message}</FormHelperText>}
    </Box>
  );
};

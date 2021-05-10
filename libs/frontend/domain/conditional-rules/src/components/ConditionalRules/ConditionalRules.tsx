import React, { useCallback, useState } from 'react';
import {
  ConditionalRuleGroupInput,
  ConditionalRuleGroupType,
} from '@scrapper-gate/shared/schema';
import {
  FieldProps,
  useFieldArray,
  useFieldHasError,
} from '@scrapper-gate/frontend/form';
import { Box, Fab, FormHelperText, FormLabel } from '@material-ui/core';
import {
  ConditionalRulesGroup,
  ConditionalRulesGroupProps,
} from './Group/ConditionalRulesGroup';
import { Centered } from '@scrapper-gate/frontend/ui';
import { makeStyles } from '@material-ui/core/styles';
import { ConditionalRulesSelection } from '../../types';
import { Add } from '@material-ui/icons';

export interface ConditionalRulesProps
  extends FieldProps<ConditionalRuleGroupInput[]>,
    Pick<ConditionalRulesGroupProps, 'fieldVariant'> {
  definitions: ConditionalRulesSelection[];
  name: string;
  helperText?: string;
  label?: string;
}

const useStyles = makeStyles((theme) => ({
  btn: {
    marginTop: theme.spacing(4),
  },
  fab: {
    boxShadow: 'none',
  },
}));

const defaultValue = [];

export const ConditionalRules = ({
  definitions,
  name,

  label,
  fieldVariant,
  helperText,
  ...rest
}: ConditionalRulesProps) => {
  const classes = useStyles();

  const [activeRole, setActiveRole] = useState<string | undefined>();
  const [activeGroupId, setActiveGroupId] = useState<string | undefined>();

  const {
    input,
    meta,
    append,
    remove,
  } = useFieldArray<ConditionalRuleGroupInput>(name, {
    ...rest,
    initialValue: rest.initialValue ?? defaultValue,
  });
  const hasError = useFieldHasError({
    meta,
    showErrorOnlyOnTouched: rest.showErrorOnlyOnTouched,
  });

  const { value } = input;

  const getFieldName = useCallback((path: string) => name + path, [name]);

  const handleAddRulesSection = useCallback(() => {
    const result = append({
      type: ConditionalRuleGroupType.Any,
      rules: [],
    });

    setActiveGroupId(result.id as string);
  }, [append]);

  return (
    <Box>
      {label && <FormLabel error={hasError}>{label}</FormLabel>}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <Box mt={2}>
        {value.map((group, index) => (
          <ConditionalRulesGroup
            open={group.id === activeGroupId}
            onClose={() => setActiveGroupId(undefined)}
            onOpen={() => setActiveGroupId(group.id)}
            activeRowId={activeRole}
            onEdit={setActiveRole}
            onEditClose={() => setActiveRole(undefined)}
            onRemove={remove}
            name={getFieldName(`[${index}]`)}
            key={group.id}
            fieldVariant={fieldVariant}
            index={index}
            definitions={definitions}
          />
        ))}
      </Box>
      <Centered className={classes.btn}>
        <Fab
          className={classes.fab}
          color="primary"
          size="small"
          variant="extended"
          onClick={handleAddRulesSection}
        >
          <Add />
          Add rules group
        </Fab>
      </Centered>
      {hasError && (
        <FormHelperText error={hasError}>{meta.error.message}</FormHelperText>
      )}
    </Box>
  );
};

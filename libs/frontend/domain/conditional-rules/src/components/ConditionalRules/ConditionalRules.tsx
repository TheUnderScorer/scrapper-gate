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
import {
  Box,
  Divider,
  Fab,
  FormHelperText,
  FormLabel,
  Stack,
  Typography,
} from '@material-ui/core';
import {
  ConditionalRulesGroup,
  ConditionalRulesGroupProps,
} from './Group/ConditionalRulesGroup';
import { Centered } from '@scrapper-gate/frontend/ui';
import { makeStyles } from '@material-ui/core/styles';
import { ConditionalRulesSelection } from '../../types';
import { Add } from '@material-ui/icons';
import classNames from 'classnames';

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
  divider: {
    alignSelf: 'center',
    margin: `${theme.spacing(1)} 0`,
    height: '40px',
  },
  dividerText: {
    position: 'absolute',
    top: '19px',
    background: theme.palette.background.paper,
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
                onEditClose={() => setActiveRole(undefined)}
                onRemove={remove}
                name={getFieldName(`[${index}]`)}
                fieldVariant={fieldVariant}
                index={index}
                definitions={definitions}
              />
              {hasNext && (
                <Box display="flex" justifyContent="center" position="relative">
                  <Divider
                    className={classes.divider}
                    orientation="vertical"
                    flexItem
                  />
                  <Typography className={classes.dividerText} variant="caption">
                    OR
                  </Typography>
                </Box>
              )}
            </Stack>
          );
        })}
      </Box>
      <Centered className={classes.btn}>
        <Fab
          className={classNames(classes.fab, 'add-rules-group')}
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

import React, { memo } from 'react';
import {
  ConditionalRule,
  ConditionalRuleGroupType,
} from '@scrapper-gate/shared/schema';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from '@material-ui/core';
import { Delete, ExpandMore } from '@material-ui/icons';
import {
  ConditionalRulesRule,
  ConditionalRulesRuleProps,
} from '../Rule/ConditionalRulesRule';
import { FormSelect, useFieldArray } from '@scrapper-gate/frontend/form';
import { makeStyles } from '@material-ui/core/styles';
import { ConditionalRulesSelectionDropdown } from '../SelectionDropdown/ConditionalRulesSelectionDropdown';

export interface ConditionalRulesGroupProps
  extends Pick<
    ConditionalRulesRuleProps,
    'fieldVariant' | 'definitions' | 'onEdit' | 'onEditClose'
  > {
  index: number;
  name: string;
  onRemove?: (index: number) => unknown;
  activeRowId?: string;
  open?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

const useStyles = makeStyles((theme) => ({
  btn: {
    '&, & svg': {
      color: theme.palette.error.main,
    },
  },
  btnContainer: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: `${theme.spacing(4)} 0`,
  },
  typeSection: {
    marginBottom: theme.spacing(2),
  },
  summaryStack: {
    width: '100%',
    paddingRight: theme.spacing(2),
  },
}));

const BaseConditionalRulesGroup = ({
  definitions,
  index,
  fieldVariant,
  name,
  onRemove,
  activeRowId,
  open,
  onOpen,
  onClose,
  ...rest
}: ConditionalRulesGroupProps) => {
  const classes = useStyles();

  const {
    append,
    remove,
    input: { value: rules },
  } = useFieldArray<ConditionalRule>(`${name}.rules`);

  return (
    <Accordion
      expanded={open}
      onChange={(event, expanded) => (expanded ? onOpen?.() : onClose?.())}
      variant="outlined"
      key={index}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack
          className={classes.summaryStack}
          direction="row"
          justifyContent="space-between"
        >
          <Typography>Group {index + 1}</Typography>
          <IconButton
            size="small"
            onClick={() => onRemove(index)}
            className={classes.btn}
          >
            <Delete />
          </IconButton>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack
          className={classes.typeSection}
          spacing={1}
          alignItems="center"
          direction="row"
        >
          <FormSelect name={`${name}.type`}>
            <MenuItem value={ConditionalRuleGroupType.Any}>
              At least one
            </MenuItem>
            <MenuItem value={ConditionalRuleGroupType.All}>All</MenuItem>
          </FormSelect>
          <Typography>of the rules must be true.</Typography>
        </Stack>
        <Stack alignItems="center" spacing={2}>
          {rules.map((rule, rowIndex) => (
            <ConditionalRulesRule
              isEdit={activeRowId === rule.id}
              name={`${name}.rules[${rowIndex}]`}
              key={rule.id}
              value={rule}
              definitions={definitions}
              fieldVariant={fieldVariant}
              onRowRemove={() => remove(rowIndex)}
              {...rest}
            />
          ))}
          <ConditionalRulesSelectionDropdown
            onAdd={(rule) => {
              const result = append(rule);

              rest.onEdit?.(result.id as string);
            }}
            definitions={definitions}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export const ConditionalRulesGroup = memo(BaseConditionalRulesGroup);

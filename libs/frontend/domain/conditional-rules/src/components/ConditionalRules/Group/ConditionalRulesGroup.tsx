import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Delete, ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import {
  FormSelect,
  useFieldArray,
  useFieldHasError,
} from '@scrapper-gate/frontend/form';
import { AppTheme } from '@scrapper-gate/frontend/theme';
import { Centered, Emoji } from '@scrapper-gate/frontend/ui';
import {
  ConditionalRule,
  ConditionalRuleGroupType,
} from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import React, { memo } from 'react';
import {
  ConditionalRulesRule,
  ConditionalRulesRuleProps,
} from '../Rule/ConditionalRulesRule';
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
  accordion: {
    '&.hasError': {
      borderColor: theme.palette.error.main,
    },
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

  const theme = useTheme() as AppTheme;

  const {
    append,
    remove,
    input: { value: rules },
    meta,
  } = useFieldArray<ConditionalRule>(`${name}.rules`);

  const hasError = useFieldHasError({
    meta,
    showErrorOnlyOnTouched: false,
  });

  return (
    <Accordion
      className={classNames(
        'conditional-rules-group',
        { hasError },
        classes.accordion
      )}
      expanded={open}
      onChange={(event, expanded) => (expanded ? onOpen?.() : onClose?.())}
      variant="outlined"
      key={index}
    >
      <AccordionSummary
        expandIcon={
          <IconButton size="small">
            <ExpandMore />
          </IconButton>
        }
      >
        <Stack
          className={classes.summaryStack}
          direction="row"
          justifyContent="space-between"
        >
          <Typography>Group {index + 1}</Typography>
          <Tooltip title="Remove group">
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();

                onRemove?.(index);
              }}
              className={classNames(classes.btn, 'remove-rules-group')}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack
          className={classes.typeSection}
          spacing={1}
          alignItems="center"
          direction="row"
        >
          <FormSelect size="small" variant={fieldVariant} name={`${name}.type`}>
            <MenuItem value={ConditionalRuleGroupType.Any}>
              At least one
            </MenuItem>
            <MenuItem value={ConditionalRuleGroupType.All}>All</MenuItem>
          </FormSelect>
          <Typography>of the rules must be true.</Typography>
        </Stack>
        <Stack alignItems="center" spacing={2}>
          {!rules.length && (
            <Centered>
              <Typography variant="body2">
                No rules for this group <Emoji>{theme.emojis.empty}</Emoji>
              </Typography>
            </Centered>
          )}
          {rules.map((rule, rowIndex) => (
            <ConditionalRulesRule
              hasError={Boolean(meta.error?.[rowIndex])}
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

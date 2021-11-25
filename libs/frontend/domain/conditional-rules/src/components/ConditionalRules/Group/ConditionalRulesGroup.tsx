import { ExpandMore } from '@mui/icons-material';
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
} from '@mui/material';
import {
  FormSelect,
  useFieldArray,
  useFieldError,
} from '@scrapper-gate/frontend/form';
import { AppTheme } from '@scrapper-gate/frontend/theme';
import { Centered, Emoji } from '@scrapper-gate/frontend/ui';
import { ConditionalRule } from '@scrapper-gate/shared/domain/conditional-rules';
import { ConditionalRuleGroupMatchType } from '@scrapper-gate/shared/schema';
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
    'fieldVariant' | 'definitions' | 'onEdit'
  > {
  index: number;
  name: string;
  onRemove?: (index: number) => unknown;
  activeRowId?: string;
  open?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

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
  const theme = useTheme() as AppTheme;

  const {
    append,
    remove,
    input: { value: rules },
    meta,
  } = useFieldArray<ConditionalRule>(`${name}.rules`);

  const error = useFieldError({
    meta,
    showErrorOnlyOnTouched: false,
  });

  return (
    <Accordion
      className={classNames('conditional-rules-group', {
        hasError: Boolean(error),
      })}
      expanded={open}
      onChange={(event, expanded) => (expanded ? onOpen?.() : onClose?.())}
      variant="outlined"
      key={index}
      sx={{
        '&.hasError': {
          borderColor: (theme) => theme.palette.error.main,
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <IconButton size="small">
            <ExpandMore />
          </IconButton>
        }
      >
        <Stack
          sx={{
            width: '100%',
            paddingRight: (theme) => theme.spacing(2),
          }}
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
              className="remove-rules-group"
              color="error"
            >
              {theme.icons.remove}
            </IconButton>
          </Tooltip>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack
          sx={{
            marginBottom: (theme) => theme.spacing(2),
          }}
          spacing={1}
          alignItems="center"
          direction="row"
        >
          <FormSelect
            size="small"
            variant={fieldVariant}
            name={`${name}.matchType`}
          >
            <MenuItem value={ConditionalRuleGroupMatchType.Any}>
              At least one
            </MenuItem>
            <MenuItem value={ConditionalRuleGroupMatchType.All}>All</MenuItem>
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

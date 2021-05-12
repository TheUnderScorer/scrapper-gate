import React, { memo, useMemo } from 'react';
import { BaseEntity, ConditionalRuleInput } from '@scrapper-gate/shared/schema';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Stack,
  TextFieldProps,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Delete, Edit } from '@material-ui/icons';
import { toDisplayText } from '@scrapper-gate/shared/common';
import classNames from 'classnames';
import { ConditionalRulesSelection } from '../../../types';

export interface ConditionalRulesRuleProps {
  fieldVariant?: TextFieldProps['variant'];
  value: ConditionalRuleInput & Pick<BaseEntity, 'id'>;
  definitions: ConditionalRulesSelection[];
  onRowRemove?: () => unknown;
  name: string;
  isEdit?: boolean;
  onEdit?: (rowId: string) => void;
  onEditClose?: (rowId: string) => void;
}

const useStyles = makeStyles((theme) => ({
  select: {
    minWidth: '200px',
  },
  iconButton: {
    width: '35px',
    height: '35px',
  },
  delete: {
    '&, & svg': {
      color: theme.palette.error.main,
    },
  },
  paper: {
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  content: {
    width: '100%',
  },
  summaryStack: {
    width: '100%',
    paddingRight: theme.spacing(2),
  },
  accordionSummary: {
    '& .MuiAccordionSummary-expandIconWrapper': {
      transform: 'none !important',
    },
  },
  paperContent: {
    padding: theme.spacing(2),
    width: '100%',
  },
  btnSection: {
    marginTop: theme.spacing(2),
  },
}));

const BaseConditionalRulesRule = ({
  definitions,
  onRowRemove,
  value,
  fieldVariant,
  name,
  isEdit,
  onEdit,
  onEditClose,
}: ConditionalRulesRuleProps) => {
  const classes = useStyles();

  const definitionSelection = useMemo(() => {
    return definitions.find((def) => def.value.type === value.type);
  }, [definitions, value.type]);
  const definition = definitionSelection?.value;

  const Component = definition?.Component;

  const title = useMemo(() => {
    if (!value?.type) {
      return '';
    }

    if (definition?.createTitle) {
      return definition.createTitle(value);
    }

    if (!value?.when || !value?.value) {
      return toDisplayText(definition.type);
    }

    return [value.type, value.when, value.value].map(toDisplayText).join(' ');
  }, [definition, value]);

  return (
    <Accordion
      className={classNames(classes.content, 'conditional-rules-rule')}
      elevation={2}
      onChange={(event, expanded) =>
        expanded ? onEdit(value.id) : onEditClose(value.id)
      }
      expanded={isEdit}
    >
      <AccordionSummary
        expandIcon={
          <IconButton size="small">
            <Edit />
          </IconButton>
        }
        className={classes.accordionSummary}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          className={classes.summaryStack}
        >
          <Stack direction="row" spacing={2}>
            {definitionSelection?.icon}
            <Typography className="conditional-rules-rule-title">
              {title}
            </Typography>
          </Stack>
          <Tooltip title="Remove rule">
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();

                onRowRemove?.();
              }}
              className={classNames(classes.delete, 'remove-rules-rule')}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {Component && (
          <Component
            fieldVariant={fieldVariant}
            definition={definition}
            spacing={2}
            getName={(path = '') => name + path}
          />
        )}
        <Stack
          justifyContent="flex-end"
          className={classes.btnSection}
          direction="row"
          spacing={2}
        >
          <Button onClick={() => onEditClose(value.id)}>Close</Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export const ConditionalRulesRule = memo(BaseConditionalRulesRule);

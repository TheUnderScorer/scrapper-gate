import { Delete, Edit } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Stack,
  TextFieldProps,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useVariablesContextSelector } from '@scrapper-gate/frontend/domain/variables';
import { toDisplayText } from '@scrapper-gate/shared/common';
import {
  BaseEntity,
  ConditionalRuleInput,
  Variable,
} from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import React, { memo, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';
import {
  ConditionalRuleDefinition,
  ConditionalRulesSelection,
  RuleTitleDefinitionType,
} from '../../../types';
import { ConditionalRulesRuleTitle } from './Title/ConditionalRulesRuleTitle';

const PREFIX = 'ConditionalRulesRule';

const classes = {
  select: `${PREFIX}-select`,
  iconButton: `${PREFIX}-iconButton`,
  delete: `${PREFIX}-delete`,
  title: `${PREFIX}-title`,
  paper: `${PREFIX}-paper`,
  content: `${PREFIX}-content`,
  summaryStack: `${PREFIX}-summaryStack`,
  accordionSummary: `${PREFIX}-accordionSummary`,
  paperContent: `${PREFIX}-paperContent`,
  btnSection: `${PREFIX}-btnSection`,
  summaryContent: `${PREFIX}-summaryContent`,
  innerStack: `${PREFIX}-innerStack`,
};

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  [`& .${classes.select}`]: {
    minWidth: '200px',
  },

  [`& .${classes.iconButton}`]: {
    width: '35px',
    height: '35px',
  },

  [`& .${classes.delete}`]: {
    '&, & svg': {
      color: theme.palette.error.main,
    },
  },

  [`& .${classes.title}`]: {
    width: '100%',
  },

  [`& .${classes.paper}`]: {
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },

  [`&.${classes.content}`]: {
    width: '100%',
  },

  [`& .${classes.summaryStack}`]: {
    width: '100%',
    paddingRight: theme.spacing(2),

    '&.hasError': {
      color: theme.palette.error.main,
    },
  },

  [`& .${classes.accordionSummary}`]: {
    '& .MuiAccordionSummary-expandIconWrapper': {
      transform: 'none !important',
    },
  },

  [`& .${classes.paperContent}`]: {
    padding: theme.spacing(2),
    width: '100%',
  },

  [`& .${classes.btnSection}`]: {
    marginTop: theme.spacing(2),
  },

  [`& .${classes.summaryContent}`]: {
    width: '100%',
  },

  [`& .${classes.innerStack}`]: {
    width: '100%',
  },
}));

export interface ConditionalRulesRuleProps {
  fieldVariant?: TextFieldProps['variant'];
  value: ConditionalRuleInput & Pick<BaseEntity, 'id'>;
  definitions: ConditionalRulesSelection[];
  onRowRemove?: () => unknown;
  name: string;
  isEdit?: boolean;
  onEdit?: (rowId: string) => void;
  onEditClose?: (rowId: string) => void;
  hasError?: boolean;
}

const getTitle = (
  value: ConditionalRuleInput & Pick<BaseEntity, 'id'>,
  variables: Variable[],
  definition?: ConditionalRuleDefinition
) => {
  if (!value?.type || !definition?.type) {
    return [];
  }

  if (definition?.createTitle) {
    return definition.createTitle(value, { variables });
  }

  if (!value?.when || !value?.value) {
    return [
      {
        type: RuleTitleDefinitionType.Text,
        text: toDisplayText(definition.type),
      },
    ];
  }

  return [value.type, value.when, value.value].map((text) => ({
    type: RuleTitleDefinitionType.Text,
    text: toDisplayText(text?.toString() ?? ''),
  }));
};

const BaseConditionalRulesRule = ({
  definitions,
  onRowRemove,
  value,
  fieldVariant,
  name,
  isEdit,
  onEdit,
  onEditClose,
  hasError,
}: ConditionalRulesRuleProps) => {
  const variables = useVariablesContextSelector((ctx) => ctx.variables);

  const definitionSelection = useMemo(() => {
    return definitions.find((def) => def.value.type === value.type);
  }, [definitions, value.type]);
  const definition = definitionSelection?.value;

  const Component = definition?.Component;

  const [title, setTitle] = useState(getTitle(value, variables, definition));

  useDebounce(() => setTitle(getTitle(value, variables, definition)), 750, [
    value,
    definition,
    variables,
  ]);

  return (
    <StyledAccordion
      className={classNames(classes.content, 'conditional-rules-rule')}
      elevation={2}
      onChange={(event, expanded) =>
        expanded ? onEdit?.(value.id) : onEditClose?.(value.id)
      }
      expanded={isEdit}
    >
      <AccordionSummary
        classes={{
          content: classes.content,
        }}
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
          className={classNames(classes.summaryStack, { hasError })}
        >
          <Stack className={classes.innerStack} direction="row" spacing={2}>
            {definitionSelection?.icon}
            <Typography
              component="div"
              className={classNames(
                'conditional-rules-rule-title',
                classes.title
              )}
            >
              <ConditionalRulesRuleTitle definitions={title} rule={value} />
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
        {Component && definition && (
          <Component
            fieldVariant={fieldVariant}
            definition={definition}
            spacing={2}
            getName={(path = '') => name + path}
          />
        )}
      </AccordionDetails>
    </StyledAccordion>
  );
};

export const ConditionalRulesRule = memo(BaseConditionalRulesRule);

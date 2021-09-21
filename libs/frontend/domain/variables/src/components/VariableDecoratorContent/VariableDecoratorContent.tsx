import { Box } from '@mui/material';
import { DecoratorComponentProps } from '@scrapper-gate/frontend/block-editor';
import { LightTooltip } from '@scrapper-gate/frontend/ui';
import classNames from 'classnames';
import React, { memo } from 'react';
import { useVariablesContextSelector } from '../../providers/VariablesProvider';
import { VariableDetails } from '../VariableDetails/VariableDetails';

const BaseVariableDecoratorContent = ({
  children,
  leaf,
  attributes,
}: DecoratorComponentProps) => {
  const text = 'text' in leaf && leaf.text ? leaf.text : '';

  const variable = useVariablesContextSelector(
    (ctx) => ctx.mappedVariables[text]
  );

  const resolved = Boolean(variable);

  return (
    <Box display="inline-block" {...attributes}>
      <LightTooltip
        key={`variable-${text}-${resolved ? 'resolved' : 'not-resolved'}`}
        arrow
        open={variable ? undefined : false}
        title={
          variable ? (
            <VariableDetails
              variable={variable}
              sx={{
                minWidth: '150px',
              }}
            />
          ) : (
            ''
          )
        }
      >
        <Box
          component="span"
          sx={{
            '&.resolved': {
              color: (theme) => theme.palette.primary.dark,
            },
          }}
          className={classNames({ resolved }, 'variable-content')}
        >
          {children}
        </Box>
      </LightTooltip>
    </Box>
  );
};

export const VariableDecoratorContent = memo(BaseVariableDecoratorContent);

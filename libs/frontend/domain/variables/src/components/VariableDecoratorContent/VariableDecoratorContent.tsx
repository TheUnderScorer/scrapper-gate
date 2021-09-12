import { makeStyles } from '@material-ui/styles';
import { DecoratorComponentProps } from '@scrapper-gate/frontend/block-editor';
import { LightTooltip } from '@scrapper-gate/frontend/ui';
import classNames from 'classnames';
import React, { memo } from 'react';
import { useVariablesContextSelector } from '../../providers/VariablesProvider';
import { VariableDetails } from '../VariableDetails/VariableDetails';

const useStyles = makeStyles((theme) => ({
  variable: {
    '&.resolved': {
      color: theme.palette.primary.dark,
    },
  },
  details: {
    minWidth: '150px',
  },
}));

const BaseVariableDecoratorContent = ({
  children,
  leaf,
  attributes,
}: DecoratorComponentProps) => {
  const classes = useStyles();

  const text = 'text' in leaf && leaf.text ? leaf.text : '';

  const variable = useVariablesContextSelector(
    (ctx) => ctx.mappedVariables[text]
  );

  const resolved = Boolean(variable);

  return (
    <span {...attributes}>
      <LightTooltip
        key={`variable-${text}-${resolved ? 'resolved' : 'not-resolved'}`}
        arrow
        open={variable ? undefined : false}
        title={
          variable ? (
            <VariableDetails className={classes.details} variable={variable} />
          ) : (
            ''
          )
        }
      >
        <span
          className={classNames(
            classes.variable,
            { resolved },
            'variable-content'
          )}
        >
          {children}
        </span>
      </LightTooltip>
    </span>
  );
};

export const VariableDecoratorContent = memo(BaseVariableDecoratorContent);

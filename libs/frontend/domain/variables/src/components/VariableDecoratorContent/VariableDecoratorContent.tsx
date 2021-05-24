import { makeStyles } from '@material-ui/core/styles';
import { TextFieldBlockDecoratorComponentProps } from '@scrapper-gate/frontend/form';
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
  decoratedText,
}: TextFieldBlockDecoratorComponentProps) => {
  const classes = useStyles();

  const variable = useVariablesContextSelector(
    (ctx) => ctx.mappedVariables[decoratedText]
  );

  const resolved = Boolean(variable);

  return (
    <LightTooltip
      arrow
      open={variable ? undefined : false}
      title={
        variable ? (
          <VariableDetails className={classes.details} variable={variable} />
        ) : null
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
  );
};

export const VariableDecoratorContent = memo(BaseVariableDecoratorContent);

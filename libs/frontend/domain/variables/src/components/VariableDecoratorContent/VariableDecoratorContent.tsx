import { makeStyles } from '@material-ui/core/styles';
import { TextFieldBlockDecoratorComponentProps } from '@scrapper-gate/frontend/form';
import classNames from 'classnames';
import React, { memo } from 'react';
import { useVariablesContextSelector } from '../../providers/VariablesProvider';

const useStyles = makeStyles((theme) => ({
  variable: {
    '&.resolved': {
      color: theme.palette.primary.dark,
    },
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
    <span className={classNames(classes.variable, { resolved })}>
      {children}
    </span>
  );
};

export const VariableDecoratorContent = memo(BaseVariableDecoratorContent);

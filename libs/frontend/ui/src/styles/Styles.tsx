import React, { useMemo } from 'react';
import { StylesFn } from './styles.types';
import { useTheme } from '@material-ui/core';
import { Global } from '@emotion/react';

export interface StylesProps {
  styleFns: StylesFn[];
}

export const Styles = ({ styleFns }: StylesProps) => {
  const theme = useTheme();
  const styles = useMemo(() => {
    return styleFns.map((fn) => fn(theme));
  }, [styleFns, theme]);

  return <Global styles={styles} />;
};

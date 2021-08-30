import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import React, { ReactNode, useMemo } from 'react';

export interface LayoutProps {
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  headerHeight?: number | string;
  footerHeight?: number | string;
  className?: string;
  noGutters?: boolean;
}

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
  },
  body: (props: LayoutProps) => ({
    overflowY: props.footer || props.header ? 'auto' : 'hidden',
    overflowX: 'hidden',
    padding: props.noGutters ? 0 : `${theme.spacing(2)} 0`,
  }),
}));

export const Layout = (props: LayoutProps) => {
  const classes = useStyles(props);

  const { body, footer, footerHeight, header, headerHeight, className } = props;

  const heightOffset = useMemo(() => {
    let offset = 0;

    if (headerHeight && header) {
      offset += parseFloat(headerHeight.toString());
    }

    if (footerHeight && footer) {
      offset += parseFloat(footerHeight.toString());
    }

    return offset;
  }, [headerHeight, header, footerHeight, footer]);

  return (
    <Grid
      className={classNames(classes.container, className, 'layout')}
      container
      direction="column"
      wrap="nowrap"
    >
      {header && (
        <Grid
          className="layout-header"
          item
          style={{
            height: headerHeight,
          }}
        >
          {header}
        </Grid>
      )}
      {body && (
        <Grid
          className={classNames(classes.body, 'layout-body')}
          item
          style={{
            height: `calc(100% - ${heightOffset}px)`,
            flex: 1,
          }}
        >
          {body}
        </Grid>
      )}
      {footer && (
        <Grid
          className="layout-footer"
          item
          style={{
            height: footerHeight,
          }}
        >
          {footer}
        </Grid>
      )}
    </Grid>
  );
};

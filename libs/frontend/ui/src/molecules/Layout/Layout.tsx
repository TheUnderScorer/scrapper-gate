import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemedSxProps } from '@scrapper-gate/frontend/theme';
import classNames from 'classnames';
import React, { ReactNode, useMemo } from 'react';

const StyledGrid = styled(Grid)({
  height: '100%',
});

export interface LayoutProps extends ThemedSxProps {
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  headerHeight?: number | string;
  footerHeight?: number | string;
  className?: string;
  noGutters?: boolean;
}

export const Layout = (props: LayoutProps) => {
  const { body, footer, footerHeight, header, headerHeight, className, sx } =
    props;

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
    <StyledGrid
      className={classNames(className, 'layout')}
      container
      direction="column"
      wrap="nowrap"
      sx={sx}
    >
      {header && (
        <Grid
          className="layout-header"
          item
          sx={{
            height: headerHeight,
          }}
        >
          {header}
        </Grid>
      )}
      {body && (
        <Grid
          className="layout-body"
          item
          sx={{
            height: `calc(100% - ${heightOffset}px)`,
            flex: 1,
            overflowY: props.footer || props.header ? 'auto' : 'hidden',
            overflowX: 'hidden',
            padding: (theme) => (props.noGutters ? 0 : `${theme.spacing(2)} 0`),
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
    </StyledGrid>
  );
};

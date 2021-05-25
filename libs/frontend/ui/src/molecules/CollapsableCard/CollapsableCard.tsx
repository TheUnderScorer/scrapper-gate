import React, {
  ChangeEvent,
  forwardRef,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Close, ExpandMore } from '@material-ui/icons';
import classNames from 'classnames';
import { useStyles } from './CollapsableCard.styles';

export interface CollapsableCardProps
  extends Omit<
    AccordionProps,
    'innerRef' | 'onChange' | 'expanded' | 'ref' | 'title' | 'children'
  > {
  title?: string;
  subTitle?: string;
  closable?: boolean;
  onClose?: () => unknown;
  actions?: ReactNode;
  initialExpanded?: boolean;
  primary?: boolean;
  showCollapsableBtn?: boolean;
  onChange?: (expanded: boolean) => unknown;
  children?: ReactNode;
}

export const CollapsableCard = forwardRef<HTMLElement, CollapsableCardProps>(
  (
    {
      title,
      subTitle,
      children,
      className,
      closable,
      onClose,
      initialExpanded = false,
      actions,
      primary,
      showCollapsableBtn = true,
      onChange,
      ...props
    }: CollapsableCardProps,
    ref
  ) => {
    const panelRef = useRef<HTMLDivElement>();

    const classes = useStyles();

    const [expanded, setExpanded] = useState(initialExpanded);

    const toggle = useCallback(() => {
      setExpanded((prev) => !prev);
    }, []);

    const handleChange = useCallback(
      (event: ChangeEvent<unknown>, isExpanded: boolean) => {
        const btn = panelRef.current.querySelector('.collapsable-card-btn');

        if (!btn.contains(event.target as HTMLElement)) {
          return;
        }

        setExpanded(isExpanded);

        if (onChange) {
          onChange(isExpanded);
        }
      },
      [onChange]
    );

    useEffect(() => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(panelRef.current);
      } else {
        ref.current = panelRef.current;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [panelRef]);

    return (
      <Accordion
        className={className}
        ref={panelRef as MutableRefObject<HTMLDivElement>}
        expanded={expanded}
        onChange={handleChange}
        elevation={3}
        {...props}
      >
        <AccordionSummary className={classNames(classes.summary, { primary })}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Grid container spacing={1} direction="column">
                <Grid item>
                  <Typography
                    noWrap
                    className="collapsable-card-title"
                    variant="h5"
                  >
                    {title}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    className={classes.secondary}
                    variant="caption"
                    color="secondary"
                  >
                    {subTitle}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container className="collapsable-card-buttons">
                {showCollapsableBtn && (
                  <Grid item>
                    <IconButton
                      className={classNames(
                        classes.cardExpandBtn,
                        { expanded },
                        'collapsable-card-btn'
                      )}
                      onClick={toggle}
                    >
                      <ExpandMore />
                    </IconButton>
                  </Grid>
                )}
                {closable && (
                  <Grid item>
                    <IconButton
                      className="close-collapsable-card"
                      onClick={onClose}
                    >
                      <Close />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
        {actions && <AccordionActions>{actions}</AccordionActions>}
      </Accordion>
    );
  }
);

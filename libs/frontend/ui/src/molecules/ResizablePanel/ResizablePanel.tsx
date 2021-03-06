import { Fab, Paper, Tooltip } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { useKeyboardShortcuts } from '@scrapper-gate/frontend/keyboard-shortcuts';
import classNames from 'classnames';
import { Resizable } from 're-resizable';
import {
  forwardRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { usePrevious, useToggle } from 'react-use';
import { TextWithKeyHint } from '../TextWithKeyHint/TextWithKeyHint';
import { ResizablePanelProps } from './ResizablePanel.types';

const useStyles = makeStyles((theme) => ({
  handle: (props: Pick<ResizablePanelProps, 'enable'>) => ({
    '&:hover > div, &:active > div': {
      backgroundColor: theme.palette.primary.main,
      transition: theme.transitions.create('all'),
    },
    '& > div': {
      width: '6px !important',
      right: props.enable?.right ? '0 !important' : undefined,
      left: props.enable?.left ? '0 !important' : undefined,
    },
    '&.closed > div': {
      pointerEvents: 'none',
    },
  }),
  container: {
    '&:not(.isResize)': {
      transition: theme.transitions.create('all'),
    },
  },
  content: {
    width: '100%',
    height: '100%',
    overflowX: 'visible',

    '&.closed': {
      padding: 0,
    },
  },
  iconBtn: {
    position: 'absolute',
    top: '45%',
    right: '-12px',
    zIndex: 10,
    width: '25px',
    height: '25px',
    minHeight: 0,
    '& svg': {
      transition: theme.transitions.create('transform'),
    },
    '&.closed svg': {
      transform: 'rotate(180deg)',
    },
  },
}));

export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    {
      children,
      paperProps,
      disableKeyShortcut,
      initialWidth,
      hideArrow,
      ...props
    },
    ref
  ) => {
    const classes = useStyles({
      enable: props.enable,
    });

    const [open, toggleOpen] = useToggle(true);

    const [isResize, setIsResize] = useState(false);

    const [lastWidth, setLastWidth] = useState<string | number>(initialWidth);

    const instanceRef = useRef<Resizable>();

    const closed = !open;
    const prevOpen = usePrevious(closed);

    const keyboardShortcuts = useKeyboardShortcuts();

    useEffect(() => {
      if (prevOpen === closed) {
        return;
      }

      if (closed) {
        instanceRef.current?.updateSize({
          width: '5px',
          height: '100%',
        });

        return;
      }

      instanceRef.current?.updateSize({
        width: lastWidth ?? props.maxWidth ?? '300px',
        height: '100%',
      });
    }, [closed, lastWidth, prevOpen, props.maxWidth]);

    useHotkeys(
      keyboardShortcuts?.drawer.toggle ?? '',
      () => {
        if (disableKeyShortcut) {
          return;
        }

        toggleOpen();
      },
      [toggleOpen, disableKeyShortcut]
    );

    return (
      <Resizable
        {...props}
        ref={instanceRef as MutableRefObject<Resizable>}
        className={classNames(props.className, classes.container, {
          closed,
          isResize,
        })}
        handleWrapperClass={classNames(
          props.handleWrapperClass,
          classes.handle,
          {
            closed,
          }
        )}
        onResizeStart={() => setIsResize(true)}
        onResizeStop={() => {
          setIsResize(false);
        }}
        onResize={(event, direction, elementRef) => {
          setLastWidth(elementRef.clientWidth);
        }}
        minWidth={open ? props.minWidth : 1}
      >
        {!hideArrow && (
          <Tooltip
            title={
              <TextWithKeyHint keyHint={keyboardShortcuts?.drawer.toggle}>
                Toggle panel
              </TextWithKeyHint>
            }
          >
            <Fab
              onClick={() => toggleOpen()}
              size="small"
              className={classNames(
                classes.iconBtn,
                { closed },
                'toggle-panel'
              )}
            >
              <ChevronLeft />
            </Fab>
          </Tooltip>
        )}
        <Paper
          {...paperProps}
          ref={ref}
          className={classNames(
            paperProps?.className,
            classes.content,
            'resizable-panel-content',
            {
              closed,
            }
          )}
        >
          {open && children}
        </Paper>
      </Resizable>
    );
  }
);

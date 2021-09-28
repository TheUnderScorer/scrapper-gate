import { ChevronLeft } from '@mui/icons-material';
import { Fab, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeUseMemoryOpenState } from '@scrapper-gate/frontend/common';
import { useKeyboardShortcuts } from '@scrapper-gate/frontend/keyboard-shortcuts';
import classNames from 'classnames';
import { Resizable } from 're-resizable';
import {
  forwardRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { usePrevious } from 'react-use';
import { TextWithKeyHint } from '../TextWithKeyHint/TextWithKeyHint';
import { ResizablePanelProps } from './ResizablePanel.types';

const StyledResizable = styled(Resizable, {
  shouldForwardProp: (propName: PropertyKey) => propName !== 'ref',
  skipSx: false,
})(({ theme, ...props }) => ({
  '& .panel-handle': {
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
  },
  '& .panel-container': {
    '&:not(.isResize)': {
      transition: theme.transitions.create('all'),
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
      useOpenStateProvider = makeUseMemoryOpenState(true),
      ...props
    },
    ref
  ) => {
    const { setOpen, open } = useOpenStateProvider();
    const toggleOpen = useCallback(() => {
      setOpen((prev) => !prev);
    }, [setOpen]);

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
      <StyledResizable
        {...props}
        {...({
          ref: instanceRef as MutableRefObject<Resizable>,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)}
        className={classNames(props.className, 'panel-container', {
          closed,
          isResize,
        })}
        handleWrapperClass={classNames(
          props.handleWrapperClass,
          'panel-handle',
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
              onClick={toggleOpen}
              size="small"
              sx={{
                position: 'absolute',
                top: '45%',
                right: '-12px',
                zIndex: 10,
                width: '25px',
                height: '25px',
                minHeight: 0,
                '& svg': {
                  transition: (theme) => theme.transitions.create('transform'),
                },
                '&.closed svg': {
                  transform: 'rotate(180deg)',
                },
              }}
              className={classNames({ closed }, 'toggle-panel')}
            >
              <ChevronLeft />
            </Fab>
          </Tooltip>
        )}
        <Paper
          {...paperProps}
          ref={ref}
          sx={{
            width: '100%',
            height: '100%',
            overflowX: 'visible',

            '&.closed': {
              padding: 0,
            },
            ...paperProps?.sx,
          }}
          className={classNames(
            paperProps?.className,
            'resizable-panel-content',
            {
              closed,
            }
          )}
        >
          {open && children}
        </Paper>
      </StyledResizable>
    );
  }
);

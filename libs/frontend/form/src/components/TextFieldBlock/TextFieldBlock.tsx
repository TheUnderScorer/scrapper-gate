import { TextField } from '@material-ui/core';
import { InputBaseComponentProps } from '@material-ui/core/InputBase/InputBase';
import { makeStyles } from '@material-ui/styles';
import { AppTheme } from '@scrapper-gate/frontend/theme';
import { getDisplayValue } from '@scrapper-gate/shared/common';
import classNames from 'classnames';
import {
  ContentState,
  Editor,
  EditorState,
  getDefaultKeyBinding,
} from 'draft-js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import EditorBidiService from 'draft-js/lib/EditorBidiService';
import React, {
  FocusEvent,
  forwardRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { usePrevious } from 'react-use';
import { Key } from 'ts-key-enum';
import { TextFieldBlockProvider } from './TextFieldBlock.provider';
import { TextFieldBlockProps } from './TextFieldBlock.types';

const useStyles = makeStyles((theme: AppTheme) => ({
  input: {
    '& .public-DraftEditor-content': {
      padding: 18,
      minWidth: 50,
    },
  },
  textField: (props: Pick<TextFieldBlockProps, 'InputProps' | 'variant'>) => ({
    width: '100%',
    tabSize: 8,
    fontVariantLigatures: 'none',
    boxSizing: 'content-box',
    whiteSpace: 'pre-wrap',

    '& .MuiInputBase-root': {
      minHeight: props.variant === 'outlined' ? '52px' : '32px',
    },

    '& .DraftEditor-root': {
      width: '100%',
      height: '100%',
      padding: `0 ${theme.spacing(2)}`,
      paddingLeft:
        props.InputProps?.startAdornment || props.variant !== 'outlined'
          ? 0
          : theme.spacing(2),
    },

    '& .public-DraftEditor-content, & .DraftEditor-editorContainer': {
      width: '100%',
      height: '100%',
    },

    '& .public-DraftEditor-content': {
      display: 'flex',
      alignItems: 'center',
      '& > div > div > div': {
        minWidth: 10,
      },
    },
  }),
}));

const DraftField = forwardRef<
  HTMLElement,
  {
    editorRef: MutableRefObject<HTMLElement>;
    onStateChange: (state: EditorState) => unknown;
    state: EditorState;
  } & InputBaseComponentProps
>(({ children, editorRef, onStateChange, state, value, ...rest }, ref) => {
  useImperativeHandle(ref, () => ({
    ...editorRef.current,
    focus: () => {
      editorRef.current?.focus();
    },
    value,
  }));

  return (
    <Editor
      {...rest}
      onCopy={(editor, event) => rest?.onCopy?.(event as any)}
      onCut={(editor, event) => rest?.onCut?.(event as any)}
      tabIndex={0}
      spellCheck={Boolean(rest.spellCheck)}
      keyBindingFn={(event) => {
        // Prevent multiline
        if ([Key.Enter, Key.Tab].includes(event.key as Key)) {
          return null;
        }

        return getDefaultKeyBinding(event);
      }}
      ariaMultiline={false}
      editorState={state}
      onChange={onStateChange}
    />
  );
});

export const TextFieldBlock = forwardRef<HTMLInputElement, TextFieldBlockProps>(
  (props, ref) => {
    const {
      onChange,
      value,
      decorator,
      onFocus,
      onBlur,
      error,
      dateFormat,
      ...restProps
    } = props;

    const [didInternalChange, setDidInternalChange] = useState(false);

    const classes = useStyles({
      InputProps: props.InputProps,
      variant: props.variant ?? 'outlined',
    });
    const editorRef = useRef<HTMLElement>();
    const [focused, setIsFocused] = useState(false);

    const [state, setState] = useState(EditorState.createEmpty(decorator));
    const prevState = usePrevious(state);

    const handleFocus = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);

        onFocus?.(event);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);

        onBlur?.(event);
      },
      [onBlur]
    );

    useEffect(() => {
      if (didInternalChange) {
        return;
      }

      const parsedValue = getDisplayValue({
        value,
        dateFormat,
      });

      const prevValue = prevState?.getCurrentContent().getPlainText();

      console.log({
        parsedValue,
        prevValue,
      });

      if (value === prevValue || parsedValue === prevValue) {
        return;
      }

      setState((previous) => {
        const contentState = ContentState.createFromText(
          parsedValue?.toString() ?? ''
        );

        return EditorState.set(previous, {
          currentContent: contentState,
          directionMap: EditorBidiService.getDirectionMap(
            contentState,
            previous.getDirectionMap()
          ),
        });
      });
    }, [value, decorator, dateFormat, prevState, didInternalChange]);

    const handleStateChange = useCallback(
      (newState: EditorState) => {
        console.log(newState);
        const plainText = newState.getCurrentContent().getPlainText();

        setDidInternalChange(true);

        onChange?.(plainText);
        setState(newState);

        setTimeout(() => setDidInternalChange(false), 100);
      },
      [onChange]
    );

    return (
      <TextFieldBlockProvider
        editorState={state}
        setEditorState={handleStateChange}
        focused={focused}
      >
        <TextField
          {...restProps}
          ref={ref}
          className={classNames(classes.textField, restProps.className)}
          variant={restProps.variant}
          onFocus={handleFocus}
          onBlur={handleBlur}
          error={error}
          InputProps={{
            ...restProps.InputProps,
            inputProps: {
              onStateChange: handleStateChange,
              state,
              editorRef,
              component: Editor,
              value,
            },

            inputComponent: DraftField,
          }}
        />
      </TextFieldBlockProvider>
    );
  }
);

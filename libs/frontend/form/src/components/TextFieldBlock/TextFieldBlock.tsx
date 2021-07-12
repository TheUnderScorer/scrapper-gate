import { Box, InputProps, TextField } from '@material-ui/core';
import { InputBaseComponentProps } from '@material-ui/core/InputBase/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import { getDisplayValue } from '@scrapper-gate/shared/common';
import classNames from 'classnames';
import {
  ContentState,
  Editor,
  EditorState,
  getDefaultKeyBinding,
} from 'draft-js';
import React, {
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  FocusEvent,
  useCallback,
} from 'react';
import { useMount, usePrevious } from 'react-use';
import { Key } from 'ts-key-enum';
import { TextFieldBlockProvider } from './TextFieldBlock.provider';
import { TextFieldBlockProps } from './TextFieldBlock.types';

const useStyles = makeStyles((theme) => ({
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
      tabIndex={0}
      spellCheck={Boolean(rest.spellCheck)}
      keyBindingFn={(event) => {
        // Prevent multilines
        if ([Key.Enter, Key.Tab].includes(event.key as Key)) {
          return null;
        }

        return getDefaultKeyBinding(event);
      }}
      ariaMultiline={false}
      editorState={state}
      onChange={(newState) => {
        onStateChange?.(newState);
      }}
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

    const classes = useStyles({
      InputProps: props.InputProps,
      variant: props.variant ?? 'outlined',
    });
    const editorRef = useRef<HTMLElement>();
    const [focused, setIsFocused] = useState(false);

    const [state, setState] = useState(EditorState.createEmpty());
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
      const plainText = state.getCurrentContent().getPlainText();
      const prevText = prevState?.getCurrentContent().getPlainText();

      if (plainText !== prevText) {
        onChange?.(plainText);
      }
    }, [state, onChange, prevState]);

    useMount(() => {
      setState(
        EditorState.set(state, {
          decorator,
        })
      );
    });

    useEffect(() => {
      const parsedValue = getDisplayValue({
        value,
        dateFormat,
      });

      // TODO Investigate this loop
      if (value === prevState?.getCurrentContent().getPlainText()) {
        return;
      }

      const state = EditorState.createWithContent(
        ContentState.createFromText(parsedValue?.toString() ?? '')
      );

      setState(
        EditorState.set(state, {
          decorator,
        })
      );
    }, [value, decorator, dateFormat, prevState]);

    return (
      <TextFieldBlockProvider
        editorState={state}
        setEditorState={setState}
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
              onStateChange: setState,
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

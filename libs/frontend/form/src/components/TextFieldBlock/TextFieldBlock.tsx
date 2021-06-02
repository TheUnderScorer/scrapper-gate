import { Box, InputProps, TextField } from '@material-ui/core';
import { InputBaseComponentProps } from '@material-ui/core/InputBase/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import { getValue } from '@scrapper-gate/shared/common';
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
} from 'react';
import { useMount, usePrevious } from 'react-use';
import { Key } from 'ts-key-enum';
import { TextFieldBlockProvider } from './TextFieldBlock.provider';
import { TextFieldBlockProps } from './TextFieldBlock.types';

const useStyles = makeStyles((theme) => ({
  input: {
    '& .public-DraftEditor-content': {
      padding: 18,
      minWidth: 200,
    },
  },
  textField: {
    width: '100%',
    tabSize: 8,
    fontVariantLigatures: 'none',
    boxSizing: 'content-box',
    whiteSpace: 'pre-wrap',

    '& .MuiInputBase-root': {
      height: 54,
    },

    '& .DraftEditor-root': {
      width: '100%',
      height: '100%',
      padding: `0 ${theme.spacing(2)}`,
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
  },
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
    focus: () => {
      editorRef.current?.focus();
    },
    ...editorRef.current,
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
          return;
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
  (
    {
      onChange,
      value,
      decorator,
      onFocus,
      onBlur,
      error,
      dateFormat,
      ...props
    },
    ref
  ) => {
    const classes = useStyles();
    const editorRef = useRef<HTMLElement>();
    const [focused, setIsFocused] = useState(false);

    const [state, setState] = useState(EditorState.createEmpty());
    const prevState = usePrevious(state);

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
      const parsedValue = getValue({
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
          {...props}
          ref={ref}
          className={classNames(classes.textField, props.className)}
          variant={props.variant}
          onFocus={(event) => {
            setIsFocused(true);

            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);

            onBlur?.(event);
          }}
          error={error}
          InputProps={{
            ...props.InputProps,
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

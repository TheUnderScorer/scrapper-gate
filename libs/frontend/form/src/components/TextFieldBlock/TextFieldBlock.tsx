import {
  FormControl,
  FormHelperText,
  InputBase,
  InputLabel,
} from '@material-ui/core';
import NotchedOutline from '@material-ui/core/OutlinedInput/NotchedOutline';
import { makeStyles } from '@material-ui/core/styles';
import {
  ContentState,
  Editor,
  EditorState,
  getDefaultKeyBinding,
} from 'draft-js';
import React, { forwardRef, useState } from 'react';
import { useMount } from 'react-use';
import { Key } from 'ts-key-enum';
import { TextFieldBlockProvider } from './TextFieldBlock.provider';
import { TextFieldBlockProps } from './TextFieldBlock.types';

const useStyles = makeStyles(() => ({
  input: {
    '& .public-DraftEditor-content': {
      padding: 18,
      minWidth: 200,
    },
  },
}));

export const TextFieldBlock = forwardRef<HTMLInputElement, TextFieldBlockProps>(
  ({ onChange, value, decorator, onFocus, onBlur, error, ...props }, ref) => {
    const classes = useStyles();
    const [focused, setIsFocused] = useState(false);

    const [state, setState] = useState(EditorState.createEmpty());

    useMount(() => {
      const state = EditorState.createWithContent(
        ContentState.createFromText(value)
      );

      setState(
        EditorState.set(state, {
          decorator,
        })
      );
    });

    return (
      <TextFieldBlockProvider
        editorState={state}
        setEditorState={setState}
        focused={focused}
      >
        <FormControl
          error={error}
          id={props.id}
          variant={props.variant}
          className={props.className}
          focused={focused}
        >
          {props.label && (
            <InputLabel
              error={error}
              shrink={Boolean(value) || focused}
              htmlFor={props.id}
              variant="outlined"
            >
              {props.label}
            </InputLabel>
          )}
          <InputBase
            onFocus={onFocus}
            onBlur={onBlur}
            ref={ref}
            error={error}
            className={classes.input}
            value={value}
            renderSuffix={() => (
              <NotchedOutline
                label={props.label}
                notched={focused || Boolean(value)}
                focused={focused}
              />
            )}
            inputComponent={() => (
              <Editor
                tabIndex={0}
                keyBindingFn={(event) => {
                  // Prevent multilines
                  if ([Key.Enter, Key.Tab].includes(event.key as Key)) {
                    return;
                  }

                  return getDefaultKeyBinding(event);
                }}
                onFocus={() => {
                  setIsFocused(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                }}
                ariaMultiline={false}
                editorState={state}
                onChange={(newState) => {
                  setState(newState);

                  onChange?.(newState.getCurrentContent().getPlainText());
                }}
              />
            )}
          />
          {props.helperText && (
            <FormHelperText>{props.helperText}</FormHelperText>
          )}
        </FormControl>
      </TextFieldBlockProvider>
    );
  }
);

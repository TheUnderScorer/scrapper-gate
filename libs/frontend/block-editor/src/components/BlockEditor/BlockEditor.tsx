/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextField } from '@material-ui/core';
import { InputBaseComponentProps } from '@material-ui/core/InputBase/InputBase';
import { setRefValue } from '@scrapper-gate/frontend/common';
import classNames from 'classnames';
import React, {
  FocusEvent,
  forwardRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { pipe } from 'remeda';
import { createEditor, Descendant, Editor } from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { composeDecorators } from '../../composeDecorators';
import { composeLeafs } from '../../composeLeafs';
import { withSingleLine } from '../../plugins/withSingleLine';
import { textSerializeStrategy } from '../../serializeStrategies/textSerialize.strategy';
import { BlockEditorProvider } from './BlockEditor.provider';
import { BlockEditorProps, SlateProps } from './BlockEditor.types';

const BlockEditorField = forwardRef<
  HTMLElement,
  InputBaseComponentProps &
    Pick<BlockEditorProps, 'decorators'> & {
      onEditorChange: SlateProps['onChange'];
      editorRef: MutableRefObject<HTMLElement>;
      editorValue: SlateProps['value'];
      editor: Editor;
    }
>(
  (
    {
      onEditorChange,
      editorRef,
      editorValue,
      value,
      decorators = [],
      editor,
      ...props
    },
    ref
  ) => {
    const renderLeaf = useMemo(() => composeLeafs(decorators), [decorators]);
    const decorate = useMemo(() => composeDecorators(decorators), [decorators]);

    useImperativeHandle(ref, () => ({
      ...editorRef.current,
      focus: () => {
        editorRef.current?.focus();
      },
      value,
    }));

    return (
      <Slate editor={editor} onChange={onEditorChange} value={editorValue}>
        <Editable
          className={classNames(props.className, 'block-editor-slate-editable')}
          aria-multiline={false}
          renderLeaf={renderLeaf}
          decorate={decorate}
          {...(props as any)}
        />
      </Slate>
    );
  }
);

export const BlockEditor = forwardRef<HTMLInputElement, BlockEditorProps>(
  (
    {
      decorators = [],
      onFocus,
      onBlur,
      error,
      value,
      onChange,
      initialFocused = false,
      editorInstanceRef,
      ...props
    },
    ref
  ) => {
    const editorRef = useRef<HTMLElement>();

    const editor = useMemo(
      () => pipe(createEditor() as ReactEditor, withReact, withSingleLine),
      []
    );

    const [focused, setIsFocused] = useState(initialFocused);

    const [didInternalChange, setDidInternalChange] = useState(false);

    const [state, setState] = useState<Descendant[]>(
      value ? textSerializeStrategy.deserialize(value) : []
    );

    const handleStateChange = useCallback(
      (newState: Descendant[]) => {
        setDidInternalChange(true);

        onChange?.(textSerializeStrategy.serialize(newState));

        setState(newState);

        setTimeout(() => setDidInternalChange(false), 50);
      },
      [onChange]
    );

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

      setState(textSerializeStrategy.deserialize(value ?? ''));
    }, [didInternalChange, value]);

    useEffect(() => {
      if (editor && editorInstanceRef) {
        setRefValue(editorInstanceRef, editor);
      }
    }, [editor, editorInstanceRef]);

    return (
      <BlockEditorProvider focused={focused} editor={editor}>
        <TextField
          {...props}
          className={classNames(props.className, 'block-editor-text-field')}
          ref={ref}
          variant={props.variant}
          onFocus={handleFocus}
          onBlur={handleBlur}
          error={error}
          value={value ?? ''}
          InputProps={{
            ...props.InputProps,
            inputProps: {
              editorRef,
              editorValue: state,
              onEditorChange: handleStateChange,
              decorators,
              editor,
            },
            inputComponent: BlockEditorField,
          }}
        />
      </BlockEditorProvider>
    );
  }
);

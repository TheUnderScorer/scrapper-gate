/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, TextField } from '@mui/material';
// eslint-disable-next-line no-restricted-imports
import type { InputBaseComponentProps } from '@mui/material/InputBase/InputBase';
import { setRefValue } from '@scrapper-gate/frontend/common';
import classNames from 'classnames';
import React, {
  ComponentType,
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
import { usePrevious } from 'react-use';
import { pipe } from 'remeda';
import { createEditor, Descendant, Editor } from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { composeDecorators } from '../../composeDecorators';
import { composeLeafs } from '../../composeLeafs';
import { getEmptyValue } from '../../getEmptyValue';
import { withSingleLine } from '../../plugins/withSingleLine';
import { textSerializeStrategy } from '../../serializeStrategies/textSerialize.strategy';
import { BlockEditorProvider } from './BlockEditor.provider';
import { BlockEditorProps, SlateProps } from './BlockEditor.types';

const BlockEditorField = forwardRef<
  HTMLElement,
  InputBaseComponentProps &
    Pick<BlockEditorProps, 'decorators' | 'name'> & {
      onEditorChange: SlateProps['onChange'];
      editorRef: MutableRefObject<HTMLElement>;
      editorValue: SlateProps['value'];
      editor: Editor;
    }
>(
  (
    {
      onEditorChange,
      editorValue,
      value,
      decorators = [],
      editor,
      editorRef,
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

    // Extended type in order to support passing name - it is used in tests
    const SlateComponent = Slate as ComponentType<
      SlateProps & {
        name?: string;
      }
    >;

    return (
      <Box
        sx={{
          '& .MuiAutocomplete-input': {
            width: '100% !important',
          },
        }}
        width="100%"
        ref={ref}
      >
        <SlateComponent
          editor={editor}
          onChange={onEditorChange}
          value={editorValue}
          name={props.name}
        >
          <Editable
            className={classNames(
              props.className,
              'block-editor-slate-editable'
            )}
            aria-multiline={false}
            renderLeaf={renderLeaf}
            decorate={decorate}
            {...(props as any)}
            readOnly={props.disabled}
          />
        </SlateComponent>
      </Box>
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
    const previousValue = usePrevious(value);

    const editorRef = useRef<HTMLElement>();

    const editor = useMemo(
      () => pipe(createEditor() as ReactEditor, withReact, withSingleLine),
      []
    );

    const [focused, setIsFocused] = useState(initialFocused);

    const [didInternalChange, setDidInternalChange] = useState(false);

    const [state, setState] = useState<Descendant[]>(
      value ? textSerializeStrategy.deserialize(value) : getEmptyValue()
    );

    const handleStateChange = useCallback(
      (newState: Descendant[]) => {
        setDidInternalChange(true);

        onChange?.(textSerializeStrategy.serialize(newState));

        setState(newState);

        setTimeout(() => setDidInternalChange(false), 100);
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
      if (didInternalChange || value === previousValue) {
        return;
      }

      if (!value) {
        setState(getEmptyValue());

        return;
      }

      const point = { path: [0, 0], offset: 0 };

      editor.selection = {
        anchor: point,
        focus: point,
      };

      setState(textSerializeStrategy.deserialize(value));
    }, [didInternalChange, editor, previousValue, value]);

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
          sx={{
            ...props.sx,
            '& .MuiInputBase-input': {
              /* Important is required because Slate applies inline styles */
              minHeight: 'auto !important',
              whiteSpace: 'nowrap !important' as 'nowrap',
            },
          }}
          InputProps={{
            ...props.InputProps,
            inputProps: {
              ...props.inputProps,
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

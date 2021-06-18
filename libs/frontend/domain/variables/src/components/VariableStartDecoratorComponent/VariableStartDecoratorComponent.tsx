import {
  TextFieldBlockDecoratorComponentProps,
  useTextFieldBlockContext,
} from '@scrapper-gate/frontend/form';
import { LightTooltip } from '@scrapper-gate/frontend/ui';
import {
  getTextVariableTemplate,
  TemplateType,
} from '@scrapper-gate/shared/common';
import { Variable } from '@scrapper-gate/shared/schema';
import { EditorState, Modifier, SelectionState } from 'draft-js';
import React, { MutableRefObject, useCallback, useMemo, useRef } from 'react';
import { VariableSuggestions } from '../VariableSuggestions/VariableSuggestions';

export const VariableStartDecoratorComponent = ({
  decoratedText,
  children,
  start,
  end,
  blockKey,
}: TextFieldBlockDecoratorComponentProps) => {
  const containerRef = useRef<HTMLElement>();

  const { editorState, focused, setEditorState } = useTextFieldBlockContext();

  const selection = editorState.getSelection();
  const selectionStart = selection.getStartOffset();
  const selectionEnd = selection.getEndOffset();

  const handleVariableClick = useCallback(
    (variable: Variable) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const selection = SelectionState.createEmpty(blockKey!).merge({
        focusOffset: end,
        anchorOffset: start,
        hasFocus: true,
      });

      const newContent = Modifier.replaceText(
        editorState.getCurrentContent(),
        selection,
        getTextVariableTemplate(variable.key, TemplateType.Braces)
      );

      const newState = EditorState.push(
        editorState,
        newContent,
        'insert-characters'
      );

      setEditorState(newState);
    },
    [blockKey, editorState, end, setEditorState, start]
  );

  const isSelectionWithinBounds = useMemo(() => {
    return selectionStart >= start && selectionEnd <= end;
  }, [end, selectionEnd, selectionStart, start]);

  return (
    <LightTooltip
      TransitionProps={{ timeout: 0 }}
      open={isSelectionWithinBounds && focused}
      title={
        <VariableSuggestions
          onVariableClick={handleVariableClick}
          text={decoratedText}
        />
      }
    >
      <span ref={containerRef as MutableRefObject<HTMLElement>}>
        {children}
      </span>
    </LightTooltip>
  );
};

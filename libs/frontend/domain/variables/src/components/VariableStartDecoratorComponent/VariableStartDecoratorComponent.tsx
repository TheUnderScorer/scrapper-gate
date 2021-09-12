import { makeStyles } from '@material-ui/styles';
import {
  DecoratorComponentProps,
  useBlockEditorContext,
} from '@scrapper-gate/frontend/block-editor';
import { LightTooltip } from '@scrapper-gate/frontend/ui';
import {
  getTextVariableTemplate,
  TemplateType,
} from '@scrapper-gate/shared/common';
import { Variable } from '@scrapper-gate/shared/schema';
import React, { MutableRefObject, useCallback, useMemo, useRef } from 'react';
import { Transforms } from 'slate';
import { VariableSuggestions } from '../VariableSuggestions/VariableSuggestions';

const useStyles = makeStyles({
  container: {
    display: 'inline-block',
  },
});

export const VariableStartDecoratorComponent = ({
  children,
  leaf,
  attributes,
}: DecoratorComponentProps) => {
  const classes = useStyles();

  const containerRef = useRef<HTMLElement>();

  const { focused, editor } = useBlockEditorContext();
  const { selection } = editor;

  const selectionStart = Number(selection?.anchor?.offset);
  const selectionEnd = Number(selection?.focus?.offset);

  const handleVariableClick = useCallback(
    (variable: Variable) => {
      if (!variable.key) {
        return;
      }

      Transforms.insertText(
        editor,
        getTextVariableTemplate(variable.key, TemplateType.Braces),
        {
          at: {
            focus: {
              path: leaf.path,
              offset: leaf.endIndex,
            },
            anchor: {
              path: leaf.path,
              offset: leaf.startIndex,
            },
          },
        }
      );
    },
    [editor, leaf]
  );

  const isSelectionWithinBounds = useMemo(() => {
    return (
      selectionStart >= Number(leaf.startIndex) &&
      selectionEnd <= Number(leaf.endIndex)
    );
  }, [leaf, selectionEnd, selectionStart]);

  return (
    <div {...attributes} className={classes.container}>
      <LightTooltip
        TransitionProps={{ timeout: 0 }}
        open={isSelectionWithinBounds && focused}
        title={
          <VariableSuggestions
            onVariableClick={handleVariableClick}
            text={leaf.text ?? ''}
          />
        }
      >
        <span ref={containerRef as MutableRefObject<HTMLElement>}>
          {children}
        </span>
      </LightTooltip>
    </div>
  );
};

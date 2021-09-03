import { ButtonGroup, IconButton, Tooltip } from '@material-ui/core';
import { RedoSharp, UndoSharp } from '@material-ui/icons';
import { useFormUndo } from '@scrapper-gate/frontend/form';
import { useKeyboardShortcuts } from '@scrapper-gate/frontend/keyboard-shortcuts';
import React from 'react';
import { TextWithKeyHint } from '../../../../ui/src/molecules/TextWithKeyHint/TextWithKeyHint';

export const UndoButtons = () => {
  const shortcuts = useKeyboardShortcuts();

  const undoMethods = useFormUndo();

  return (
    <ButtonGroup variant="outlined">
      <Tooltip
        title={
          <TextWithKeyHint keyHint={shortcuts?.undo ?? ''}>
            Undo
          </TextWithKeyHint>
        }
      >
        <span>
          <IconButton
            className="undo-btn"
            disabled={!undoMethods.canUndo}
            onClick={undoMethods.undo}
          >
            <UndoSharp />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip
        title={
          <TextWithKeyHint keyHint={shortcuts?.redo ?? ''}>
            Redo
          </TextWithKeyHint>
        }
      >
        <span>
          <IconButton
            className="redo-btn"
            disabled={!undoMethods.canRedo}
            onClick={undoMethods.redo}
          >
            <RedoSharp />
          </IconButton>
        </span>
      </Tooltip>
    </ButtonGroup>
  );
};

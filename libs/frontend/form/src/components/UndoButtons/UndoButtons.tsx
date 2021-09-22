import { ButtonGroup, IconButton, Tooltip } from '@mui/material';
import { RedoSharp, UndoSharp } from '@mui/icons-material';
import { useKeyboardShortcuts } from '@scrapper-gate/frontend/keyboard-shortcuts';
import { TextWithKeyHint } from '@scrapper-gate/frontend/ui';
import React from 'react';
import { useFormUndo } from '../../providers/FormUndo.provider';

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
            size="large">
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
            size="large">
            <RedoSharp />
          </IconButton>
        </span>
      </Tooltip>
    </ButtonGroup>
  );
};

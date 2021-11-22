import {
  Box,
  CircularProgress,
  debounce,
  FormHelperText,
  FormLabel,
  Paper,
  Stack,
} from '@mui/material';
import { first } from '@scrapper-gate/shared/common';
import { logger } from '@scrapper-gate/shared/logger/console';
import * as monaco from 'monaco-editor';
import React, { useEffect, useRef, useState } from 'react';
import { useUnmount } from 'react-use';
import type { CodeEditorProps } from './CodeEditor.types';

export const CodeEditor = ({
  additionalJsLib,
  additionalTsLib,
  onMount,
  language = 'javascript',
  onChange,
  value,
  helperText,
  label,
  onErrorChange,
  hasError,
}: CodeEditorProps) => {
  const valueRef = useRef(value);

  const [preventChange, setPreventChange] = useState(false);
  const [didOutsideChange, setDidOutsideChange] = useState(false);

  const [loaded, setLoaded] = useState(false);
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (additionalTsLib) {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        additionalTsLib
      );
    }

    if (additionalJsLib) {
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        additionalJsLib
      );
    }

    if (loaded) {
      return;
    }

    const editor = monaco.editor.create(containerRef.current, {
      language,
      automaticLayout: true,
      value,
    });

    setEditor(editor);

    setLoaded(true);

    onMount?.(editor);
  }, [
    additionalJsLib,
    additionalTsLib,
    containerRef,
    language,
    loaded,
    onMount,
    value,
  ]);

  useEffect(() => {
    valueRef.current = value;

    const model = editor?.getModel();

    if (!model || didOutsideChange) {
      return;
    }

    if (editor && value && editor.getValue() !== value) {
      logger.debug('Changing value from external source:', {
        value,
        modelValue: model.getValue(),
        editorValue: editor.getValue(),
        editorValueChanged: editor.getValue() === value,
        modelValueChanged: editor.getValue() === value,
      });

      setPreventChange(true);

      editor.setValue(value);

      setPreventChange(false);

      setDidOutsideChange(true);
    }
  }, [didOutsideChange, editor, value]);

  useEffect(() => {
    if (editor) {
      const model = editor.getModel();

      if (model) {
        const handler = debounce(() => {
          const markers = monaco.editor
            .getModelMarkers({})
            .filter(
              (marker) => marker.severity === monaco.MarkerSeverity.Error
            );

          if (onErrorChange) {
            const error =
              markers.length > 0
                ? new Error(first(markers).message)
                : undefined;

            logger.debug(`Error markers:`, {
              error,
              markers,
            });

            onErrorChange(error);
          }
        }, 1000);

        const sub = model.onDidChangeContent(handler);

        return () => {
          handler.clear();

          sub?.dispose();
        };
      }
    }

    return undefined;
  }, [editor, onErrorChange]);

  useEffect(() => {
    if (editor) {
      const model = editor.getModel();

      if (model) {
        const sub = model.onDidChangeContent(() => {
          const newValue = editor.getValue();

          if (newValue === valueRef.current || preventChange) {
            return;
          }

          onChange?.(newValue);
        });

        return () => {
          sub?.dispose();
        };
      }
    }

    return undefined;
  }, [editor, onChange, onErrorChange, preventChange]);

  useUnmount(() => {
    editor?.dispose();
  });

  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: (theme) =>
          hasError ? theme.palette.error.main : undefined,
        width: '100%',
        height: '100%',
        padding: (theme) => theme.spacing(1),
        overflow: 'visible',
      }}
    >
      <Stack
        sx={{
          height: '100%',
          width: '100%',
        }}
        direction="column"
        spacing={1}
      >
        {!loaded && <CircularProgress />}
        {label && <FormLabel>{label}</FormLabel>}
        <Box
          sx={{
            overflow: 'visible',
          }}
          width="100%"
          height="100%"
          minHeight="390px"
          className="code-editor-container"
          ref={containerRef}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </Stack>
    </Paper>
  );
};
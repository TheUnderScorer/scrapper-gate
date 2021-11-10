import { CodeEditor } from '@scrapper-gate/frontend/code-editor';
import { PopupCodeEditorParams } from '@scrapper-gate/shared/routing';
import { useRouteMatch } from 'react-router-dom';
import { usePopupCodeEditor } from './usePopupCodeEditor';

export const PopupCodeEditor = () => {
  const {
    params: { sessionId },
  } = useRouteMatch<Pick<PopupCodeEditorParams, 'sessionId'>>();

  const { editorState, handleChange, handleError } =
    usePopupCodeEditor(sessionId);

  return (
    <CodeEditor
      {...editorState?.props}
      hasError={Boolean(editorState?.error)}
      value={editorState?.value ?? ''}
      onChange={handleChange}
      onErrorChange={handleError}
    />
  );
};

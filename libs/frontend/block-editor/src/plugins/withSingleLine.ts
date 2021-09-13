import { Editor, Transforms } from 'slate';

export function withSingleLine(editor: Editor) {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0 && editor.children.length > 1) {
      Transforms.mergeNodes(editor);
    }

    return normalizeNode([node, path]);
  };

  return editor;
}

import { BaseEditor, Path, Range } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomElement = {
  type?: string;
  children?: CustomElement[];
  startIndex?: number;
  endIndex?: number;
  path?: Path;
  text?: string;
};

type CustomRange = Partial<Pick<CustomElement, 'type'>> &
  Range &
  Pick<CustomElement, 'startIndex' | 'endIndex' | 'path'>;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomElement;
    Range: CustomRange;
  }
}

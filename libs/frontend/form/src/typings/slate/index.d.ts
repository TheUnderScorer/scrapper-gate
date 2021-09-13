// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

type CustomElement = Partial<CustomText> & {
  type: string;
  children: Array<CustomText | CustomElement>;
};
type CustomText = { text: string };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

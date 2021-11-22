import { ScrapperCodeEditorProps } from '@scrapper-gate/frontend/domain/scrapper';
import { ErrorObject } from '@scrapper-gate/shared/schema';

export interface CodeEditorState {
  props: ScrapperCodeEditorProps;
  value?: string;
  error?: ErrorObject;
}

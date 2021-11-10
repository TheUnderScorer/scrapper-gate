import { TextFieldProps } from '@mui/material';
import { CodeEditorProps } from '@scrapper-gate/frontend/code-editor';
import {
  BaseNodeProperties,
  FlowBuilderFormState,
  FlowBuilderProps,
  NodeContentProps,
} from '@scrapper-gate/frontend/flow-builder';
import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import { HtmlElementPickerProps } from '@scrapper-gate/frontend/ui';
import { Perhaps } from '@scrapper-gate/shared/common';
import {
  Scrapper,
  ScrapperBuilderScrapperFragment,
  ScrapperStepInput,
  Variable,
} from '@scrapper-gate/shared/schema';
import { ComponentType } from 'react';
import { Node } from 'react-flow-renderer';
import { RunScrapperDialogProps } from '../RunScrapperDialog/RunScrapperDialog.types';

export interface ScrapperElementPickerProps
  extends Pick<NodeContentProps, 'nodeIndex'> {
  disabled?: boolean;
  elementsValidator?: HtmlElementPickerProps['elementsValidator'];
  fieldNameCreator: FieldNameCreator;
  label?: string;
  name?: string;
  variant?: TextFieldProps['variant'];
  onElements?: (elements: HTMLElement[]) => unknown;
}

export interface ScrapperCodeEditorProps
  extends Omit<CodeEditorProps, 'onChange' | 'value' | 'onMount'> {
  name: string;
  initialValue?: string;
}

export type ScrapperBuilderNode = Node<ScrapperBuilderNodeProperties>;

export type ScrapperBuilderNodeProperties = BaseNodeProperties &
  Omit<ScrapperStepInput, 'id' | 'action' | 'waitDuration'> &
  Pick<Partial<ScrapperStepInput>, 'id' | 'action'>;

export type ScrapperElementPicker = ComponentType<ScrapperElementPickerProps>;
export type ScrapperCodeEditor = ComponentType<ScrapperCodeEditorProps>;

export interface ScrapperBuilderProps
  extends Pick<
      FlowBuilderProps,
      'onClose' | 'renderItemsInDataAttribute' | 'onChange' | 'loading'
    >,
    Pick<RunScrapperDialogProps, 'runUrlCreator'> {
  initialScrapper?: ScrapperBuilderScrapperFragment;
  ElementPicker: ScrapperElementPicker;
  CodeEditor: ScrapperCodeEditor;
  browserUrl?: Perhaps<string>;
}

export interface ScrapperStepFormProps
  extends Pick<ScrapperBuilderProps, 'ElementPicker' | 'CodeEditor'>,
    Pick<NodeContentProps, 'nodeIndex'> {
  fieldNameCreator: FieldNameCreator;
}

export interface ScrapperBuilderFormState
  extends FlowBuilderFormState<ScrapperBuilderNodeProperties>,
    Pick<Scrapper, 'runSettings'> {
  name: string;
  variables: Variable[];
}

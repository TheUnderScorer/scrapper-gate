import { TextFieldProps } from '@material-ui/core';
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
  Variable,
} from '@scrapper-gate/shared/schema';
import { ComponentType } from 'react';
import { Node } from 'react-flow-renderer';
import { ScrapperBuilderStep } from '../../shared/types';
import { RunScrapperDialogProps } from '../RunScrapperDialog/RunScrapperDialog.types';

export interface ScrapperElementPickerProps
  extends Pick<NodeContentProps, 'nodeIndex'> {
  disabled?: boolean;
  elementsValidator?: HtmlElementPickerProps['elementsValidator'];
  fieldNameCreator: FieldNameCreator;
  label?: string;
  name?: string;
  variant?: TextFieldProps['variant'];
}

export type ScrapperBuilderNode = Node<ScrapperBuilderNodeProperties>;

export type ScrapperBuilderNodeProperties = BaseNodeProperties &
  Omit<ScrapperBuilderStep, 'id' | 'action'> &
  Pick<Partial<ScrapperBuilderStep>, 'id' | 'action'>;

export type ScrapperElementPicker = ComponentType<ScrapperElementPickerProps>;

export interface ScrapperBuilderProps
  extends Pick<
      FlowBuilderProps,
      'onClose' | 'renderItemsInDataAttribute' | 'onChange' | 'loading'
    >,
    Pick<RunScrapperDialogProps, 'runUrlCreator'> {
  initialScrapper?: ScrapperBuilderScrapperFragment;
  ElementPicker: ScrapperElementPicker;
  browserUrl?: Perhaps<string>;
}

export interface ScrapperStepFormProps
  extends Pick<ScrapperBuilderProps, 'ElementPicker'>,
    Pick<NodeContentProps, 'nodeIndex'> {
  fieldNameCreator: FieldNameCreator;
}

export interface ScrapperBuilderFormState
  extends FlowBuilderFormState<ScrapperBuilderNodeProperties>,
    Pick<Scrapper, 'runSettings'> {
  name: string;
  variables: Variable[];
}

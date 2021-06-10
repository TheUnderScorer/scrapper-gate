import { TextFieldProps } from '@material-ui/core';
import { Scrapper, ScrapperStep, Variable } from '@scrapper-gate/shared/schema';
import { ComponentType } from 'react';
import {
  BaseNodeProperties,
  BaseNodeSelectionProperties,
  FlowBuilderFormState,
  FlowBuilderProps,
  HtmlElementPickerProps,
  NodeContentProps,
} from '@scrapper-gate/frontend/ui';
import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import { Node } from 'react-flow-renderer';

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

export type ScrapperBuilderNodeSelection = BaseNodeSelectionProperties &
  Omit<ScrapperBuilderStep, 'id'>;

export type ScrapperBuilderNodeProperties = BaseNodeProperties &
  ScrapperBuilderStep;

export interface ScrapperBuilderStep
  extends Omit<
    ScrapperStep,
    | 'nextStep'
    | 'createdBy'
    | 'updatedAt'
    | 'createdAt'
    | 'previousSteps'
    | 'stepOnFalse'
    | 'stepOnTrue'
  > {
  nextStep?: Pick<ScrapperStep, 'id'>;
  previousSteps?: Pick<ScrapperStep, 'id'>[];
  stepOnTrue?: Pick<ScrapperStep, 'id'>;
  stepOnFalse?: Pick<ScrapperStep, 'id'>;
}

export interface ScrapperBuilderScrapper
  extends Omit<Scrapper, 'results' | 'createdBy' | 'steps'> {
  steps?: ScrapperBuilderStep[];
}

export type ScrapperElementPicker = ComponentType<ScrapperElementPickerProps>;

export interface ScrapperBuilderProps
  extends Pick<
    FlowBuilderProps,
    'onClose' | 'renderItemsInDataAttribute' | 'onChange'
  > {
  initialScrapper?: ScrapperBuilderScrapper;
  ElementPicker: ScrapperElementPicker;
  loading?: boolean;
  browserUrl: string;
}

export interface ScrapperStepFormProps
  extends Pick<ScrapperBuilderProps, 'ElementPicker'>,
    Pick<NodeContentProps, 'nodeIndex'> {
  fieldNameCreator: FieldNameCreator;
}

export interface ScrapperBuilderFormState
  extends FlowBuilderFormState<ScrapperBuilderNodeProperties> {
  name: string;
  variables: Variable[];
}

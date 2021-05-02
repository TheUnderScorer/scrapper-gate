import { Scrapper, ScrapperStep } from '@scrapper-gate/shared/schema';
import { ComponentType } from 'react';
import {
  BaseNodeProperties,
  BaseNodeSelectionProperties,
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

export interface ScrapperBuilderProps {
  initialScrapper?: ScrapperBuilderScrapper;
  onClose?: () => unknown;
  ElementPicker: ComponentType<ScrapperElementPickerProps>;
  loading?: boolean;
  browserUrl: string;
}

export interface ScrapperStepFormProps
  extends Pick<ScrapperBuilderProps, 'ElementPicker'>,
    Pick<NodeContentProps, 'nodeIndex'> {
  fieldNameCreator: FieldNameCreator;
}

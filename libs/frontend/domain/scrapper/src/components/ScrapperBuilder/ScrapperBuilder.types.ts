import { Scrapper, ScrapperStep } from '@scrapper-gate/shared/schema';
import { ComponentType } from 'react';
import {
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

export interface ScrapperBuilderNodeProperties
  extends BaseNodeSelectionProperties,
    Omit<
      ScrapperStep,
      'createdBy' | 'scrapper' | 'createdAt' | 'updatedAt' | 'id' | 'index'
    > {
  id?: string;
}

export interface ScrapperBuilderStep
  extends Omit<ScrapperStep, 'nextStep' | 'createdBy'> {
  nextStep?: Pick<ScrapperStep, 'id'>;
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

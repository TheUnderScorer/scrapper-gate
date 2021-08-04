import { ApolloError } from '@apollo/client';
import {
  BaseNodeProperties,
  FlowBuilderFormState,
  FlowBuilderProps,
} from '@scrapper-gate/frontend/ui';
import { Exists } from '@scrapper-gate/shared/common';
import {
  RouteCreator,
  ScrapperRouteParams,
} from '@scrapper-gate/shared/routing';
import { GetMyScrapperRunQuery } from '@scrapper-gate/shared/schema';
import { Node } from 'react-flow-renderer';

export interface ScrapperRunProps extends Pick<FlowBuilderProps, 'onClose'> {
  runId: string;
  onQueryError?: (error: ApolloError) => unknown;
  scrapperUrlCreator: RouteCreator<ScrapperRouteParams>;
}

export type ScrapperRunNode = Node<ScrapperRunNodeProperties>;

export type ScrapperRunNodeProperties = BaseNodeProperties & {
  runResult?: Exists<Exists<ScrapperRunFlowBuilder>['results']>[number];
};

export type ScrapperRunFormState =
  FlowBuilderFormState<ScrapperRunNodeProperties>;

export type ScrapperRunFlowBuilder = GetMyScrapperRunQuery['getMyScrapperRun'];

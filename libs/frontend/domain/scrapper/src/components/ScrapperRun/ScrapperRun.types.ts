import { ApolloError } from '@apollo/client';
import { FetchPolicyProps } from '@scrapper-gate/frontend/common';
import {
  BaseNodeProperties,
  FlowBuilderFormState,
  FlowBuilderProps,
} from '@scrapper-gate/frontend/flow-builder';
import { Exists } from '@scrapper-gate/shared/common';
import {
  RouteCreator,
  ScrapperRouteParams,
} from '@scrapper-gate/shared/routing';
import {
  GetMyScrapperRunQuery,
  Scrapper,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';
import { Node } from 'react-flow-renderer';

export interface ScrapperRunProps
  extends Pick<FlowBuilderProps, 'onClose'>,
    FetchPolicyProps {
  runId: string;
  onQueryError?: (error: ApolloError) => unknown;
  scrapperUrlCreator: RouteCreator<ScrapperRouteParams>;
}

export type ScrapperRunStep = Pick<ScrapperStep, 'id'>;

export type ScrapperRunNode = Node<ScrapperRunNodeProperties>;

export type ScrapperRunNodeProperties = BaseNodeProperties & {
  runResult?: Exists<Exists<ScrapperRunFlowBuilder>['results']>[number];
};

export interface ScrapperRunScrapper extends Pick<Scrapper, 'id'> {
  steps?: ScrapperRunStep[];
}

export interface ScrapperRunFormState
  extends FlowBuilderFormState<ScrapperRunNodeProperties> {
  scrapper?: ScrapperRunScrapper;
}

export type ScrapperRunFlowBuilder = GetMyScrapperRunQuery['getMyScrapperRun'];

import { RouteParams } from './route';

export interface ReturnableRoute {
  returnUrl?: string;
}

export interface RunResultRouteParams extends RouteParams, ReturnableRoute {
  runId: string;
}

export interface ScrapperRouteParams extends RouteParams, ReturnableRoute {
  scrapperId: string;
  stepId?: string;
}

export type RouteCreator<Params extends RouteParams> = (
  params?: Params
) => string;

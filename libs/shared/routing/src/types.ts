import { RouteParams } from './route';

export interface RunResultRouteParams extends RouteParams {
  runId: string;
}

export interface ScrapperRouteParams extends RouteParams {
  scrapperId: string;
}

export type RouteCreator<Params extends RouteParams> = (
  params?: Params
) => string;

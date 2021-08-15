import {
  applyVariablesToText,
  TemplateType,
} from '@scrapper-gate/shared/common';
import { RouteCreator } from './types';

export interface RouteParams {
  [key: string]: string | number | boolean | undefined;
}

export const paramRoute =
  <Params extends RouteParams>(
    route: string,
    defaults?: Partial<Params>
  ): RouteCreator<Params> =>
  (params?: Params) => {
    const allParams = {
      ...defaults,
      ...params,
    };

    if (!params) {
      return route.split('?')[0];
    }

    return applyVariablesToText(route, allParams, TemplateType.Colon).replace(
      /:\w+/g,
      ''
    );
  };

export type ParamRouteResult = ReturnType<typeof paramRoute>;

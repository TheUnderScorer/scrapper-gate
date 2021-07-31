import {
  applyVariablesToText,
  TemplateType,
} from '@scrapper-gate/shared/common';

export interface RouteParams {
  [key: string]: string | number | boolean | undefined;
}

export const paramRoute =
  <Params extends RouteParams>(route: string, defaults?: Params) =>
  (params?: Params) => {
    const allParams = {
      ...defaults,
      ...params,
    };

    if (!params) {
      return route.split('?')[0];
    }

    return applyVariablesToText(route, allParams, TemplateType.Colon);
  };

export type ParamRouteResult = ReturnType<typeof paramRoute>;

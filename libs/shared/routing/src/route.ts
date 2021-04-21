import {
  applyVariablesToText,
  TemplateType,
} from '@scrapper-gate/shared/common';

export const paramRoute = <
  Params extends Record<string, string | number | boolean>
>(
  route: string
) => (params?: Params) => {
  if (!params) {
    return route.split('?')[0];
  }

  return applyVariablesToText(route, params, TemplateType.Dot);
};

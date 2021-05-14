/* eslint-disable @typescript-eslint/ban-ts-comment */

export const getAssetsMap = {
  // @ts-ignore
  notFoundSolid: () => import('./not found_solid III.svg'),
};

export type Assets = keyof typeof getAssetsMap;

export enum AssetReturnType {
  String = 'String',
  SvgComponent = 'SvgComponent',
}

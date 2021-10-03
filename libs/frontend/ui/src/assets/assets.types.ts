/* eslint-disable @typescript-eslint/ban-ts-comment */

// TODO Figure out the types issue in other libs
export const getAssetsMap = {
  // @ts-ignore
  notFoundSolid: () => import('./not found_solid III.svg'),
};

export type Assets = keyof typeof getAssetsMap;

export enum AssetReturnType {
  String = 'String',
  SvgComponent = 'SvgComponent',
}

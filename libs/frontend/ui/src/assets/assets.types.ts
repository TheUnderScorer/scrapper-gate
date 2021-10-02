export const getAssetsMap = {
  notFoundSolid: () => import('./not found_solid III.svg'),
};

export type Assets = keyof typeof getAssetsMap;

export enum AssetReturnType {
  String = 'String',
  SvgComponent = 'SvgComponent',
}

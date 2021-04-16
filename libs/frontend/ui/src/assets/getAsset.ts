import { Assets, getAssetsMap } from './assets.types';

export const getAsset = (asset: Assets) => {
  return getAssetsMap[asset]();
};

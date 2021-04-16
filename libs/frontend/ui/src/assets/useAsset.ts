import { AssetReturnType, Assets } from './assets.types';
import { useState } from 'react';
import { useMount } from 'react-use';
import { getAsset } from '@scrapper-gate/frontend/ui';
import { SvgComponent } from '@scrapper-gate/frontend/common';

export interface UseAssetResult<T> {
  loading: boolean;
  asset: T;
  alt: string;
}

export function useAsset(assetToGet: Assets): UseAssetResult<string>;

export function useAsset(
  assetToGet: Assets,
  type: AssetReturnType.String
): UseAssetResult<string>;

export function useAsset(
  assetToGet: Assets,
  type: AssetReturnType.SvgComponent
): UseAssetResult<SvgComponent>;

export function useAsset(
  assetToGet: Assets,
  type: AssetReturnType = AssetReturnType.String
): UseAssetResult<SvgComponent | string> {
  const [asset, setAsset] = useState<SvgComponent | string>();
  const [loading, setLoading] = useState(true);

  useMount(() => {
    getAsset(assetToGet).then((item) => {
      setAsset(
        type === AssetReturnType.String ? item.default : item.ReactComponent
      );
      setLoading(false);
    });
  });

  return {
    asset,
    loading,
    alt: assetToGet,
  };
}

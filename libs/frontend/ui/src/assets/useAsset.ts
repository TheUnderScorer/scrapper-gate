import { SvgComponent } from '@scrapper-gate/frontend/common';
import { Perhaps } from '@scrapper-gate/shared/common';
import { useState } from 'react';
import { useMount } from 'react-use';
import { AssetReturnType, Assets } from './assets.types';
import { getAsset } from './getAsset';

export interface UseAssetResult<T> {
  loading: boolean;
  asset?: T;
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
  const [asset, setAsset] = useState<Perhaps<SvgComponent | string>>();
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
    asset: asset ?? undefined,
    loading,
    alt: assetToGet,
  };
}

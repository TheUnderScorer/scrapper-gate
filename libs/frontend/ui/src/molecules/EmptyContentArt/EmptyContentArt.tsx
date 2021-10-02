import { Fab } from '@mui/material';
import { Centered, Image, InformationBox } from '@scrapper-gate/frontend/ui';
import { useAsset } from '../../assets/useAsset';
import React from 'react';
import { EmptyContentArtProps } from './EmptyContentArt.types';

export const EmptyContentArt = ({
  onCreate,
  sx,
  createText,
  ...rest
}: EmptyContentArtProps) => {
  const { asset, alt } = useAsset('notFoundSolid');

  return (
    <Centered
      direction="column"
      sx={{
        backgroundColor: (theme) => theme.palette.primary.light,
      }}
    >
      <Image alt={alt} src={asset} />
      <InformationBox
        {...rest}
        spacing={2}
        sx={{
          marginTop: (theme) => theme.spacing(2),
        }}
        action={
          <Fab onClick={onCreate} color="primary" variant="extended">
            {createText}
          </Fab>
        }
      />
    </Centered>
  );
};

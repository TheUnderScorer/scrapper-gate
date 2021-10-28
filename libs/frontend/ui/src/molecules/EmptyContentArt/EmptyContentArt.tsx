import { Fab } from '@mui/material';
import { useAsset } from '../../assets/useAsset';
import React from 'react';
import { EmptyContentArtProps } from './EmptyContentArt.types';
import { Centered } from '../../atoms/Centered/Centered';
import { InformationBox } from '../InformationBox/InformationBox';
import { Image } from '../../atoms/Image/Image';

export const EmptyContentArt = ({
  onCreate,
  sx,
  createText,
  id,
  ...rest
}: EmptyContentArtProps) => {
  const { asset, alt } = useAsset('notFoundSolid');

  return (
    <Centered
      id={id}
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
          <Fab
            className="create-fab"
            onClick={onCreate}
            color="primary"
            variant="extended"
          >
            {createText}
          </Fab>
        }
      />
    </Centered>
  );
};

import { Language, Web } from '@mui/icons-material';
import { ScrapperType } from '@scrapper-gate/shared/schema';
import React from 'react';

export const scrapperTypeIconMap = {
  [ScrapperType.Simple]: <Web />,
  [ScrapperType.RealBrowser]: <Language />,
};

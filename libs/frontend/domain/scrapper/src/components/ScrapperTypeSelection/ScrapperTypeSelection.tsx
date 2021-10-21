import { Selection } from '@scrapper-gate/frontend/common';
import { RadioGroup } from '@scrapper-gate/frontend/ui';
import { ScrapperType } from '@scrapper-gate/shared/schema';
import React from 'react';
import { scrapperTypeIconMap } from '../../dictionary/scrapperTypeIconMap';

export interface ScrapperTypeSelectionProps {
  name: string;
}

export const scrapperTypeSelectionOptions: Selection[] = [
  {
    label: 'Simple',
    icon: scrapperTypeIconMap[ScrapperType.Simple],
    description: `Site is accessed via simple HTTP request. Data is scrapped very quickly, but no user interactions are supported.

      Recommended for: blogs, articles.`,
    value: ScrapperType.Simple,
  },
  {
    label: 'Real browser',
    icon: scrapperTypeIconMap[ScrapperType.RealBrowser],
    description: `Site is accessed via real browser. Data is scrapped more slowly, but all user interactions are supported.

      Recommended for: sites that require authorized access, web apps.`,
    value: ScrapperType.RealBrowser,
  },
];

export const ScrapperTypeSelection = ({ name }: ScrapperTypeSelectionProps) => {
  return (
    <RadioGroup
      radioProps={{
        width: 350,
        height: 250,
        checkedBackgroundColor: 'primary',
      }}
      name={name}
      options={scrapperTypeSelectionOptions}
    />
  );
};

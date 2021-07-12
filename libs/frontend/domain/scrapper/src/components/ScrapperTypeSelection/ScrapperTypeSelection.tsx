import { Language, Web } from '@material-ui/icons';
import { Selection } from '@scrapper-gate/frontend/common';
import { ScrapperType } from '@scrapper-gate/shared/schema';
import { RadioGroup } from '@scrapper-gate/frontend/ui';
import React from 'react';

export interface ScrapperTypeSelectionProps {
  name: string;
}

const options: Selection[] = [
  {
    label: 'Simple',
    icon: <Web fontSize="large" />,
    description: `Site is accessed via simple HTTP request. Data is scrapped very quickly, but no user interactions are supported.

      Recommended for: blogs, articles.`,
    value: ScrapperType.Simple,
  },
  {
    label: 'Real browser',
    icon: <Language fontSize="large" />,
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
      options={options}
    />
  );
};

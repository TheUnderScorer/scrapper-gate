import { Selection } from '@scrapper-gate/frontend/common';
import { ScrapperType } from '@scrapper-gate/shared/schema';
import React from 'react';

export interface ScrapperTypeSelectionProps {
  name: string;
}

const _options: Selection[] = [
  {
    label: 'Simple',
    value: ScrapperType.Simple,
  },
  {
    label: 'Real browser',
    value: ScrapperType.RealBrowser,
  },
];

export const ScrapperTypeSelection = ({
  name: _name,
}: ScrapperTypeSelectionProps) => {
  return null;
};

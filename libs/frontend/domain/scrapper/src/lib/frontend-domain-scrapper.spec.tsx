import React from 'react';
import { render } from '@testing-library/react';

import FrontendDomainScrapper from './frontend-domain-scrapper';

describe('FrontendDomainScrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrontendDomainScrapper />);
    expect(baseElement).toBeTruthy();
  });
});

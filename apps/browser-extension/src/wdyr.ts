import { logger } from '@scrapper-gate/shared/logger/console';
import { Environment, getEnvironment } from '@scrapper-gate/shared/common';
import React from 'react';

const useWdyr = false;

if (useWdyr && getEnvironment() === Environment.Development) {
  logger.debug('Setting up wdyr...');

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require('@welldone-software/why-did-you-render');

  whyDidYouRender(React, {
    trackAllPureComponents: true,
    collapseGroups: true,
  });

  logger.debug('Wdyr ready!');
}

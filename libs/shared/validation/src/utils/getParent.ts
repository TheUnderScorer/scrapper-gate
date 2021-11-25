import { first } from '@scrapper-gate/shared/common';
import joi from 'joi';

export const getParent = <T>(helpers: joi.CustomHelpers) =>
  first(helpers.state.ancestors) as T;

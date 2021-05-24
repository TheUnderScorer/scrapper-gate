import {
  getTextVariableTemplate,
  TemplateType,
} from '@scrapper-gate/shared/common';
import { VariableTemplate } from './types';

export const generateVariableKeyTemplate = (key: string) =>
  getTextVariableTemplate(key, TemplateType.Braces) as VariableTemplate;

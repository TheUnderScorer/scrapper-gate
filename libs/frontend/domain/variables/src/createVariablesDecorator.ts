import { regexDecoratorStrategy } from '@scrapper-gate/frontend/form';
import { variableRegex } from '@scrapper-gate/shared/domain/variables';
import { CompositeDecorator } from 'draft-js';
import { VariableDecoratorContent } from './components/VariableDecoratorContent/VariableDecoratorContent';
import { VariableStartDecoratorComponent } from './components/VariableStartDecoratorComponent/VariableStartDecoratorComponent';

export const createVariablesDecorator = () =>
  new CompositeDecorator([
    {
      strategy: regexDecoratorStrategy(variableRegex),
      component: VariableDecoratorContent,
    },
    {
      strategy: regexDecoratorStrategy(/{([^)][a-zA-Z]*)/g),
      component: VariableStartDecoratorComponent,
    },
  ]);

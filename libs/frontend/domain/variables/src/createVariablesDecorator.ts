import { regexDecoratorStrategy } from '@scrapper-gate/frontend/form';
import { CompositeDecorator } from 'draft-js';
import { VariableDecoratorContent } from './components/VariableDecoratorContent/VariableDecoratorContent';
import { VariableStartDecoratorComponent } from './components/VariableStartDecoratorComponent/VariableStartDecoratorComponent';

export const createVariablesDecorator = () =>
  new CompositeDecorator([
    {
      strategy: regexDecoratorStrategy(/{{([^}]+)}}/g),
      component: VariableDecoratorContent,
    },
    {
      strategy: regexDecoratorStrategy(/{([^)][a-zA-Z]*)/g),
      component: VariableStartDecoratorComponent,
    },
  ]);

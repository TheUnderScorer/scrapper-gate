import { Decorator } from '@scrapper-gate/frontend/block-editor';
import {
  variableRegex,
  variableStartRegex,
} from '@scrapper-gate/shared/domain/variables';
import { VariableDecoratorContent } from './components/VariableDecoratorContent/VariableDecoratorContent';
import { VariableStartDecoratorComponent } from './components/VariableStartDecoratorComponent/VariableStartDecoratorComponent';

export const createVariablesDecorators = () => [
  new Decorator(variableRegex, 'variable', VariableDecoratorContent),
  new Decorator(
    variableStartRegex,
    'variableStart',
    VariableStartDecoratorComponent
  ),
];

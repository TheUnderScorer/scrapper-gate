import { ComponentType } from 'react';
import { RenderLeafProps } from 'slate-react';

export type DecoratorComponentProps = RenderLeafProps;

export type DecoratorComponent = ComponentType<DecoratorComponentProps>;

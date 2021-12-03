import { RenderLeafProps } from 'slate-react';
import { Decorator } from './Decorator';

export const composeLeafs =
  (decorators: Decorator[]) => (props: RenderLeafProps) => {
    for (const decorator of decorators) {
      const result = decorator.renderLeaf(props);

      if (result) {
        return result;
      }
    }

    console.log({
      attributes: props.attributes,
      children: props.children,
    });

    return <span {...props.attributes}>{props.children}</span>;
  };

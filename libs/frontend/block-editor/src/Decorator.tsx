import { matchAll } from '@scrapper-gate/shared/common';
import { Element, NodeEntry, Range } from 'slate';
import { RenderLeafProps } from 'slate-react/dist/components/editable';
import { DecoratorComponent } from './Decorator.types';

export class Decorator {
  constructor(
    private readonly regex: RegExp,
    private readonly type: string,
    private readonly Component: DecoratorComponent
  ) {}

  decorate([entry, path]: NodeEntry, range: Range[] = []) {
    const { regex, type } = this;

    if (!('text' in entry)) {
      return range;
    }

    const matches = matchAll(entry?.text ?? '', regex);

    matches.forEach((match) => {
      if (!match) {
        return;
      }

      const [startMatch] = match;

      const { index: startIndex } = match;
      const endIndex = Number(startIndex) + startMatch.length;

      range.push({
        type,
        startIndex,
        path,
        endIndex,
        anchor: { path, offset: startIndex },
        focus: { path, offset: endIndex },
      });
    });

    return range;
  }

  renderLeaf(props: RenderLeafProps) {
    const { Component, type } = this;
    const { leaf } = props;

    if ((leaf as Element).type === type) {
      return <Component {...props} />;
    }

    return null;
  }
}

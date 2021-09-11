import { ChangeEvent } from 'react';
import { textSerializeStrategy } from '../../libs/frontend/block-editor/src/serializeStrategies/textSerialize.strategy';

export const mockSlate = () => {
  const actual = require('slate-react');

  Object.assign(actual, {
    Slate: jest.fn((props) => {
      const modifiedOnchange = (e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        const newValue = textSerializeStrategy.deserialize(text);

        props.onChange(newValue);
      };

      return (
        <input
          name={props.name}
          id={props.id}
          className={`editor ${props.className}`}
          onChange={(e) => modifiedOnchange(e)}
        />
      );
    }),
  });

  return actual;
};

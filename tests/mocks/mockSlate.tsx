import { ChangeEvent } from 'react';
import { createTextSerializeStrategy } from '../../libs/frontend/block-editor/src/serializeStrategies/textSerialize.strategy';

const textStrategy = createTextSerializeStrategy();

export const mockSlate = () => {
  const actual = require('slate-react');

  Object.assign(actual, {
    Slate: jest.fn((props) => {
      const modifiedOnchange = (e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        const newValue = textStrategy.deserialize(text);

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

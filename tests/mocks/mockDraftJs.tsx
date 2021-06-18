import { ChangeEvent } from 'react';

export const mockDraftJs = () => {
  const actual = require('draft-js');

  actual.Editor = jest.fn((props) => {
    const modifiedOnchange = (e: ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      const content = actual.ContentState.createFromText(text);
      props.onChange(actual.EditorState.createWithContent(content));
    };

    return (
      <input
        name={props.name}
        id={props.id}
        className={`editor ${props.className}`}
        onChange={(e) => modifiedOnchange(e)}
      />
    );
  });

  return actual;
};

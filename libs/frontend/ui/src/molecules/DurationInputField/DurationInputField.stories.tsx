import 'reflect-metadata';
import { Duration } from '@scrapper-gate/shared/common';
import { useState } from 'react';
import { DurationInputField } from './DurationInputField';

export default {
  title: 'UI/Duration Input Field',
};

export const Component = () => {
  const [value, setValue] = useState(Duration.fromMinutes(60));

  return (
    <>
      <DurationInputField label="Duration" value={value} onChange={setValue} />
      <pre>{JSON.stringify(value, null, ' ')}</pre>
    </>
  );
};

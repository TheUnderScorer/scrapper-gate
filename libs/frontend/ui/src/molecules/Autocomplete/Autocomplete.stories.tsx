import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Autocomplete } from './Autocomplete';

export default {
  title: 'UI/Autocomplete',
};

const options = ['Test', 'Another'];

export const Component = () => {
  const [value, setValue] = useState<string | undefined>('');

  return (
    <Stack spacing={2}>
      <Autocomplete
        freeSolo
        options={options}
        onInputChange={(event, value) => setValue(value)}
        inputValue={value}
      />
      <Typography>
        Value: <strong>{value}</strong>
      </Typography>
    </Stack>
  );
};

import { useState } from 'react';

export const useConst = <T>(value: () => T) => {
  const [state] = useState(value());

  return state;
};

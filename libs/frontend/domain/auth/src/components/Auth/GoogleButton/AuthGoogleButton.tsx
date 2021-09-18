import React from 'react';
import { Fab } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export const AuthGoogleButton = () => {
  return (
    <Fab size="small">
      <FontAwesomeIcon icon={faGoogle} />
    </Fab>
  );
};

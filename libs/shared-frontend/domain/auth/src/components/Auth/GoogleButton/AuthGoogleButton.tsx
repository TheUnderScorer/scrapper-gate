import React from 'react';
import { Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export const AuthGoogleButton = () => {
  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={<FontAwesomeIcon icon={faGoogle} />}
    >
      Continue with google
    </Button>
  );
};

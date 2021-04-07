import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';

const useStyles = makeStyles(() => ({
  btn: {
    backgroundColor: '#3B5998',
    color: 'rgba(255,255,255,0.9)',
  },
}));

export const AuthFacebookButton = () => {
  const classes = useStyles();

  return (
    <Button
      fullWidth
      startIcon={<FontAwesomeIcon icon={faFacebookF} />}
      variant="contained"
      color="primary"
      className={classes.btn}
    >
      Continue with facebook
    </Button>
  );
};

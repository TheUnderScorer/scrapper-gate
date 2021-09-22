import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fab } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const PREFIX = 'AuthFacebookButton';

const classes = {
  btn: `${PREFIX}-btn`,
};

const StyledFab = styled(Fab)(() => ({
  [`&.${classes.btn}`]: {
    backgroundColor: '#3B5998',
    color: 'rgba(255,255,255,0.9)',
  },
}));

export const AuthFacebookButton = () => {
  return (
    <StyledFab size="small" className={classes.btn}>
      <FontAwesomeIcon icon={faFacebookF} />
    </StyledFab>
  );
};

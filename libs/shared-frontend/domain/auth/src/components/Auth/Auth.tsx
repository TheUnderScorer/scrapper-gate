import React from 'react';
import { Emoji } from '@scrapper-gate/shared-frontend/ui';
import {
  Box,
  Divider,
  Grid,
  makeStyles,
  Stack,
  Typography,
} from '@material-ui/core';
import { AuthFacebookButton } from './FacebookButton/AuthFacebookButton';
import { AuthGoogleButton } from './GoogleButton/AuthGoogleButton';
import { LoginForm, LoginFormProps } from '../LoginForm/LoginForm';
import { Route, useRouteMatch } from 'react-router-dom';

export type AuthProps = Pick<LoginFormProps, 'afterLogin'>;

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 0,
    height: '100%',
  },
  stack: {
    flex: 1,
    padding: `0 ${theme.spacing(2)}`,
  },
  box: {
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
    color: theme.palette.primary.contrastText,
    padding: `${theme.spacing(5)} 0`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const Auth = ({ afterLogin }: AuthProps) => {
  const classes = useStyles();
  const match = useRouteMatch();

  const signupUrl = `${match.path}/sign-up`;

  return (
    <Grid className={classes.container} direction="column" container>
      <Box width="100%" className={classes.box}>
        <Typography variant="h5">
          <Emoji>
            Sign in to <strong>Scrapper Gate</strong> 🚀
          </Emoji>
        </Typography>
      </Box>
      <Route path={match.path} exact>
        <Stack
          className={classes.stack}
          justifyContent="center"
          alignItems="center"
          direction="column"
          spacing={2}
        >
          <LoginForm afterLogin={afterLogin} signupUrl={signupUrl} />
          <Box width="100%">
            <Divider variant="fullWidth">OR</Divider>
          </Box>
          <Stack direction="row" spacing={2} justifyContent="center">
            <AuthFacebookButton />
            <AuthGoogleButton />
          </Stack>
        </Stack>
      </Route>
      <Route path={signupUrl}>Sign up</Route>
    </Grid>
  );
};

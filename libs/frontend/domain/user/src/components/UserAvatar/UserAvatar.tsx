import { Avatar, Box, Stack, StackProps, Typography } from '@mui/material';
import { User } from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import React, { useMemo } from 'react';

export interface UserAvatarProps
  extends Pick<StackProps, 'justifyContent' | 'alignItems' | 'sx'> {
  user: Pick<User, 'email' | 'firstName' | 'lastName'>;
  className?: string;
  showName?: boolean;
}

export const UserAvatar = ({
  user,
  className,
  showName,
  justifyContent = 'center',
  alignItems = 'center',
  sx,
}: UserAvatarProps) => {
  const display = useMemo(() => {
    if (!user.firstName || !user.lastName) {
      return user.email[0];
    }

    return `${user.firstName[0]}${user.lastName[0]}`;
  }, [user]);

  return (
    <Stack
      className={classNames(className, 'user-avatar')}
      justifyContent={justifyContent}
      alignItems={alignItems}
      sx={sx}
    >
      <Avatar>{display}</Avatar>
      {showName && (
        <Box className="user-welcome" mt={1}>
          <Typography variant="subtitle2">
            {user.firstName && user.lastName ? (
              <>
                Hi,{' '}
                <strong>
                  {user.firstName} {user.lastName}
                </strong>{' '}
                👋
              </>
            ) : (
              user.email
            )}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

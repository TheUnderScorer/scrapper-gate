import React, { useMemo } from 'react';
import { Avatar, Box, Stack, StackProps, Typography } from '@material-ui/core';
import { User } from '@scrapper-gate/shared/schema';

export interface UserAvatarProps
  extends Pick<StackProps, 'justifyContent' | 'alignItems'> {
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
}: UserAvatarProps) => {
  const display = useMemo(() => {
    if (!user.firstName || !user.lastName) {
      return user.email[0];
    }

    return `${user.firstName[0]}${user.lastName[0]}`;
  }, [user]);

  return (
    <Stack
      className={className}
      justifyContent={justifyContent}
      alignItems={alignItems}
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

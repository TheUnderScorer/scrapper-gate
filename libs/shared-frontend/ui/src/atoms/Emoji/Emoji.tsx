import React, { PropsWithChildren } from 'react';
import emoji from 'react-easy-emoji';

export interface EmojiProps {
  className?: string;
}

export const Emoji = ({
  className,
  children,
}: PropsWithChildren<EmojiProps>) => {
  return (
    <span className={className}>
      {emoji(children, {
        baseUrl: 'https://twemoji.maxcdn.com/2/svg/',
        ext: '.svg',
        size: '',
      })}
    </span>
  );
};

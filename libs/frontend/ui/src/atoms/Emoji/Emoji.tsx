import React, { PropsWithChildren } from 'react';
import emoji from 'react-easy-emoji';
import classNames from 'classnames';

export interface EmojiProps {
  className?: string;
}

export const Emoji = ({
  className,
  children,
}: PropsWithChildren<EmojiProps>) => {
  return (
    <span className={classNames(className, 'emoji')}>
      {emoji(children, {
        baseUrl: 'https://twemoji.maxcdn.com/2/svg/',
        ext: '.svg',
        size: '',
      })}
    </span>
  );
};

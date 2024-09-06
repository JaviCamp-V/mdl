import React from 'react';
import Image from 'next/image';
import MuiAvatar, { AvatarProps } from '@mui/material/Avatar';
import Iconify from '@/components/Icon/Iconify';
import { blur_url } from '@/libs/common';


const stringToColor = (string: string): string => {
  /* eslint-disable no-bitwise */

  const hash = Array.from(string).reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);

  return [...Array(3)]
    .map((_, i) => `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2))
    .join('')
    .replace(/^/, '#');
  /* eslint-enable no-bitwise */
};

interface CustomAvatarProps extends AvatarProps {
  username: string;
  isDeleted?: boolean;
}
const Avatar: React.FC<CustomAvatarProps> = ({ username, children, isDeleted, src, sx, ...props }) => {
  if (isDeleted) {
    return (
      <MuiAvatar sx={{ bgcolor: 'disabled', ...sx }} {...props}>
        <Iconify icon="mdi:user-outline" fontSize={'inherit'} />
      </MuiAvatar>
    );
  }

  return (
    <MuiAvatar sx={{ bgcolor: stringToColor(username), ...sx }} {...props}>
      {src ? (
        <Image
          src={src}
          alt={username}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--muted-color)',
            objectFit: 'cover'
          }}
          fill
          placeholder="blur"
          blurDataURL={blur_url}
          priority
          unoptimized
        />
      ) : (
        username?.charAt(0)?.toUpperCase()
      )}
    </MuiAvatar>
  );
};

export default Avatar;
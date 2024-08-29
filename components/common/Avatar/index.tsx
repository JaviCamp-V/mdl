import React from 'react';
import MuiAvatar, { AvatarProps } from '@mui/material/Avatar';
import Iconify from '@/components/Icon/Iconify';

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
const Avatar: React.FC<CustomAvatarProps> = ({ username, children, isDeleted, sx, ...props }) => {
  return (
    <MuiAvatar
      sx={{ bgcolor: !isDeleted ? stringToColor(username) : 'disabled', ...sx }}
      {...props}
      src={isDeleted ? undefined : props?.src}
    >
      {isDeleted ? <Iconify icon="mdi:user-outline" fontSize={'inherit'} /> : username?.charAt(0)?.toUpperCase()}
    </MuiAvatar>
  );
};

export default Avatar;
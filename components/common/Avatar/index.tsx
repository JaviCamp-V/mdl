import React from 'react';
import MuiAvatar, { AvatarProps } from '@mui/material/Avatar';

const stringToColor = (string: string): string => {
  const hash = Array.from(string).reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);

  return [...Array(3)]
    .map((_, i) => `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2))
    .join('')
    .replace(/^/, '#');
};

interface CustomAvatarProps extends AvatarProps {
  username: string;
}
const Avatar: React.FC<CustomAvatarProps> = ({ username, sx, ...props }) => {
  return <MuiAvatar sx={{ bgcolor: stringToColor(username), ...sx }} {...props} />;
};

export default Avatar;

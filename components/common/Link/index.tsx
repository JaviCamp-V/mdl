import React from 'react';
import NexLink from 'next/link';
import { SxProps } from '@mui/material';
import MuiLink from '@mui/material/Link';

interface LinkProps {
  href: string;
  children: string | React.ReactNode;
  sx?: SxProps;
}
const Link: React.FC<LinkProps> = ({ href, children, sx }) => {
  return (
    <MuiLink
      color="primary"
      fontSize={14}
      component={NexLink}
      href={href}
      passHref
      sx={{ textDecoration: 'none', ...sx }}
    >
      {children}
    </MuiLink>
  );
};

export default Link;

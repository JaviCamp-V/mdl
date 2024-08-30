import React from 'react';
import { Box, SxProps, Typography } from '@mui/material';
import Link from '@/components/common/Link';
import routes from '@/libs/routes';

interface AuthRequiredProps {
  action?: string;
  sx?: SxProps;
}

const AuthRequired: React.FC<AuthRequiredProps> = ({ action, sx }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', gap: 0.5, paddingX: 2, ...sx }}>
      <Link href={routes.login} sx={{ fontSize: 14 }}>
        Login
      </Link>
      <Typography sx={{ fontSize: 14 }}> or</Typography>
      <Link href={routes.register} sx={{ fontSize: 14 }}>
        Register
      </Link>
      {action && <Typography sx={{ fontSize: 14 }}> to {action}</Typography>}
    </Box>
  );
};

export default AuthRequired;
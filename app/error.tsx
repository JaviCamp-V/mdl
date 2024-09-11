'use client';

import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ErrorBoundary: React.FunctionComponent<Props> = ({ error, reset }) => {
  console.error(error?.message ?? error);

  return (
    <Box
      sx={{
        padding: { xs: 0, md: 4 },
        height: '100vh',
        marginX: 2,
        marginTop: 4,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          marginTop: 4,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          width: { xs: '100%', md: '60%' },
          height: 'max-content',
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography fontSize={24} paddingBottom={2} color={'primary'} fontWeight={700}>
          {` Oops! something went wrong. Please try again later.`}
        </Typography>
        <Typography fontSize={16} sx={{ opacity: 0.6 }}>
          {`  We're sorry, but it seems there was an error loading this page. Please try again or return to the home page.`}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, marginTop: 2 }}>
          <Button onClick={reset} variant="contained" color="primary" sx={{ textTransform: 'capitalize' }}>
            Reload
          </Button>
          <Button LinkComponent={Link} variant="contained" color="info" href="/" sx={{ textTransform: 'none' }}>
            Got to Home
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ErrorBoundary;

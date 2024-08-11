import React from 'react';
import { Metadata, NextPage } from 'next';
import { Button, Divider, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import SignUpForm from '@/components/Forms/Auth/SignUp';
import routes from '@/libs/routes';

interface SignUpPageProps {}

export const metadata: Metadata = {
  title: 'Sign Up'
};
const SignUpPage: NextPage<SignUpPageProps> = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',

        paddingX: { xs: 0, md: 4 },
        paddingY: { xs: 2, md: 4 },
        marginX: { xs: 2, lg: 8 },

        marginTop: 4,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2
      }}
    >
      <Box sx={{ flex: 1, paddingX: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography fontSize={'1.25rem'} fontWeight={700}>
          Sign Up
        </Typography>
        <SignUpForm />
      </Box>
      <Divider orientation="vertical" flexItem />

      <Box sx={{ flex: 1, paddingX: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography fontSize={'1.25rem'} fontWeight={700}>
          {'Already have an account?'}
        </Typography>
        <Typography fontSize={14} fontWeight={'bolder'}>
          {`Login in your account MyDramaList and gain access to a world of Asian dramas and movies. It's quick, easy, and
          completely free!`}
        </Typography>

        <Box>
          <Button href={routes.login} variant={'contained'} sx={{ backgroundColor: 'background.default' }}>
            Sign In
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpPage;

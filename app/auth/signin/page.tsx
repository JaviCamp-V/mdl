import React from 'react';
import { Metadata, NextPage } from 'next';
import Link from 'next/link';
import { Button, Divider, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import SignInForm from '@/components/Forms/Auth/SignIn';
import routes from '@/libs/routes';

interface SignInPageProps {}

export const metadata: Metadata = {
  title: 'Sign In'
};
const SignInPage: NextPage<SignInPageProps> = () => {
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
          Sign In
        </Typography>
        <SignInForm />
      </Box>
      <Divider orientation="vertical" flexItem />

      <Box sx={{ flex: 1, paddingX: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography fontSize={'1.25rem'} fontWeight={700}>
          {"Don't have an account?"}
        </Typography>
        <Typography fontSize={14} fontWeight={'bolder'}>
          Sign up for MyDramaList and gain access to a world of Asian dramas and movies. It&apos;s quick, easy, and
          completely free!
        </Typography>
        <Typography fontSize={14}>By creating an account, you can enjoy the following features:</Typography>

        <Box component={'ul'} sx={{ paddingLeft: 2 }}>
          <Box component={'li'}>Create your own personalized drama list</Box>
          <Box component={'li'}>Join in discussions with other fans</Box>
          <Box component={'li'}>Contribute to the ever-growing database</Box>
          <Box component={'li'}>Rate and review dramas and movies</Box>
          <Box component={'li'}>Keep track of your favorite actors and actresses</Box>
          <Box component={'li'}>Discover new and exciting content</Box>
          <Box component={'li'}>Less advertisements</Box>
          <Box component={'li'}>And much more!</Box>
        </Box>

        <Typography fontSize={14}>
          Don&apos;t miss out - sign up now and start enjoying all the benefits of MyDramaList.
        </Typography>

        <Box>
          <Button href={routes.register} variant={'contained'} sx={{ backgroundColor: 'background.default' }}>
            Sign Up
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignInPage;

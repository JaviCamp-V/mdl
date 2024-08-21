'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import routes from '@/libs/routes';
import NotificationsAlert from '../notifications';
import ProfileDropdown from '../profile_dropdown';

const AuthContent = () => {
  const { data: session, status } = useSession();
  if (status === 'loading' || !session?.user) {
    return (
      <React.Fragment>
        <Link href={routes.register} passHref style={{ textDecoration: 'none', whiteSpace: 'nowrap', marginRight: 1 }}>
          <Typography fontSize={14} fontWeight={500} sx={{ color: 'white' }}>
            Sign Up
          </Typography>
        </Link>
        <Link href={routes.login} passHref style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
          <Typography fontSize={14} fontWeight={500} sx={{ color: 'white' }} whiteSpace="nowrap">
            Login
          </Typography>
        </Link>
      </React.Fragment>
    );
  }

  console.log(session);

  return (
    <React.Fragment>
      <NotificationsAlert />
      <ProfileDropdown username={session.user?.username ?? 'U'} />
    </React.Fragment>
  );
};

export default AuthContent;

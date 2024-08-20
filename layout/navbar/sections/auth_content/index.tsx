'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import model from '@/layout/model';
import NotificationsAlert from '../notifications';
import ProfileDropdown from '../profile_dropdown';


const AuthContent = () => {
  const { data: session, status } = useSession();
  if (status === 'loading' || !session?.user) {
    return (
      <React.Fragment>
        <Link href={model.signUp} passHref style={{ textDecoration: 'none', whiteSpace: 'nowrap', marginRight: 1 }}>
          <Typography fontSize={14} fontWeight={500} sx={{ color: 'white' }}>
            Sign Up
          </Typography>
        </Link>
        <Link href={model.signIn} passHref style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
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
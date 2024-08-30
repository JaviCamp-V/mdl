'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import routes from '@/libs/routes';
import NotificationsAlert from '../notifications';
import ProfileDropdown from '../profile_dropdown';

const AuthContent: React.FC = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const params = useSearchParams();

  if (status === 'loading' || !session?.user) {
    const host = window.location.origin;
    const query = params.toString()?.trim() ? `?${params.toString()}` : '';
    const callbackUrl = encodeURI(`${host}${pathname}${query}`);
    return (
      <React.Fragment>
        <Link
          href={`${routes.register}?callbackUrl=${callbackUrl}`}
          passHref
          style={{ textDecoration: 'none', whiteSpace: 'nowrap', marginRight: 1 }}
        >
          <Typography fontSize={14} fontWeight={500} sx={{ color: 'white' }}>
            Sign Up
          </Typography>
        </Link>
        <Link
          href={`${routes.login}?callbackUrl=${callbackUrl}`}
          passHref
          style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          <Typography fontSize={14} fontWeight={500} sx={{ color: 'white' }} whiteSpace="nowrap">
            Login
          </Typography>
        </Link>
      </React.Fragment>
    );
  }

  if (session?.user?.authError) {
    signOut();
  }

  return (
    <React.Fragment>
      <NotificationsAlert />
      <ProfileDropdown username={session.user?.username ?? 'U'} />
    </React.Fragment>
  );
};

export default AuthContent;

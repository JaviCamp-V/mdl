import React from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import PersonContainer from '@/features/media/containers/Person';
import UserProfileContainer from '@/features/profile/containers/profile';
import Box from '@mui/material/Box';

type PageProps = {
  params: { username: string; slug?: string[] };
  searchParams: { [key: string]: string };
};

export const revalidate = 3600 / 2;

const UserProfilePage: NextPage<PageProps> = ({ params: { username, slug }, searchParams }) => {
  return (
    <Box
      sx={{
        paddingY: { xs: 2, md: 4 },
        paddingX: { xs: 1, md: 4 },
        marginX: { xs: 1, lg: 8 },
        backgroundColor: 'background.default',
        marginTop: 2
      }}
    >
      <UserProfileContainer username={username} sections={slug} searchParams={searchParams} />
    </Box>
  );
};

export default UserProfilePage;

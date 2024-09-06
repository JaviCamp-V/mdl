import React from 'react';
import { NextPage } from 'next';
import { redirect } from 'next/navigation';
import ProfileSettingsForm from '@/features/profile/components/forms/settings';
import { getAuthUserProfile } from '@/features/profile/service/userProfileService';
import Box from '@mui/material/Box';

interface PageProps {}
const ProfileSettings: NextPage<PageProps> = async () => {
  const profile = await getAuthUserProfile();
  if (!profile) redirect('/');
  return (
    <Box
      sx={{
        paddingY: { xs: 0.5, sm: 2, md: 2 },
        paddingX: { xs: 0.5, sm: 2, md: 4 },
        marginX: { xs: 0.5, sm: 2, lg: 8 },
        marginTop: { xs: 1, md: 2 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 1px 1px rgba(0,0,0,.1)',
          border: '1px solid rgba(0, 0, 0, .14)',
          width: { xs: '100%', sm: '80%', md: '60%' }
        }}
      >
        <ProfileSettingsForm profile={profile ?? undefined} />
      </Box>
    </Box>
  );
};

export default ProfileSettings;
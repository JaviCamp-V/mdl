import React from 'react';
import Link from 'next/link';
import { Box, Button } from '@mui/material';
import Iconify from '@/components/Icon/Iconify';
import Avatar from '@/components/common/Avatar';
import { userRoutes } from '@/libs/routes';

interface ProfileCardProps {
  username: string;
  displayName: string;
  avatarUrl: string | null | undefined;
}
const ProfileCard: React.FC<ProfileCardProps> = ({ username, displayName, avatarUrl }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        padding: 2,
        boxShadow: '0 1px 1px rgba(0,0,0,.1)',
        border: '1px solid rgba(0, 0, 0, .14)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%'
      }}
    >
      <Avatar
        src={avatarUrl ?? undefined}
        username={username}
        variant="square"
        sx={{ width: '100%', height: '40vh', fontSize: 100 }}
      />
      <Button
        LinkComponent={Link}
        href={userRoutes.watchlist.replace('{username}', username.toLowerCase())}
        variant="contained"
        color="info"
        sx={{ textTransform: 'none' }}
      >
        <Iconify
          icon="material-symbols:list"
          sx={{
            color: 'inherit',
            fontSize: 72,
            width: 30,
            height: 30,
            fontWeight: 700,
            marginRight: 1
          }}
        />
        {`${displayName}'s Watchlist`}
      </Button>
    </Box>
  );
};

export default ProfileCard;

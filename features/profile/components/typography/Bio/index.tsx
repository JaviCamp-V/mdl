import React from 'react';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

interface ProfileBioProps {
  bio: string | null | undefined;
}
const ProfileBio: React.FC<ProfileBioProps> = ({ bio }) => {
  return (
    <Box sx={{ width: '100%', paddingX: 2 }}>
      <Typography fontSize={14} lineHeight={1.5} paddingBottom={1.5} sx={{ whiteSpace: 'pre-wrap' }}>
        {bio}
      </Typography>
    </Box>
  );
};

export default ProfileBio;

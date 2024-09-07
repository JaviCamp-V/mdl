'use client';

import React from 'react';
import DOMPurify from 'dompurify';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

interface ProfileBioProps {
  bio: string | null | undefined;
}
const ProfileBio: React.FC<ProfileBioProps> = ({ bio }) => {
  const bioCleaned = bio ? DOMPurify.sanitize(bio, { USE_PROFILES: { html: true } }) : '';
  return (
    <Box sx={{ width: '100%', paddingX: 2, fontSize: '0.9em' }}>
      <Box
        sx={{
          width: '100%',
          padding: 0,
          margin: 0,
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'inline-block'
        }}
      >
        <Box dangerouslySetInnerHTML={{ __html: bioCleaned }} />
      </Box>
    </Box>
  );
};

export default ProfileBio;

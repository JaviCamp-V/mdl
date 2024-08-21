import React from 'react';
import ExternalID from '@/features/media/types/interfaces/ExternalID';
import { SxProps } from '@mui/material';
import { Box } from '@mui/system';
import DramaPoster from '@/components/Poster';
import Socials from '@/components/Socials';
import MediaType from '@/types/enums/IMediaType';

interface PersonLinksProps {
  profile_path: string | null;
  external_ids: ExternalID;
  posterStyle?: SxProps;
  personId: number;
}
const PersonLinks: React.FC<PersonLinksProps> = ({ personId, profile_path, posterStyle, external_ids }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          width: { xs: '100%', sm: '100%' },
          height: { xs: '40vh', sm: '50vh' },
          ...posterStyle
        }}
      >
        <DramaPoster src={profile_path} id={personId} mediaType={MediaType.person} size="original" />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingX: 2
        }}
      >
        <Socials {...external_ids} />
      </Box>
    </Box>
  );
};

export default PersonLinks;

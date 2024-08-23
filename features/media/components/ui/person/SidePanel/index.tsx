import React from 'react';
import Gender from '@/features/media/types/enums/Gender';
import ExternalID from '@/features/media/types/interfaces/ExternalID';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography/Typography';
import MediaType from '@/types/enums/IMediaType';
import BioData from '../BioData';
import PersonLinks from '../PersonLinks';

interface PersonDetailsSidePanelProps {
  personId: number;
  name: string;
  profile_path: string | null;
  external_ids: ExternalID;
  birthday: string | null;
  also_known_as: string[];
  place_of_birth: string;
  gender: Gender;
}
const PersonDetailsSidePanel: React.FC<PersonDetailsSidePanelProps> = ({
  personId,
  name,
  profile_path,
  external_ids,
  birthday,
  also_known_as,
  place_of_birth,
  gender
}) => {
  return (
    <React.Fragment>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          gap: 2
        }}
      >
        <Typography fontSize={'1.25rem'} fontWeight={700} lineHeight={1} color="primary">
          {name}
        </Typography>
        <PersonLinks
          profile_path={profile_path}
          external_ids={external_ids}
          personId={personId}
          posterStyle={{ width: '100%', height: { md: '50vh', lg: '60vh' } }}
        />
      </Box>
      <Box
        sx={{
          boxShadow: '0 1px 1px rgba(0,0,0,.1)',
          marginTop: 2,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column'
        }}
      >
        <Box
          sx={{
            backgroundColor: '#1675b6',
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            paddingY: 1,
            paddingX: 2,
            color: '#fff'
          }}
        >
          <Typography fontSize={16} fontWeight={700}>
            Details
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
            padding: 2
          }}
        >
          <Box>
            <BioData
              birthday={birthday}
              name={name}
              also_known_as={also_known_as}
              place_of_birth={place_of_birth}
              gender={gender}
            />
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default PersonDetailsSidePanel;

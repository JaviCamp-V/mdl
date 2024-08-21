import React from 'react';
import PersonDetails from '@/features/media/types/interfaces/People';
import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@/components/common/Divider';
import BioData from '../BioData';
import PersonLinks from '../PersonLinks';
import Roles from '../Roles';

interface PersonMainDetailsProps {
  person: PersonDetails;
}

const PersonMainDetails: React.FC<PersonMainDetailsProps> = ({ person }) => {
  const { biography, id, profile_path, external_ids, name, birthday, also_known_as, place_of_birth, gender } = person;
  return (
    <Box
      sx={{
        marginTop: 4,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        overflow: 'hidden',
        minHeight: '50vh'
      }}
    >
      <Box sx={{ width: '100%', paddingY: 2 }}>
        <Box sx={{}}>
          <Typography fontSize={18} fontWeight={700} paddingLeft={2}>
            Details
          </Typography>
          <Divider marginY={1} />
          <Box sx={{ padding: 2, display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Box
              sx={{
                width: { xs: '40%', sm: '33%' },
                display: { xs: 'flex', md: 'none' },
                flexDirection: 'column',
                gap: 1
              }}
            >
              <PersonLinks profile_path={profile_path} external_ids={external_ids} personId={id} />
            </Box>
            <Box sx={{ width: { xs: '60%', sm: '77%', md: '100%' } }}>
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography fontSize={'1.25rem'} fontWeight={700} lineHeight={1} color="primary">
                  {name}
                </Typography>
                <BioData
                  birthday={birthday}
                  name={name}
                  also_known_as={also_known_as}
                  place_of_birth={place_of_birth}
                  gender={gender}
                />
              </Box>
              <Typography fontSize={14}>{biography || 'No biography added'}</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ paddingLeft: 2 }}>
          <Roles personId={id} />
        </Box>
      </Box>
    </Box>
  );
};

export default PersonMainDetails;

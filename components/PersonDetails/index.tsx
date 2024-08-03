import React from 'react'
import PersonDetailsType from '@/types/tmdb/IPeople';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Roles from './Roles';
 type PersonDetailsProps = {
   details: PersonDetailsType;
 };
const PersonDetails: React.FC<PersonDetailsType> = ({id, biography }) => {
  return (
    <Box sx={{ marginTop: 4, backgroundColor: '#242526', borderRadius: 2, overflow: 'hidden', minHeight: '50vh' }}>
      <Box sx={{ width: '100%', paddingY: 2 }}>
        <Box sx={{}}>
          <Typography paddingLeft={2}> Details</Typography>
          <Box sx={{ borderBottom: '1px solid hsla(210, 8%, 51%, .13)', marginY: 1 }} />
          <Typography paddingLeft={2}>{biography || 'No biography added'}</Typography>
        </Box>

        <Box sx={{ paddingLeft: 2 }}>
          <Roles id={id} />
        </Box>
      </Box>
    </Box>
  );
};



export default PersonDetails
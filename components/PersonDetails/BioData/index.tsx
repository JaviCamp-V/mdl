import React from 'react';
import { capitalCase } from 'change-case';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import PersonDetails from '@/types/tmdb/IPeople';
import { calculateAge } from '@/utils/dateUtils';
import { formatShortDate, formatStringDate } from '@/utils/formatters';

const BioData: React.FC<PersonDetails> = (props) => {
  const color = 'hsl(0deg 0% 100% / 87%)';

  const birthDate = props.birthday ? formatStringDate(props.birthday) : null;
  const data = {
    name: props.name,
    also_known_as: props.also_known_as.join(', '),
    place_of_birth: props.place_of_birth,
    gender: { 0: 'Male', 1: 'Female' }[props.gender] ?? 'Other',
    born: birthDate ? formatShortDate(birthDate) : 'Unknown',
    age: birthDate ? calculateAge(birthDate) : 'Unknown'
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        paddingBottom: 2
      }}
    >
      {Object.entries(data).map(([key, value]) => (
        <Box sx={{ fontSize: '14px', color }} key={key}>
          <Typography fontWeight="bolder" paddingRight={1} display={'inline'}>
            {capitalCase(key)}:
          </Typography>
          <Typography display={'inline'}>{value}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default BioData;

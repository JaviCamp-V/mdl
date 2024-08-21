import React from 'react';
import Gender from '@/features/media/types/enums/Gender';
import { capitalCase } from 'change-case';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { calculateAge } from '@/utils/dateUtils';
import { formatShortDate, formatStringDate } from '@/utils/formatters';

interface BioDataProps {
  birthday: string | null;
  name: string;
  also_known_as: string[];
  place_of_birth: string;
  gender: Gender;
}
const BioData: React.FC<BioDataProps> = ({ birthday, name, also_known_as, place_of_birth, gender }) => {
  const birthDate = birthday ? formatStringDate(birthday) : null;
  const data = {
    name: name,
    also_known_as: also_known_as.join(', '),
    place_of_birth: place_of_birth,
    gender: { [Gender.MALE]: 'Male', [Gender.FEMALE]: 'Female' }[gender] ?? 'Other',
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
        <Box sx={{}} key={key}>
          <Typography fontWeight="bolder" paddingRight={1} display={'inline'} fontSize={14}>
            {capitalCase(key)}:
          </Typography>
          <Typography display={'inline'} fontSize={14}>
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default BioData;

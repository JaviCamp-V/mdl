import React from 'react';
import { capitalCase } from 'change-case';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { formatDateToDistance, formatShortDate, formatStringDate } from '@/utils/formatters';


interface PersonDetailsProps {
  lastOnlineAt: string;
  joinedAt: string;
  birthday?: string | null | undefined;
  location?: string | null | undefined;
}
const PersonDetails: React.FC<PersonDetailsProps> = ({ lastOnlineAt, joinedAt, birthday, location }) => {
  const birthDate = birthday ? formatStringDate(birthday) : null;
  const data = {
    lastOnlineAt: formatDateToDistance(lastOnlineAt),
    location: location ?? 'Unknown',
    birthDate: birthDate ? formatShortDate(formatStringDate(birthDate)) : 'Unknown',
    joinDate: formatShortDate(formatStringDate(joinedAt))
  };
  return (
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
        {Object.entries(data).map(([key, value]) => (
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 0.5 }} key={key}>
            <Typography fontWeight="bolder" display={'inline'} fontSize={14}>
              {capitalCase(key)}:
            </Typography>
            <Typography display={'inline'} fontSize={14}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PersonDetails;
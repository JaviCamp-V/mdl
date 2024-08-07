import React from 'react';
import { capitalCase } from 'change-case';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MediaTitle from '@/components/MediaTitle';
import { Credits } from '@/types/tmdb/IPeople';


const CrewSummary: React.FC<Credits> = ({ crew }) => {
  const director = crew.filter((crew) => crew.job === 'Director');
  const writer = crew.filter((crew) => crew.job === 'Screenplay' || crew.job === 'Writer');
  const showing = { director, writer };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {Object.entries(showing).map(([key, persons]) => (
        <Box key={key} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <Typography fontWeight={700} paddingRight={1} fontSize={14}>
            {`${capitalCase(key)}:`}
          </Typography>
          {persons.length
            ? persons?.map((person, index, arr) => (
                <React.Fragment key={person.id}>
                  <MediaTitle id={person.id} title={person.name} mediaType="person" fontSize={14} fontWeight={400} />
                  {index < arr.length - 1 && <Typography sx={{ marginRight: 0.2 }}>,</Typography>}
                </React.Fragment>
              ))
            : 'N/A'}
        </Box>
      ))}
    </Box>
  );
};

export default CrewSummary;
import DramaPoster from '@/components/Poster';
import MediaType from '@/types/tmdb/IMediaType';
import { Cast, Credits } from '@/types/tmdb/IPeople';
import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { capitalCase } from 'change-case';
import Link from 'next/link';
import React from 'react';

const FullCredits: React.FC<Credits> = ({ cast, crew }) => {
  const sections = {
    Director: crew?.filter((member) => member.job === 'Director'),
    Screenplay: crew?.filter((member) => member.job === 'Screenplay' || member.job === 'Writer'),
    MainRole: cast?.filter((member) => member.order < 4 && member.character),
    SupportRole: cast?.filter((member) => member.order >= 4 && member.character),
    Unknown: cast?.filter((member) => !member.character)
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
      {Object.entries(sections)
        .filter(([_, arr]) => arr.length)
        .map(([job, members]) => (
          <Box key={job}>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 500 }}>{capitalCase(job)}</Typography>
            <Box sx={{ borderTop: '1px solid hsla(210, 8%, 51%, .13)', marginY: 2 }} />
            <Grid container spacing={2} padding={1}>
              {members?.map((member) => (
                <Grid item key={member.id} xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <Box sx={{ width: '30%', height: { xs: '30vh', sm: '25vh' } }}>
                    <DramaPoster src={member.profile_path} id={member.id} mediaType={MediaType.person} size="w185" />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, width: '60%', height: '100%' }}>
                    <Link href={`/person/${member.id}`} passHref style={{ textDecoration: 'none' }}>
                      <Typography color="primary" fontWeight={500} fontSize={16}>
                        {member.name}
                      </Typography>
                    </Link>
                    {['MainRole', 'SupportRole', 'Unknown'].includes(job) && (
                      <Typography fontSize={14}>{(member as Cast)?.character ?? 'Unknown'}</Typography>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
    </Box>
  );
};

export default FullCredits;

import React from 'react';
import { camelCase, capitalCase } from 'change-case';
import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import MediaTitle from '@/components/MediaTitle';
import DramaPoster from '@/components/Poster';
import MediaType from '@/types/tmdb/IMediaType';
import { Cast, Credits, Crew } from '@/types/tmdb/IPeople';

const FullCredits: React.FC<Credits> = ({ cast, crew }) => {
  const groupByJob = crew?.reduce(
    (acc, member) => {
      const job = camelCase(member.job);
      const list = job in acc ? acc[job] : [];
      return { ...acc, [job]: [...list, member] };
    },
    { director: [], screenplay: [], writer: [] } as { [key: string]: Crew[] }
  );

  const { director, screenplay, writer, ...rest } = groupByJob;

  const sections = {
    Director: director,
    Screenplay: [...screenplay, ...writer],
    MainRole: cast?.filter((member) => member.order < 4 && member.character),
    SupportRole: cast?.filter((member) => member.order >= 4 && member.character),
    Unknown: cast?.filter((member) => !member.character),
    ...rest
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
      {Object.entries(sections)
        .filter(([_, arr]) => arr.length)
        .map(([job, members]) => (
          <Box key={job}>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>{capitalCase(job)}</Typography>
            <Box
              sx={{
                borderTop: '1px solid hsla(210, 8%, 51%, .13)',
                marginY: 2
              }}
            />
            <Grid container spacing={2} padding={1}>
              {members?.map((member) => (
                <Grid item key={member.id} xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <Box sx={{ width: '30%', height: { xs: '30vh', sm: '25vh' } }}>
                    <DramaPoster src={member.profile_path} id={member.id} mediaType={MediaType.person} size="w185" />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0,
                      width: '60%',
                      height: '100%'
                    }}
                  >
                    <MediaTitle title={member.name} id={member.id} mediaType={MediaType.person} fontSize={16} />
                    {['MainRole', 'SupportRole', 'Unknown'].includes(job) && (
                      <React.Fragment>
                        <Typography fontSize={13}>{(member as Cast)?.character ?? 'Unknown'}</Typography>
                        <Typography fontSize={13} color="#818a91" sx={{ opacity: 0.6 }}>
                          {(member as Cast)?.order < 4 ? 'Main Role' : 'Supporting Role'}
                        </Typography>
                      </React.Fragment>
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

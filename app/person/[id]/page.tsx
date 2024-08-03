import PersonDetails from '@/components/PersonDetails';
import DramaPoster from '@/components/Poster';
import { getDetails } from '@/server/tmdb2Actions';
import MediaType from '@/types/tmdb/IMediaType';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Metadata, NextPage } from 'next/types';
import React from 'react';

type PageProps = {
  params: { id: number };
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = params;
  const response = await getDetails(MediaType.person, id);
  return { title: response?.name ?? `Person ${id} Details`};
};
const PersonDetailsPage: NextPage<PageProps> = async ({ params: { id }}) => {
  const response = await getDetails(MediaType.person, id);
  if (!response) return <div>Person not found</div>;

  const boxStyle = {
    marginTop: 4,
    backgroundColor: '#242526',
    borderRadius: 2,
    overflow: 'hidden',
    minHeight: '50vh'
  };

  return (
    <Box sx={{ padding: { xs: 0, md: 4 }, marginX: 2 }}>
      <Grid container spacing={3} sx={{ padding: { xs: 0, md: 4 } }}>
        <Grid item xs={12} md={8.5}>
          <PersonDetails {...response} />
        </Grid>
        <Grid item xs={12} md={3.5} sx={{ marginTop: 4, marginBottom: 4 }}>
          <Box
            sx={{
              backgroundColor: '#242526',
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
            <Typography fontSize={'1.25rem'} fontWeight={500} lineHeight={1} color="primary">
              {response.name}
            </Typography>

            <Box sx={{ width: '90%', height: '60vh' }}>
              <DramaPoster src={response.profile_path} id={id} mediaType={MediaType.person} size="original" />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonDetailsPage;

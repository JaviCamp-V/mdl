import React from 'react';
import { Metadata, NextPage } from 'next/types';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { getPersonDetails } from '@/server/tmdbActions';
import PersonDetails from '@/components/PersonDetails';
import BioData from '@/components/PersonDetails/BioData';
import DramaPoster from '@/components/Poster';
import Socials from '@/components/Socials';
import NotFound from '@/components/common/NotFound';
import MediaType from '@/types/tmdb/IMediaType';

type PageProps = {
  params: { id: number };
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = params;
  const response = await getPersonDetails(id);
  return { title: response?.name ?? `Person ${id} Details` };
};
const PersonDetailsPage: NextPage<PageProps> = async ({ params: { id } }) => {
  const response = await getPersonDetails(id);
  if (!response) return <NotFound type={MediaType.person} />;

  return (
    <Box sx={{ padding: { xs: 0, md: 4 }, marginX: { xs: 2, lg: 8 } }}>
      <Grid container spacing={3} sx={{ padding: { xs: 0, md: 0 } }}>
        <Grid item xs={12} md={8.5}>
          <PersonDetails {...response} />
        </Grid>
        <Grid item xs={12} md={3.5} sx={{ marginTop: 4, marginBottom: 4 }}>
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
              {response.name}
            </Typography>

            <Box sx={{ width: '90%', height: '60vh' }}>
              <DramaPoster src={response.profile_path} id={id} mediaType={MediaType.person} size="original" />
            </Box>

            <Socials {...response.external_ids} />
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
                <BioData {...response} />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonDetailsPage;

import React from 'react';
import { Metadata, NextPage } from 'next/types';
import PersonContainer from '@/features/media/containers/Person';
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
const PersonDetailsPage: NextPage<PageProps> = ({ params: { id } }) => {
  return (
    <Box sx={{ padding: { xs: 0, md: 4 }, marginX: { xs: 2, lg: 8 } }}>
      <PersonContainer personId={id} />
    </Box>
  );
};

export default PersonDetailsPage;
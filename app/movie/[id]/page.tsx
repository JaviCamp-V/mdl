import React from 'react';
import { Metadata, NextPage } from 'next/types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { getMovieDetails } from '@/server/tmdbActions';
import GeneralDetails from '@/components/MeidiaDetails';
import SidePanel from '@/components/SidePanel';
import NotFound from '@/components/common/NotFound';
import MediaType from '@/types/tmdb/IMediaType';
import { formatStringDate } from '@/utils/formatters';
import { card_background } from '@/libs/common';

type PageProps = {
  params: { id: number };
  searchParams: { [tab: string]: string };
};

const getReleaseYear = (release_date: string | undefined) => {
  if (!release_date) return 'TBA';
  return formatStringDate(release_date).getFullYear();
};
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = params;
  const response = await getMovieDetails(id);
  const title = `${response?.title} (${getReleaseYear(response?.release_date)})`;
  return {
    title: response?.title ? title : 'Movie Details',
    description: response?.overview ?? ''
  };
};
const MovieDetailsPage: NextPage<PageProps> = async ({ params: { id }, searchParams: { tab } }) => {
  const response = await getMovieDetails(id);
  if (!response) return <NotFound type={MediaType.movie} />;

  const boxStyle = {
    marginTop: 4,
    backgroundColor: card_background,
    borderRadius: 2,
    overflow: 'hidden',
    minHeight: '50vh'
  };

  return (
    <Box sx={{ padding: { xs: 0, md: 4 }, marginX: 2 }}>
      <Grid container spacing={3} sx={{ padding: { xs: 0, md: 4 } }}>
        <Grid item xs={12} md={8.5}>
          <GeneralDetails details={response} type={MediaType.movie} tab={tab} containerStyle={boxStyle} />
        </Grid>
        <Grid item xs={12} md={3.5} sx={{ marginTop: 4 }}>
          <SidePanel details={response} type={MediaType.movie} tab={tab ?? ''} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovieDetailsPage;

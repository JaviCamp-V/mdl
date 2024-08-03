import GeneralDetails from '@/components/GeneralDetails';
import SidePanel from '@/components/SidePanel';
import { getDetails } from '@/server/tmdb2Actions';
import MediaType from '@/types/tmdb/IMediaType';
import { formatStringDate } from '@/utils/formatters';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Metadata, NextPage } from 'next/types';
import React from 'react';

type PageProps = {
  params: { id: number };
  searchParams: { [tab: string]: string };
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = params;
  const response = await getDetails(MediaType.movie, id);
  const title = `${response?.title} (${formatStringDate(response?.release_date).getFullYear()})`;
  return { title: response?.title ? title : 'Movie Details', description: response?.overview ?? '' };
};
const MovieDetailsPage: NextPage<PageProps> = async ({ params: { id }, searchParams: { tab } }) => {
  const response = await getDetails(MediaType.movie, id);
  if (!response) return <div>Movie not found</div>;

  const boxStyle = {
    marginTop: 4,
    backgroundColor: '#242526',
    borderRadius: 2,
    overflow: 'hidden',
    minHeight: '50vh'
  };

  return (
    <Box sx={{  padding: 4, marginX: 2 }}>
      <Grid container spacing={3} sx={{ padding: 4 }}>
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

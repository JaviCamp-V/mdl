import React from 'react';
import { Metadata, NextPage } from 'next/types';
import ContentContainer from '@/features/media/containers/Content';
import { getMovieDetails } from '@/features/media/service/tmdbService';
import Box from '@mui/material/Box';
import MediaType from '@/types/tmdb/IMediaType';
import { formatStringDate } from '@/utils/formatters';

type PageProps = {
  params: { id: number; slug?: string[] };
  searchParams: { [key: string]: string };
};

const getReleaseYear = (release_date: string | undefined) => {
  if (!release_date) return 'TBA';
  return formatStringDate(release_date).getFullYear();
};
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id, slug } = params;
  const response = await getMovieDetails(id, false);
  const section = slug ? slug[0] : 'Details';
  const title = `${response?.title} (${getReleaseYear(response?.release_date)}) - ${section} `;
  return {
    title: response?.title ? title : 'Movie Details',
    description: response?.overview ?? ''
  };
};
const MovieDetailsPage: NextPage<PageProps> = async ({ params: { id, slug } }) => {
  return (
    <Box sx={{ padding: { xs: 0, md: 4 }, marginX: { xs: 2, lg: 8 }, backgroundColor: 'background.default' }}>
      <ContentContainer mediaId={id} mediaType={MediaType.movie} sections={slug} />
    </Box>
  );
};

export default MovieDetailsPage;
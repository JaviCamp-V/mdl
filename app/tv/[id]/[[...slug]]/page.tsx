import React from 'react';
import { Metadata, NextPage } from 'next/types';
import ContentContainer from '@/features/media/containers/Content';
import { getTVDetails } from '@/features/media/service/tmdbService';
import Box from '@mui/material/Box';
import MediaType from '@/types/tmdb/IMediaType';
import { formatStringDate } from '@/utils/formatters';

type PageProps = {
  params: { id: number; slug?: string[] };
  searchParams: { [key: string]: string };
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id, slug } = params;
  const response = await getTVDetails(id, false);
  const section = slug ? slug[0] : 'Details';
  const title = `${response?.name} (${formatStringDate(response?.first_air_date).getFullYear()}) - ${section} `;
  return {
    title: response?.name ? title : 'Drama Details',
    description: response?.overview ?? ''
  };
};
const TVDetailsPage: NextPage<PageProps> = async ({ params: { id, slug } }) => {
  return (
    <Box sx={{ padding: { xs: 0, md: 4 }, marginX: { xs: 2, lg: 8 }, backgroundColor: 'background.default' }}>
      <ContentContainer mediaId={id} mediaType={MediaType.tv} sections={slug} />
    </Box>
  );
};

export default TVDetailsPage;
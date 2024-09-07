import React from 'react';
import { Metadata, NextPage } from 'next/types';
import ContentContainer from '@/features/media/containers/Content';
import { getTVDetails } from '@/features/media/service/tmdbService';
import Box from '@mui/material/Box';
import MediaType from '@/types/enums/IMediaType';
import { formatStringDate } from '@/utils/formatters';

type PageProps = {
  params: { id: number; slug?: string[] };
  searchParams: { [key: string]: string };
};

export const generateMetadata = async ({ params, searchParams }: PageProps): Promise<Metadata> => {
  const { id, slug } = params;
  const response = await getTVDetails(id, false);
  const section = slug ? slug[0] : 'Details';
  const title = `${response?.name} (${formatStringDate(response?.first_air_date).getFullYear()}) - ${section} `;
  return {
    title: response?.name ? title : 'Drama Details',
    description: response?.overview ?? ''
  };
};
const TVDetailsPage: NextPage<PageProps> = ({ params: { id, slug }, searchParams }) => {
  return (
    <Box
      sx={{
        paddingY: { xs: 0.5, md: 4 },
        paddingX: { xs: 0.5, md: 4 },
        marginX: { xs: 0.5, sm: 1, lg: 8 },
        backgroundColor: 'background.default',
        marginTop: { xs: 1, md: 2 }
      }}
    >
      <ContentContainer mediaId={Number(id)} mediaType={MediaType.tv} sections={slug} searchParams={searchParams} />
    </Box>
  );
};

export default TVDetailsPage;

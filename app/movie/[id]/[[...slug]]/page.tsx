import React from 'react';
import { Metadata, NextPage } from 'next/types';
import ContentContainer from '@/features/media/containers/Content';
import { getValidContentSummary } from '@/features/media/service/tmdbViewService';
import { capitalCase } from 'change-case';
import Box from '@mui/material/Box';
import MediaType from '@/types/enums/IMediaType';
import { formatStringDate } from '@/utils/formatters';

type PageProps = {
  params: { id: number; slug?: string[] };
  searchParams: { [key: string]: string };
};

const getReleaseYear = (release_date: string | undefined | null) => {
  if (!release_date) return 'TBA';
  return formatStringDate(release_date).getFullYear();
};
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id, slug } = params;
  const response = await getValidContentSummary(MediaType.movie, id);
  const section = slug ? slug[0] : 'Details';
  const title = `${response?.title} (${getReleaseYear(response?.release_date)}) - ${capitalCase(section)} `;
  return {
    title: response?.title ? title : 'Movie Details',
    description: response?.overview ?? ''
  };
};
const MovieDetailsPage: NextPage<PageProps> = ({ params: { id, slug }, searchParams }) => {
  return (
    <Box
      sx={{
        paddingY: { xs: 2, md: 4 },
        paddingX: { xs: 1, md: 4 },
        marginX: { xs: 1, lg: 8 },
        backgroundColor: 'background.default',
        marginTop: 2
      }}
    >
      <ContentContainer mediaId={Number(id)} mediaType={MediaType.movie} sections={slug} searchParams={searchParams} />
    </Box>
  );
};

export default MovieDetailsPage;

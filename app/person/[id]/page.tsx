import React from 'react';
import { Metadata, NextPage } from 'next/types';
import PersonContainer from '@/features/media/containers/Person';
import { getPersonDetails } from '@/features/media/service/tmdbService';
import Box from '@mui/material/Box';

type PageProps = {
  params: { id: number };
  searchParams: { [key: string]: string };
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = params;
  const response = await getPersonDetails(id);
  return { title: response?.name ?? `Person ${id} Details` };
};
const PersonDetailsPage: NextPage<PageProps> = ({ params: { id }, searchParams }) => {
  return (
    <Box
      sx={{
        paddingY: { xs: 2, md: 4 },
        paddingX: { xs: 1, md: 4 },
        marginX: { xs: 1, lg: 8 },
        backgroundColor: 'background.default'
      }}
    >
      <PersonContainer personId={id} searchParams={searchParams} />
    </Box>
  );
};

export default PersonDetailsPage;

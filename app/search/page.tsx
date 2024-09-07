import React from 'react';
import { Metadata, NextPage } from 'next';
import AdvancedSearchForm from '@/features/media/components/forms/AdvancedSearch';
import SearchContainer from '@/features/media/containers/Search';
import { capitalCase } from 'change-case';
import Box from '@mui/material/Box';
import Loading from '@/components/common/Loading';

type PageProps = {
  searchParams: { [key: string]: string };
};

export const generateMetadata = async ({ searchParams }: PageProps): Promise<Metadata> => {
  const { query, type } = searchParams;
  return { title: `Search Results for ${capitalCase(query ?? type ?? 'N/A')}` };
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const SearchPage: NextPage<PageProps> = async ({ searchParams }) => {
  return (
    <Box
      sx={{
        padding: { xs: 2, md: 4 },
        marginX: 2,
        marginTop: 4,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 4
      }}
    >
      <Box sx={{ width: { xs: '100%', md: '70%' }, order: { xs: 2, md: 1 } }}>
        <React.Suspense fallback={<Loading />}>
          <SearchContainer searchParams={searchParams} />
        </React.Suspense>
      </Box>
      <Box sx={{ width: { xs: '100%', md: '30%' }, order: { xs: 1, md: 2 } }}>
        <AdvancedSearchForm />
      </Box>
    </Box>
  );
};

export default SearchPage;

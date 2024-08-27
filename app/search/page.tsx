import { Metadata, NextPage } from 'next';
import AdvancedSearchForm from '@/features/media/components/forms/AdvancedSearch';
import SearchResults from '@/features/media/components/lists/SearchResults';
import { advancedSearch } from '@/features/media/service/tmdbService';
import { getAllValidParams } from '@/features/media/utils/tmdbAdaancedSearch';
import { capitalCase } from 'change-case';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type PageProps = {
  searchParams: { [key: string]: string };
};

export const generateMetadata = async ({ searchParams }: PageProps): Promise<Metadata> => {
  const { query, type } = searchParams;
  return { title: `Search Results for ${capitalCase(query ?? type ?? 'N/A')}` };
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const SearchPage: NextPage<PageProps> = async ({ searchParams: { page, query, ...rest } }) => {
  const params = getAllValidParams(rest);
  const response = await advancedSearch({
    ...params,
    page: page ?? 1,
    query,
    type: rest?.type ?? 'multi'
  });
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <Typography>
            {`Search results`}
            {query && (
              <Typography component={'span'} fontWeight={700}>
                {` found for ${capitalCase(query ?? 'N/A')}`}
              </Typography>
            )}
          </Typography>
          <Typography fontWeight={700}>
            {response.total_results} {response.total_results > 1 ? 'results' : 'result'}
          </Typography>
        </Box>
        <SearchResults {...response} />
      </Box>
      <Box sx={{ width: { xs: '100%', md: '25%' }, order: { xs: 1, md: 2 } }}>
        <AdvancedSearchForm />
      </Box>
    </Box>
  );
};

export default SearchPage;
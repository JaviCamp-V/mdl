import { Metadata, NextPage } from 'next';
import { capitalCase } from 'change-case';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { getKeywordDetails, getSearchResults } from '@/server/tmdbActions';
import SearchResults from '@/components/SearchResults';
import NotFound from '@/components/common/NotFound';
import genres from '@/libs/genres';

type PageProps = {
  searchParams: { [key: string]: string };
};

const getSearchItem = async (query: string | undefined, genre: string | undefined, keyword: string | undefined) => {
  if (query) return query;
  if (genre) return genres.find((g) => g.id === Number(genre))?.name ?? genre;
  const response = await getKeywordDetails(Number(keyword));
  return response?.name || keyword;
};

export const generateMetadata = async ({ searchParams }: PageProps): Promise<Metadata> => {
  const { genre, keywords, query } = searchParams;
  const searchItem = await getSearchItem(query, genre, keywords);
  return { title: `Search Results for ${capitalCase(searchItem ?? 'N/A')}` };
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const SearchPage: NextPage<PageProps> = async ({ searchParams: { genre, keywords, query, page } }) => {
  const response = await getSearchResults({ genre, keywords, query, page });
  if (response.total_results === 0) return <NotFound />;
  const searchItem = await getSearchItem(query, genre, keywords);
  return (
    <Box
      sx={{
        padding: { xs: 0, md: 4 },
        marginX: 2,
        marginTop: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'Center'
      }}
    >
      <Box sx={{ width: { xs: '100%', md: '60%' } }}>
        <Typography marginBottom={2}>
          {`${response.total_results} results found for `}
          <Typography component={'span'} fontWeight={700}>
            {capitalCase(searchItem ?? 'N/A')}
          </Typography>
        </Typography>
        <SearchResults {...response} />
      </Box>
    </Box>
  );
};

export default SearchPage;

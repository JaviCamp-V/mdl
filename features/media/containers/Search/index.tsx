import React from 'react';
import { capitalCase } from 'change-case';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchResults from '../../components/lists/SearchResults';
import { getSearchResults } from '../../service/tmdbService';
import { getAllValidParams } from '../../utils/tmdbAdvancedSearch';

interface SearchContainerProps {
  searchParams: { [key: string]: string };
}
const SearchContainer: React.FC<SearchContainerProps> = async ({ searchParams: { page, query, ...rest } }) => {
  const params = getAllValidParams(rest);
  const response = await getSearchResults({
    ...params,
    page: page ?? 1,
    query,
    type: rest?.type ?? 'multi'
  });
  return (
    <React.Fragment>
      <Box id="search-results" sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography>
          {`Search results`}
          {query && (
            <Typography component={'span'} fontWeight={700}>
              {` found for ${capitalCase(query)}`}
            </Typography>
          )}
        </Typography>
        <Typography fontWeight={700}>
          {response.total_results} {response.total_results > 1 ? 'results' : 'result'}
        </Typography>
      </Box>
      <SearchResults {...response} />
    </React.Fragment>
  );
};

export default SearchContainer;

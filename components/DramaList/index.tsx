import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MediaType from '@/types/tmdb/IMediaType';
import { TVSearchResult } from '@/types/tmdb/ISearchResposne';
import { getOrigin, getYear } from '@/utils/tmdbUtils';
import EditWatchlistButton from '../Buttons/EditWatchlistButton';
import MediaTitle from '../MediaTitle';
import DramaPoster from '../Poster';
import Ratings from '../common/Ratings';

interface DramaListProps {
  dramas: TVSearchResult[];
  length?: number;
}
const DramaList: React.FC<DramaListProps> = ({ dramas, length = 5 }) => {
  return (
    <Box>
      {dramas.slice(0, length).map((result, index, arr) => (
        <Box
          key={result.id}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            marginBottom: 1,
            paddingX: 2,
            paddingY: 1,
            ...(index !== arr.length - 1 && {
              borderBottom: '1px solid hsla(210, 8%, 51%, .13)'
            })
          }}
        >
          <Typography color="#888" fontSize={16} fontWeight={700}>
            {index + 1}
          </Typography>
          <Box sx={{ width: 50, height: 80 }}>
            <DramaPoster src={result.poster_path} id={result.id} mediaType={MediaType.tv} size="w185" />
          </Box>
          <Box sx={{ width: '60%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <MediaTitle title={result.name} id={result.id} mediaType={MediaType.tv} fontSize={'14px'} />
              <EditWatchlistButton type={MediaType.tv} id={result.id} recordId={result.recordId} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Ratings rating={result.vote_average / 2} />
              <Typography fontSize={13}>{`${result.vote_average?.toFixed(1)}`}</Typography>
            </Box>
            <Typography fontSize={13}>{`${getOrigin(result)}`}</Typography>
            <Typography fontSize={13}>{`${result.vote_count?.toLocaleString()} Watchers`}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default DramaList;

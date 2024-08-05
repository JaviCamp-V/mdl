import { TVSearchResult } from '@/types/tmdb/ISearchResposne';
import React from 'react';

import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

import DramaPoster from '../Poster';
import MediaTitle from '../MediaTitle';

import MediaType from '@/types/tmdb/IMediaType';
import { color } from '@/libs/common';
import { getOrigin } from '@/utils/tmdbUtils';

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
            ...( index !== arr.length -1 && {borderBottom: '1px solid hsla(210, 8%, 51%, .13)'})
          }}
        >
          <Typography color="#888" fontSize={16} fontWeight={500}>
            {index + 1}
          </Typography>
          <Box sx={{ width: 70, height: 100 }}>
            <DramaPoster src={result.poster_path} id={result.id} mediaType={MediaType.tv} size="w185" />
          </Box>
          <Box sx={{width: "60%"}}>
            <MediaTitle title={result.name} id={result.id} mediaType={MediaType.tv} fontSize={14} />
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Rating name="read-only" value={result.vote_average / 2} precision={0.1} readOnly />
              <Typography color={color} fontSize={13}>{`${result.vote_average.toFixed(1)}`}</Typography>
            </Box>
            <Typography color={color} fontSize={13}>{`${getOrigin(result)}`}</Typography>
            <Typography color={color} fontSize={13}>{`${result.vote_count.toLocaleString()} Watchers`}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default DramaList;

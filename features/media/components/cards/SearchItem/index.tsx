import React from 'react';
import PlayButton from '@/features/media/components/buttons/PlayButton';
import { MediaSearchResult, PersonSearchResult } from '@/features/media/types/interfaces/SearchResponse';
import { getOrigin, getYear } from '@/features/media/utils/tmdbUtils';
import EditWatchlistButton from '@/features/watchlist/components/buttons/EditWatchlistButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MediaTitle from '@/components/MediaTitle';
import DramaPoster from '@/components/Poster';
import Ratings from '@/components/common/Ratings';


interface SearchItemProps {
  details: MediaSearchResult | PersonSearchResult;
}

const SearchItemCard: React.FC<SearchItemProps> = ({ details }) => {
  const { media_type, id } = details;
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        boxShadow: '0 1px 1px rgba(0,0,0,.1)',
        border: '1px solid rgba(0,0,0,.14)',
        borderRadius: 2,
        overflow: 'hidden',
        padding: 2,
        paddingX: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: 'row',
        gap: 2.5
      }}
    >
      <Box sx={{ width:   {xs: '35%', md:'25%'}, height: '100%' }}>
        <Box sx={{ width: '100%', height: '35vh' }}>
          <DramaPoster
            src={media_type === 'person' ? details.profile_path : details.poster_path}
            id={id}
            mediaType={media_type}
            size="w500"
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: {xs: "65%", md:'75%'},
          paddingRight: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <MediaTitle
            title={media_type === 'movie' ? details.title : details.name}
            id={id}
            mediaType={media_type}
            fontSize={'1rem'}
          />
          {media_type !== 'person' && <EditWatchlistButton type={media_type} id={id} recordId={details.recordId} />}
        </Box>

        {media_type === 'person' ? (
          <Box>
            <Typography sx={{ opacity: 0.6 }} fontSize={14}>
              {details.place_of_birth}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography sx={{ opacity: 0.6 }} fontSize={14}>{`${getOrigin(details)} - ${getYear(details)}`}</Typography>
            <Ratings rating={details.vote_average} />
          </Box>
        )}
        <Typography
          sx={{
            overflow: 'hidden',
            fontSize: 14,
            lineHeight: 1.5,
            textOverflow: 'ellipsis',
            display: '-webkit-box', // Required for multiline truncation
            WebkitBoxOrient: 'vertical', // Required for multiline truncation
            WebkitLineClamp: { xs: 5, md: 4 }, // Adjust the number of lines before truncating
            lineClamp: { xs: 5, md: 4 } // For other browsers
          }}
        >
          {media_type === 'person' ? details.biography : details.overview}
        </Typography>
        {media_type !== 'person' && details.trailer && (
          <Box sx={{ width: '40%' }}>
            <PlayButton video={details.trailer as any} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SearchItemCard;
import React from 'react';
import { Grid, Rating, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import MediaTitle from '@/components/MediaTitle';
import DramaPoster from '@/components/Poster';
import { MediaSearchResult, PersonSearchResult } from '@/types/tmdb/ISearchResposne';
import { getOrigin, getYear } from '@/utils/tmdbUtils';
import { color } from '@/libs/common';

interface SearchItemProps {
  details: MediaSearchResult | PersonSearchResult;
}

const SearchItem: React.FC<SearchItemProps> = ({ details }) => {
  const { media_type, id } = details;
  return (
    <Box
      sx={{
        backgroundColor: '#242526',
        borderRadius: 2,
        overflow: 'hidden',
        height: '35vh',
        padding: 2
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6} md={3} sx={{ height: '38vh' }}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <DramaPoster
              src={media_type === 'person' ? details.profile_path : details.poster_path}
              id={id}
              mediaType={media_type}
              size="w185"
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          md={8}
          sx={{
            paddingRight: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <MediaTitle title={media_type === 'movie' ? details.title : details.name} id={id} mediaType={media_type} />
          {media_type === 'person' ? (
            <Box>
              <Typography color={color} sx={{ opacity: 0.6 }}>
                {details.place_of_birth}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography
                color={color}
                sx={{ opacity: 0.6 }}
              >{`${getOrigin(details)} - ${getYear(details)}`}</Typography>
              <Rating name="read-only" value={details.vote_average / 2} precision={0.1} readOnly />
            </Box>
          )}
          <Typography
            color={color}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box', // Required for multiline truncation
              WebkitBoxOrient: 'vertical', // Required for multiline truncation
              WebkitLineClamp: { xs: 5, md: 4 }, // Adjust the number of lines before truncating
              lineClamp: { xs: 5, md: 4 } // For other browsers
            }}
          >
            {media_type === 'person' ? details.biography : details.overview}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchItem;

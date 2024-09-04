import React from 'react';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@/components/common/Divider';
import Ratings from '@/components/common/Ratings';

interface ScoreProps {
  vote_average: number;
  vote_count: number;
  recordRating: number;
  number_of_watchers?: number;
  number_of_reviews?: number;
}
const ContentScore: React.FC<ScoreProps> = ({
  vote_average,
  vote_count,
  number_of_reviews = 0,
  number_of_watchers = 0,
  recordRating = 0
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
        <Box
          sx={{
            backgroundColor: vote_average ? '#F0632B' : '#A96F5C',
            width: 80,
            height: 80,
            border: '1px solid rgba(0,0,0,.14)',
            borderRadius: '4px',
            lineHeight: '75px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography fontSize={32} color="hsl(0deg 0% 100% / 87%)">
            {vote_average ? vote_average.toFixed(1) : 'N/A'}
          </Typography>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0 }}>
            <Typography fontSize={14} sx={{ opacity: 0.6 }}>
              Your Rating:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Ratings rating={recordRating} showText />
            </Box>
          </Box>
          {Boolean(vote_count) && (
            <Typography
              fontSize={14}
            >{`Ratings: ${vote_average.toFixed(1)}/10 from ${vote_count.toLocaleString()} users`}</Typography>
          )}
          <Typography fontSize={14}>{`# of Watchers: ${number_of_watchers.toLocaleString()}`}</Typography>
          <Typography fontSize={14}>{`Reviews:  ${number_of_reviews.toLocaleString()} users`}</Typography>
        </Box>
      </Box>
      <Divider marginY={1} />
    </Box>
  );
};

export default ContentScore;
import React from 'react';
import { capitalCase } from 'change-case';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@/components/common/Divider';

interface ReviewRatingCardProps {
  overallRating: number;
  storyRating: number;
  actingRating: number;
  musicRating: number;
  rewatchValueRating: number;
}
const ReviewRatingCard: React.FC<ReviewRatingCardProps> = ({
  overallRating,
  storyRating,
  actingRating,
  musicRating,
  rewatchValueRating
}) => {
  const ratings = { overallRating, storyRating, actingRating, musicRating, rewatchValueRating };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        borderRadius: '4px',
        boxShadow: '0 1px 1px rgba(0,0,0,.1)',
        border: '1px solid rgba(0,0,0,.14)',
        width: 'max-content',
        // width: { xs: '40%', sm: '30%', md: '25%' },
        margin: 1,
        padding: 2,
        gap: 0.5,
        float: 'right'
      }}
    >
      {Object.entries(ratings).map(([key, value]) => (
        <React.Fragment key={key}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 2 }}>
            <Typography
              fontSize={13}
              fontWeight={key === 'overallRating' ? 700 : 400}
              color={key === 'overallRating' ? 'primary' : 'text.main'}
            >
              {capitalCase(key?.replace('Rating', ''))}
              <Typography
                fontWeight={'inherit'}
                color={'inherit'}
                fontSize={'inherit'}
                component={'span'}
                sx={{ display: { xs: 'none', md: 'inline' }, paddingLeft: 0.5 }}
              >
                Rating
              </Typography>
            </Typography>
            <Typography
              fontSize={13}
              fontWeight={key === 'overallRating' ? 700 : 400}
              color={key === 'overallRating' ? 'primary' : 'text.main'}
            >
              {value.toFixed(1)}
            </Typography>
          </Box>
          {key === 'overallRating' && <Divider marginY={0.5} />}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default ReviewRatingCard;

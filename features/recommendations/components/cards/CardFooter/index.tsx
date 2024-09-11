import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@/components/common/Link';
import { formatDateToDistance, formatStringDate } from '@/utils/formatters';
import routes from '@/libs/routes';
import RecommendationLikeButton from '../../buttons/LikeButton';

interface RecommendationCardFooterProps {
  recommendationID: number;
  username?: string;
  displayName?: string;
  createdAt: string;
  hasUserLiked: boolean;
  numberOfLikes: number;
}
const RecommendationCardFooter: React.FC<RecommendationCardFooterProps> = ({
  recommendationID,
  username,
  displayName,
  createdAt,
  hasUserLiked,
  numberOfLikes
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 1
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, flexWrap: 'wrap' }}>
        {username && displayName && (
          <React.Fragment>
            <Typography fontSize={14}>
              {'Recommended by '}
              <Link href={`${routes.user.profile.replace('{username}', username)}`}>{displayName}</Link>
            </Typography>
            <Typography fontSize={14} sx={{ opacity: 0.6 }}>{` - `}</Typography>
          </React.Fragment>
        )}
        <Typography fontSize={14} sx={{ opacity: 0.6 }}>
          {formatDateToDistance(createdAt)}
        </Typography>
      </Box>
      <RecommendationLikeButton
        hasUserLiked={hasUserLiked}
        numberOfLikes={numberOfLikes}
        recommendationID={recommendationID}
      />
    </Box>
  );
};

export default RecommendationCardFooter;

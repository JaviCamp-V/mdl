'use client';

import React from 'react';
import { updateRecommendationLike } from '@/features/recommendations/service/recommendationService';
import Recommendation, { RecommendationWithLikes } from '@/features/recommendations/types/interface/Recommendation';
import { Suggestion } from '@/features/recommendations/types/interface/Suggestion';
import EditWatchlistButton from '@/features/watchlist/components/buttons/EditWatchlistButton';
import { useSession } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import Iconify from '@/components/Icon/Iconify';
import MediaTitle from '@/components/MediaTitle';
import DramaPoster from '@/components/Poster';
import Link from '@/components/common/Link';
import Ratings from '@/components/common/Ratings';
import MediaType from '@/types/enums/IMediaType';
import routes from '@/libs/routes';
import RecommendationLikeButton from '../../buttons/LikeButton';
import RecommendationReason from '../../typography/Reason';
import RecommendationCardFooter from '../CardFooter';
import RecommendationCard from '../RecCard';
import SuggestionCardHeader from './Header';

interface GroupedSuggestionCardProps {
  suggestion: Suggestion;
}

const GroupedSuggestionCard: React.FC<GroupedSuggestionCardProps> = ({ suggestion }) => {
  const hasMultipleRecommendations = suggestion.recommendations.length > 1;
  const [showMore, setShowMore] = React.useState<boolean>(false);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Box sx={{ width: '15%' }}>
        <Box
          sx={{
            position: 'relative',
            width: { xs: '100%', md: '100%' },
            height: { xs: '15vh', sm: '20vh', lg: '25vh' }
          }}
        >
          <DramaPoster
            src={suggestion.poster_path}
            mediaType={suggestion.mediaType}
            id={suggestion.mediaId}
            size="w342"
          />
        </Box>
      </Box>
      <Box sx={{ width: '85%' }}>
        <SuggestionCardHeader
          title={suggestion.title}
          mediaId={suggestion.mediaId}
          mediaType={suggestion.mediaType}
          recordId={suggestion.recordId}
          voteAverage={suggestion.vote_average}
        />

        <Grid container spacing={0} rowSpacing={1.5} sx={{ width: '100%' }}>
          {suggestion.recommendations
            .slice(0, showMore ? suggestion.recommendations.length : 1)
            .map((recommendation, index) => (
              <React.Fragment key={recommendation.id}>
                <Grid item xs={12}>
                  <RecommendationCard
                    hasUserLiked={recommendation.hasUserLiked}
                    numberOfLikes={recommendation.numberOfLikes}
                    username={recommendation.user.username}
                    displayName={recommendation.user.displayName}
                    recommendationID={recommendation.id}
                    createdAt={recommendation.createdAt}
                    reason={recommendation.reason}
                  />
                </Grid>
                {hasMultipleRecommendations && index === 0 && (
                  <Grid item xs={12}>
                    <Typography
                      fontSize={14}
                      sx={{ cursor: 'pointer', color: 'primary.main', pointerEvents: 'auto' }}
                      onClick={() => setShowMore(!showMore)}
                    >
                      {showMore
                        ? 'Hide Recommendations'
                        : `Show recommendations by ${suggestion.recommendations.length - 1} other users`}
                    </Typography>
                  </Grid>
                )}
              </React.Fragment>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default GroupedSuggestionCard;
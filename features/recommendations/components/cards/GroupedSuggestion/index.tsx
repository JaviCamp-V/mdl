'use client';

import React from 'react';
import Recommendation from '@/features/recommendations/types/interface/Recommendation';
import { Suggestion } from '@/features/recommendations/types/interface/Suggestion';
import EditWatchlistButton from '@/features/watchlist/components/buttons/EditWatchlistButton';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import Iconify from '@/components/Icon/Iconify';
import MediaTitle from '@/components/MediaTitle';
import DramaPoster from '@/components/Poster';
import Link from '@/components/common/Link';
import Ratings from '@/components/common/Ratings';
import MediaType from '@/types/enums/IMediaType';
import routes from '@/libs/routes';

interface GroupedSuggestionCardProps {
  suggestion: Suggestion;
}

interface LikeActionProps {
  mediaId: number;
  mediaType: MediaType.tv | MediaType.movie;
  recommendationID: number;
  hasUserLiked: boolean;
  numberOfLikes: number;
}

const LikeAction: React.FC<LikeActionProps> = ({ hasUserLiked, numberOfLikes }) => {
  const onClick = async () => {};
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 0.5 }}>
      <Typography fontSize={14}>{numberOfLikes}</Typography>
      <IconButton sx={{ margin: 0, padding: 0 }}>
        <Iconify icon="mdi:heart-outline" color={hasUserLiked ? '#FF007F' : 'text.primary'} width={14} height={14} />
      </IconButton>
    </Box>
  );
};

const RecommendationCard: React.FC<Recommendation> = ({ reason, user, numberOfLikes, hasUserLiked, source, id }) => (
  <Box sx={{ backgroundColor: 'background.default', padding: 2, width: '100%' }}>
    <Typography
      fontSize={14}
      lineHeight={1.5}
      sx={{
        whiteSpace: 'pre-wrap'
      }}
    >
      {reason}
    </Typography>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 1
      }}
    >
      <Typography fontSize={14}>
        {'Recommended by '}
        <Link href={`${routes.user.profile.replace('{username}', user.username)}`}>{user.username}</Link>
      </Typography>
      <LikeAction
        hasUserLiked={hasUserLiked}
        numberOfLikes={numberOfLikes}
        mediaType={source.mediaType}
        mediaId={source.mediaId}
        recommendationID={id}
      />
    </Box>
  </Box>
);

interface CardHeaderProps {
  title: string;
  mediaId: number;
  mediaType: MediaType.tv | MediaType.movie;
  recordId: number | null;
  voteAverage: number;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, mediaId, mediaType, recordId, voteAverage }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 0.5,
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          marginBottom: 2
        }}
      >
        <MediaTitle title={title} id={mediaId} mediaType={mediaType} fontSize={'14px'} />
        <EditWatchlistButton type={mediaType} id={mediaId} recordId={recordId} />
      </Box>
      <Ratings rating={voteAverage} showText />
    </Box>
  );
};

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
            height: { xs: '20vh', sm: '35vh', lg: '25vh' }
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
        <CardHeader
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
                <Grid item xs={12} key={index}>
                  <RecommendationCard key={index} {...recommendation} />
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
